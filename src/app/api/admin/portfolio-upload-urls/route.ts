import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin-auth";
import { createPortfolioUploadTargets } from "@/lib/supabase/admin";

const MAX_FILES = 20;

type FileDescriptor = { filename: string; contentType: string; size: number };

export async function POST(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { files?: FileDescriptor[] };

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

    const { targets, errors } = await createPortfolioUploadTargets(files);
    return NextResponse.json({ targets, errors });
  } catch (err) {
    console.error("[Admin] portfolio-upload-urls error:", err);
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
