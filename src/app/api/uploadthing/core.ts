// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  pastQuestionUploader: f({
    pdf: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      // We'll pass metadata from the frontend
      const url = new URL(req.url);
      const university = url.searchParams.get("university");
      const faculty = url.searchParams.get("faculty");

      return {
        university: university || "unknown",
        faculty: faculty || "unknown",
        timestamp: new Date().toISOString(),
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for:", {
        university: metadata.university,
        faculty: metadata.faculty,
        file: file.name,
      });

      return {
        uploadedBy: metadata.university,
        faculty: metadata.faculty,
        fileInfo: {
          url: file.url,
          name: file.name,
          size: file.size,
        },
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
