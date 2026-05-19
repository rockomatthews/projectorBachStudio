import { NextRequest, NextResponse } from "next/server";
import {
  AUDITION_BUCKET,
  MAX_AUDITION_FILE_BYTES,
  cleanFileName,
  isAcceptedAuditionType,
} from "@/lib/auditions";
import { getSupabaseAdmin } from "@/lib/supabase/server";

type UploadRequest = {
  fileName?: unknown;
  fileType?: unknown;
  fileSize?: unknown;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as UploadRequest;
    const fileName =
      typeof body.fileName === "string" ? body.fileName : "audition";
    const fileType = typeof body.fileType === "string" ? body.fileType : "";
    const fileSize = typeof body.fileSize === "number" ? body.fileSize : 0;

    if (!fileType || !isAcceptedAuditionType(fileType)) {
      return NextResponse.json(
        { error: "Upload an MP3, WAV, M4A, AAC, MP4, MOV, or WEBM file." },
        { status: 400 },
      );
    }

    if (fileSize <= 0 || fileSize > MAX_AUDITION_FILE_BYTES) {
      return NextResponse.json(
        { error: "Audition files must be 100 MB or smaller." },
        { status: 400 },
      );
    }

    const safeFileName = cleanFileName(fileName) || "audition";
    const path = `auditions/${crypto.randomUUID()}-${safeFileName}`;
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.storage
      .from(AUDITION_BUCKET)
      .createSignedUploadUrl(path);

    if (error || !data?.signedUrl) {
      return NextResponse.json(
        { error: error?.message || "Could not create an upload URL." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      path,
      token: data.token,
      signedUrl: data.signedUrl,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not prepare the audition upload.",
      },
      { status: 500 },
    );
  }
}
