// components/RestrictedPDFViewer.tsx
"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";

interface RestrictedPDFViewerProps {
  fileUrl: string;
  fileName: string;
  onClose: () => void;
}

export function RestrictedPDFViewer({
  fileUrl,
  fileName,
  onClose,
}: RestrictedPDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Prevent right-click and context menu
  const preventRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  // Prevent text selection
  const preventSelection = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">{fileName}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Viewer */}
        <div className="flex-1 overflow-auto p-4">
          <div
            className="relative bg-gray-100 rounded-lg"
            onContextMenu={preventRightClick}
            onMouseDown={preventSelection}
          >
            {/* PDF Display */}
            <div className="text-center py-8">
              <iframe
                src={fileUrl}
                className="w-full h-[70vh] border-0"
                title="PDF Viewer"
              />

              {/* Overlay to prevent interactions */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "transparent",
                  zIndex: 10,
                }}
              />
            </div>

            {/* Watermark */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div
                className="text-gray-400 text-opacity-20 text-6xl font-bold rotate-45 select-none"
                style={{
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  MozUserSelect: "none",
                  msUserSelect: "none",
                }}
              >
                PREVIEW ONLY
              </div>
            </div>
          </div>
        </div>

        {/* Footer with restricted message */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              ⚠️ Downloading is disabled for viewing. Contact admin for full
              access.
            </p>
            <Button onClick={onClose} variant="outline">
              Close Viewer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
