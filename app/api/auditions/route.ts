import { NextRequest, NextResponse } from "next/server";
import { validateAuditionSubmission } from "@/lib/auditions";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const validation = validateAuditionSubmission(await request.json());

    if (!validation.ok) {
      return NextResponse.json(
        { error: validation.errors.join(" ") },
        { status: 400 },
      );
    }

    const audition = validation.value;
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("auditions").insert({
      audition_type: audition.auditionType,
      audition_url: audition.auditionUrl ?? null,
      audition_storage_path: audition.auditionStoragePath ?? null,
      name: audition.name,
      email: audition.email,
      phone: audition.phone ?? null,
      instrument: audition.instrument,
      musical_taste: audition.musicalTaste,
      availability: audition.availability,
      location: audition.location ?? null,
      message: audition.message ?? null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not save the audition.",
      },
      { status: 500 },
    );
  }
}
