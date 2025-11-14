
import React, { useCallback } from 'react';
import { ImageFile } from '../types';
import { UploadIcon } from './Icons';
import { tr } from '../constants/translations';

interface ImageUploaderProps {
  onImageUpload: (imageFile: ImageFile) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const handleFileChange = useCallback((files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        // Simple validation
        alert("Lütfen bir resim dosyası seçin.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = (e.target?.result as string).split(',')[1];
        onImageUpload({
          name: file.name,
          type: file.type,
          size: file.size,
          base64: base64,
        });
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.remove('border-purple-500');
    handleFileChange(event.dataTransfer.files);
  }, [handleFileChange]);

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.add('border-purple-500');
  };
  
  const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.remove('border-purple-500');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
      <div 
        className="w-full max-w-2xl mx-auto flex items-center justify-center"
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-80 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <UploadIcon />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold text-purple-600 dark:text-purple-400">{tr.clickToUpload}</span> {tr.orDragAndDrop}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">{tr.imageFormats}</p>
          </div>
          <input id="file-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={(e) => handleFileChange(e.target.files)} />
        </label>
      </div>
    </div>
  );
};

export default ImageUploader;
