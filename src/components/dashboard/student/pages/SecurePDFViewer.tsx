"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface SecurePDFViewerProps {
  fileUrl: string;
  fileName: string;
  onClose: () => void;
}

export function SecurePDFViewer({
  fileUrl,
  fileName,
  onClose,
}: SecurePDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Prevent keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Ctrl+S, Ctrl+P, etc.
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        return false;
      }

      // Block F12, Print Screen, etc.
      if ([123, 44, 91, 93].includes(e.keyCode)) {
        e.preventDefault();
        return false;
      }
    };

    // Block right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Block drag & drop
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("dragstart", handleDragStart);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{fileName}</h3>
            <p className="text-sm text-gray-600">Secure Viewing Mode</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl bg-white rounded-full w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* PDF Container */}
        <div className="flex-1 overflow-hidden relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading secure viewer...</p>
              </div>
            </div>
          )}

          <div className="relative w-full h-full">
            {/* Secure iframe with restrictions */}
            <iframe
              src={`${fileUrl}#toolbar=0&navpanes=0`}
              className="w-full h-full border-0"
              title="Secure PDF Viewer"
              onLoad={() => setIsLoading(false)}
              sandbox="allow-scripts allow-same-origin"
              style={{
                pointerEvents: "auto",
              }}
            />

            {/* Multiple overlay layers for protection */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(45deg, transparent 98%, rgba(255,0,0,0.1) 98%)",
                zIndex: 5,
              }}
            />

            {/* Watermark overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div
                className="text-red-300 text-opacity-10 text-8xl font-bold rotate-45 select-none"
                style={{
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  MozUserSelect: "none",
                  msUserSelect: "none",
                  pointerEvents: "none",
                }}
              >
                PREVIEW
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-4 border-t bg-red-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-red-700 font-medium">
                Protected View: Downloading, printing, and copying are disabled
              </p>
            </div>
            <Button onClick={onClose} variant="outline" size="sm">
              Exit Viewer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
