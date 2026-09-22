import { NextRequest, NextResponse } from "next/server";
import { createInspirationUploadTargets } from "@/lib/supabase/admin";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_FILES = 5;

type FileDescriptor = { filename: string; contentType: string; size: number };

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      submissionId?: string;
      files?: FileDescriptor[];
    };

    if (!body.submissionId || !UUID_RE.test(body.submissionId)) {
      return NextResponse.json(
        { error: "A valid submissionId is required." },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.files) || body.files.length === 0) {
      return NextResponse.json({ error: "No files provided." }, { status: 400 });
    }

    const files = body.files.slice(0, MAX_FILES).filter(
      (f): f is FileDescriptor =>
        !!f &&
        typeof f.filename === "string" &&
        typeof f.contentType === "string" &&
        typeof f.size === "number"
    );

    if (files.length === 0) {
      return NextResponse.json({ error: "No valid files provided." }, { status: 400 });
    }

    const { targets, errors } = await createInspirationUploadTargets(
      body.submissionId,
      files
    );

    return NextResponse.json({ targets, errors });
  } catch (err) {
    console.error("[Order] inspiration-upload-urls error:", err);
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
