"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  ACCEPTED_AUDITION_TYPES,
  AUDITION_BUCKET,
  INSTRUMENT_OPTIONS,
  MAX_AUDITION_FILE_BYTES,
  type AuditionType,
} from "@/lib/auditions";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

type SignedUploadResponse = {
  path: string;
  token: string;
  signedUrl: string;
};

const initialStatus = {
  kind: "idle" as "idle" | "error" | "success",
  message: "",
};

export function AuditionForm() {
  const [auditionType, setAuditionType] = useState<AuditionType>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState(initialStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const acceptedTypes = useMemo(() => ACCEPTED_AUDITION_TYPES.join(","), []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setIsSubmitting(true);
    setStatus(initialStatus);

    const formData = new FormData(form);

    try {
      let auditionStoragePath = "";

      if (auditionType === "upload") {
        if (!file) {
          throw new Error("Upload an audition file first.");
        }

        if (file.size > MAX_AUDITION_FILE_BYTES) {
          throw new Error("Audition files must be 100 MB or smaller.");
        }

        const signedUpload = await createSignedUpload(file);
        const { error: uploadError } = await getSupabaseBrowser()
          .storage
          .from(AUDITION_BUCKET)
          .uploadToSignedUrl(signedUpload.path, signedUpload.token, file, {
            contentType: file.type || "application/octet-stream",
          });

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        auditionStoragePath = signedUpload.path;
      }

      const response = await fetch("/api/auditions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          auditionType,
          auditionUrl: String(formData.get("auditionUrl") || ""),
          auditionStoragePath,
          name: String(formData.get("name") || ""),
          email: String(formData.get("email") || ""),
          phone: String(formData.get("phone") || ""),
          instrument: String(formData.get("instrument") || ""),
          musicalTaste: String(formData.get("musicalTaste") || ""),
          availability: String(formData.get("availability") || ""),
          location: String(formData.get("location") || ""),
          message: String(formData.get("message") || ""),
        }),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Submission failed.");
      }

      form.reset();
      setFile(null);
      setAuditionType("upload");
      setStatus({
        kind: "success",
        message: "Audition received. The ritual has begun.",
      });
    } catch (error) {
      setStatus({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="audition-form" onSubmit={handleSubmit}>
      <div className="audition-choice">
        <span className="choice-label">First: show the sound</span>
        <div className="radio-row">
          <label className="radio-card">
            <input
              type="radio"
              name="auditionMode"
              checked={auditionType === "upload"}
              onChange={() => setAuditionType("upload")}
            />
            <span>Upload an audition</span>
            <small>Audio or video, 100 MB max.</small>
          </label>
          <label className="radio-card">
            <input
              type="radio"
              name="auditionMode"
              checked={auditionType === "link"}
              onChange={() => setAuditionType("link")}
            />
            <span>Link to one</span>
            <small>YouTube, SoundCloud, Drive, Bandcamp, wherever.</small>
          </label>
        </div>
      </div>

      <div className="form-grid">
        {auditionType === "upload" ? (
          <label className="field full">
            <span>Audition file</span>
            <input
              type="file"
              accept={acceptedTypes}
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
            <small className="helper">
              Accepted: MP3, WAV, M4A, AAC, MP4, MOV, or WEBM.
            </small>
          </label>
        ) : (
          <label className="field full">
            <span>Audition link</span>
            <input
              name="auditionUrl"
              type="url"
              placeholder="https://youtube.com/watch?v=..."
            />
          </label>
        )}

        <label className="field">
          <span>Name</span>
          <input name="name" autoComplete="name" required />
        </label>

        <label className="field">
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>

        <label className="field">
          <span>Phone</span>
          <input name="phone" type="tel" autoComplete="tel" />
        </label>

        <label className="field">
          <span>Instrument</span>
          <select name="instrument" required defaultValue="">
            <option value="" disabled>
              Pick your weapon
            </option>
            {INSTRUMENT_OPTIONS.map((instrument) => (
              <option key={instrument} value={instrument}>
                {instrument}
              </option>
            ))}
          </select>
        </label>

        <label className="field full">
          <span>Musical taste</span>
          <input
            name="musicalTaste"
            required
            placeholder="Meshuggah, Bach, Ministry, doom jazz, mall goth..."
          />
        </label>

        <label className="field">
          <span>Availability</span>
          <input
            name="availability"
            required
            placeholder="Weeknights, weekends, tour-ready, chaos only..."
          />
        </label>

        <label className="field">
          <span>Location</span>
          <input name="location" placeholder="Park City, SLC, Heber..." />
        </label>

        <label className="field full">
          <span>Why should Projector Bach put a mask on you?</span>
          <textarea
            name="message"
            placeholder="Tell us about your rig, stage experience, influences, and what level of volume you can survive."
          />
        </label>
      </div>

      <div className="submit-row">
        <button className="submit-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Summoning..." : "Submit audition"}
        </button>
        {status.message ? (
          <p className={`status ${status.kind}`}>{status.message}</p>
        ) : null}
      </div>
    </form>
  );
}

async function createSignedUpload(file: File) {
  const response = await fetch("/api/auditions/sign-upload", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    }),
  });

  const result = (await response.json()) as SignedUploadResponse & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(result.error || "Could not prepare the upload.");
  }

  return result;
}
