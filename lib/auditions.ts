export const AUDITION_BUCKET = "auditions";
export const MAX_AUDITION_FILE_BYTES = 100 * 1024 * 1024;

export const ACCEPTED_AUDITION_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/aac",
  "video/mp4",
  "video/quicktime",
  "video/webm",
] as const;

export const INSTRUMENT_OPTIONS = [
  "Guitar",
  "Bass",
  "Drums",
  "Vocals",
  "Synth / keys",
  "Noise / electronics",
  "Strings",
  "Other",
] as const;

export type AuditionType = "upload" | "link";

export type AuditionSubmission = {
  auditionType: AuditionType;
  auditionUrl?: string;
  auditionStoragePath?: string;
  name: string;
  email: string;
  phone?: string;
  instrument: string;
  musicalTaste: string;
  availability: string;
  location?: string;
  message?: string;
};

type ValidationResult =
  | { ok: true; value: AuditionSubmission }
  | { ok: false; errors: string[] };

export function isAcceptedAuditionType(type: string) {
  return ACCEPTED_AUDITION_TYPES.includes(
    type as (typeof ACCEPTED_AUDITION_TYPES)[number],
  );
}

export function validateAuditionSubmission(input: unknown): ValidationResult {
  if (!input || typeof input !== "object") {
    return { ok: false, errors: ["Submission payload is missing."] };
  }

  const data = input as Record<string, unknown>;
  const auditionType = data.auditionType;
  const errors: string[] = [];

  if (auditionType !== "upload" && auditionType !== "link") {
    errors.push("Choose whether you are uploading an audition or linking one.");
  }

  const requiredTextFields = [
    ["name", "Name"],
    ["email", "Email"],
    ["instrument", "Instrument"],
    ["musicalTaste", "Musical taste"],
    ["availability", "Availability"],
  ] as const;

  for (const [key, label] of requiredTextFields) {
    if (!isNonEmptyString(data[key])) {
      errors.push(`${label} is required.`);
    }
  }

  if (isNonEmptyString(data.email) && !data.email.includes("@")) {
    errors.push("Enter a real email address.");
  }

  if (auditionType === "link") {
    if (!isNonEmptyString(data.auditionUrl)) {
      errors.push("Paste a link to your audition.");
    } else if (!isValidUrl(data.auditionUrl)) {
      errors.push("Audition link must be a valid URL.");
    }
  }

  if (auditionType === "upload" && !isNonEmptyString(data.auditionStoragePath)) {
    errors.push("Upload an audition file before submitting.");
  }

  if (errors.length > 0 || (auditionType !== "upload" && auditionType !== "link")) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      auditionType,
      auditionUrl: optionalString(data.auditionUrl),
      auditionStoragePath: optionalString(data.auditionStoragePath),
      name: String(data.name).trim(),
      email: String(data.email).trim(),
      phone: optionalString(data.phone),
      instrument: String(data.instrument).trim(),
      musicalTaste: String(data.musicalTaste).trim(),
      availability: String(data.availability).trim(),
      location: optionalString(data.location),
      message: optionalString(data.message),
    },
  };
}

export function cleanFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function optionalString(value: unknown) {
  return isNonEmptyString(value) ? value.trim() : undefined;
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
