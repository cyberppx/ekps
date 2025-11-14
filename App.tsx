import React, { useState, useCallback } from 'react';
import { ImageFile } from './types';
import { editImageWithGemini } from './services/geminiService';
import EditorPanel from './components/EditorPanel';
import ImageComparator from './components/ImageViewer';
import ImageUploader from './components/ImageUploader';
import Loader from './components/Loader';
import { SparklesIcon, MoonIcon, SunIcon, ArrowPathIcon } from './components/Icons';
import { useTheme } from './hooks/useTheme';
import { tr } from './constants/translations';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<ImageFile | null>(null);
  const [editedImage, setEditedImage] = useState<ImageFile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>(tr.processing);
  const [error, setError] = useState<string | null>(null);
  const [theme, toggleTheme] = useTheme();

  const handleImageUpload = (imageFile: ImageFile) => {
    setOriginalImage(imageFile);
    setEditedImage(imageFile); // Start with edited being the same as original
    setError(null);
  };
  
  const resetApp = () => {
    setOriginalImage(null);
    setEditedImage(null);
    setError(null);
  }

  const handleEdit = useCallback(async (prompt: string, message: string) => {
    if (!originalImage) {
      setError(tr.uploadFirst);
      return;
    }
    setIsLoading(true);
    setLoadingMessage(message);
    setError(null);
    try {
      const newImageBase64 = await editImageWithGemini(originalImage.base64, originalImage.type, prompt);
      setEditedImage({ ...originalImage, base64: newImageBase64 });
    } catch (err) {
      setError(tr.editFailed);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [originalImage]);

  if (!originalImage) {
    return <ImageUploader onImageUpload={handleImageUpload} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex flex-col h-screen">
      {isLoading && <Loader message={loadingMessage} />}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg p-3 shadow-sm flex justify-between items-center z-20 sticky top-0 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center gap-3">
          <SparklesIcon className="text-purple-500" />
          <h1 className="text-xl font-bold tracking-tight">{tr.auraEdit}</h1>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={resetApp} title="Yeni Resim Yükle" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
             <ArrowPathIcon />
           </button>
           <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
             {theme === 'light' ? <MoonIcon /> : <SunIcon />}
           </button>
        </div>
      </header>
      
      {error && (
        <div className="bg-red-500/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 px-4 py-3 m-4 rounded-lg relative" role="alert">
          <strong className="font-bold">{tr.errorTitle} </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <main className="flex-grow flex flex-col md:flex-row overflow-hidden">
        <div className="flex-grow flex items-center justify-center p-4 md:p-6 bg-gray-200 dark:bg-gray-900 overflow-auto">
          <ImageComparator 
            originalImage={originalImage.base64} 
            editedImage={editedImage?.base64 || ''} 
          />
        </div>
        <aside className="w-full md:w-80 lg:w-96 flex-shrink-0 h-auto md:h-full overflow-y-auto">
          <EditorPanel onEdit={handleEdit} isDisabled={isLoading} />
        </aside>
      </main>
    </div>
  );
};

export default App;