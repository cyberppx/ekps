
import React, { useState } from 'react';
import { EditCategory } from '../types';
import { tr } from '../constants/translations';
import { WandIcon } from './Icons';

interface EditorPanelProps {
  onEdit: (prompt: string, message: string) => void;
  isDisabled: boolean;
}

const editCategories: EditCategory[] = [
  {
    name: tr.quickEnhance,
    actions: [
      { id: 'enhance', name: tr.aiEnhance, prompt: 'Automatically analyze and optimize sharpness, contrast, color balance, and exposure for a professional look.', loadingMessage: tr.aiEnhanceLoading },
    ],
  },
  {
    name: tr.creativeFilters,
    actions: [
      { id: 'bw', name: tr.bw, prompt: 'Apply a dramatic, high-contrast black and white filter.', loadingMessage: tr.bwLoading },
      { id: 'vintage', name: tr.vintage, prompt: 'Give this photo a vintage look, with faded colors and a warm tint.', loadingMessage: tr.vintageLoading },
      { id: 'cinematic', name: tr.cinematic, prompt: 'Apply a cinematic color grade with teal and orange tones.', loadingMessage: tr.cinematicLoading },
      { id: 'anime', name: tr.animeStyle, prompt: 'Transform this photo into an anime style illustration.', loadingMessage: tr.animeStyleLoading },
      { id: 'watercolor', name: tr.watercolor, prompt: 'Convert this photo into a watercolor painting.', loadingMessage: tr.watercolorLoading },
    ],
  },
  {
    name: tr.portraitAi,
    actions: [
      { id: 'skin', name: tr.smoothSkin, prompt: 'Smooth skin, remove blemishes, and add a healthy glow to the face.', loadingMessage: tr.smoothSkinLoading },
      { id: 'eyes', name: tr.brightenEyes, prompt: 'Make the eyes in this portrait brighter and more vibrant.', loadingMessage: tr.brightenEyesLoading },
      { id: 'hair-blonde', name: tr.blondeHair, prompt: 'Realistically change the hair color to blonde.', loadingMessage: tr.blondeHairLoading },
      { id: 'hair-red', name: tr.redHair, prompt: 'Realistically change the hair color to a vibrant red.', loadingMessage: tr.redHairLoading },
    ],
  },
  {
    name: tr.scene,
    actions: [
      { id: 'bg-remove', name: tr.removeBg, prompt: 'Remove the background, leaving only the main subject.', loadingMessage: tr.removeBgLoading },
      { id: 'bg-blur', name: tr.blurBg, prompt: 'Apply a strong bokeh effect to blur the background, making the subject stand out.', loadingMessage: tr.blurBgLoading },
    ],
  },
];

const EditorPanel: React.FC<EditorPanelProps> = ({ onEdit, isDisabled }) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [activeCategory, setActiveCategory] = useState(editCategories[0].name);

  const handleCustomPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPrompt.trim()) {
      onEdit(customPrompt, tr.customEditLoading);
      setCustomPrompt('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 md:bg-gray-100 md:dark:bg-gray-800 h-full flex flex-col p-4 border-t-2 md:border-t-0 md:border-l-2 border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-purple-600 dark:text-purple-400 hidden md:block">{tr.editTools}</h2>
      
      <form onSubmit={handleCustomPromptSubmit} className="mb-4">
        <label htmlFor="custom-prompt" className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">{tr.customEditPrompt}</label>
        <div className="flex gap-2">
          <input
            id="custom-prompt"
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder={tr.customPromptPlaceholder}
            disabled={isDisabled}
            className="flex-grow bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:ring-purple-500 focus:border-purple-500 transition disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isDisabled || !customPrompt.trim()}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-semibold px-4 py-2 rounded-md text-sm transition-colors duration-200 flex items-center gap-2"
          >
            <WandIcon />
            <span className="hidden md:inline">{tr.apply}</span>
          </button>
        </div>
      </form>

      <div className="md:hidden mb-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex -mb-px space-x-4 overflow-x-auto">
          {editCategories.map(cat => (
            <button 
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex-shrink-0 py-2 px-1 border-b-2 text-sm font-medium transition-colors ${
                activeCategory === cat.name 
                ? 'border-purple-500 text-purple-600 dark:text-purple-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 md:pr-0">
        {/* Mobile View */}
        <div className="md:hidden grid grid-cols-3 sm:grid-cols-4 gap-2">
           {editCategories.find(c => c.name === activeCategory)?.actions.map((action) => (
             <button
               key={action.id}
               onClick={() => onEdit(action.prompt, action.loadingMessage)}
               disabled={isDisabled}
               className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-200 text-xs font-medium py-3 px-2 rounded-lg transition-colors duration-200 text-center"
             >
               {action.name}
             </button>
           ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block space-y-4">
            {editCategories.map((category) => (
              <div key={category.name}>
                <h3 className="font-semibold text-gray-500 dark:text-gray-400 mb-2 text-sm">{category.name}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {category.actions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => onEdit(action.prompt, action.loadingMessage)}
                      disabled={isDisabled}
                      className="bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-200 text-sm font-medium py-2 px-2 rounded-md transition-colors duration-200 text-center"
                    >
                      {action.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default EditorPanel;
