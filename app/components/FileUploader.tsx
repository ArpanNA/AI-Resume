import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

// Converts bytes to a human-readable string (KB, MB, GB)
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] || null;
      onFileSelect?.(file);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 20 * 1024 * 1024, // 20 MB
  });

  const file = acceptedFiles[0] || null;

  return (
    <div className="w-full gradient-border">
      <div {...getRootProps()} className="cursor-pointer p-4">
        <input {...getInputProps()} />

        {file ? (
          <div
            className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-3">
              <img src="/images/pdf.png" alt="pdf" className="w-10 h-10" />
              <div>
                <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
              </div>
            </div>
            <button
              type="button"
              className="p-2 hover:bg-gray-200 rounded"
              onClick={(e) => {
                e.stopPropagation(); // prevent reopening file picker
                onFileSelect?.(null);
                acceptedFiles.length = 0; // clears Dropzone's state
              }}
            >
              <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
              <img src="/icons/info.svg" alt="upload" className="w-16 h-16" />
            </div>
            <p className="text-lg text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-lg text-gray-500">PDF (max 20 MB)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
