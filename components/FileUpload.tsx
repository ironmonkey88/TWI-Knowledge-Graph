import React from 'react';

interface FileUploadProps {
  onAddFiles: () => void;
  disabled: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onAddFiles, disabled }) => {
  return (
    <div className="flex justify-center my-4">
      <button
        onClick={onAddFiles}
        disabled={disabled}
        className="px-8 py-4 bg-amber-600 text-stone-900 font-bold rounded-lg shadow-md hover:bg-amber-500 disabled:bg-stone-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
      >
        Upload Book Files (.txt, .epub)
      </button>
    </div>
  );
};