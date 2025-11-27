import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "uploads/pdfs");
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureUploadDir();

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const topic = formData.get("topic") as string;
    const course = formData.get("course") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    // Generate unique file ID
    const fileId = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 15)}`;
    const fileName = `${fileId}.pdf`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    console.log(`✅ PDF uploaded successfully: ${fileName}`);
    console.log(`File details:`, {
      originalName: file.name,
      size: file.size,
      topic: topic,
      course: course,
    });
    console.log(`Topic: ${topic}, Course: ${course}, Size: ${file.size} bytes`);

    return NextResponse.json({
      success: true,
      fileId: fileId,
      fileName: file.name,
      title: topic || "PDF Document",
      size: file.size,
      uploadedAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("PDF upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload PDF. Please try again." },
      { status: 500 }
    );
  }
}
