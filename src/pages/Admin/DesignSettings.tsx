import { useForm } from 'react-hook-form';
import { useSettings } from '../../context/SettingsContext';

export default function DesignSettings() {
  const { theme, homepageContent, updateTheme, updateHomepageContent } = useSettings();
  
  const { register: registerTheme, handleSubmit: handleThemeSubmit } = useForm({
    defaultValues: theme
  });

  const { register: registerContent, handleSubmit: handleContentSubmit } = useForm({
    defaultValues: homepageContent
  });

  const onThemeSubmit = (data: any) => {
    updateTheme(data);
    alert('Theme settings updated!');
  };

  const onContentSubmit = (data: any) => {
    updateHomepageContent(data);
    alert('Homepage content updated!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Theme Settings */}
      <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800">
        <h3 className="text-xl font-bold text-white mb-6">Visual Theme</h3>
        <form onSubmit={handleThemeSubmit(onThemeSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Primary Color (Background)</label>
            <div className="flex items-center space-x-2">
              <input type="color" {...registerTheme('primaryColor')} className="h-10 w-20 bg-transparent border-none" />
              <input type="text" {...registerTheme('primaryColor')} className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Accent Color</label>
            <div className="flex items-center space-x-2">
              <input type="color" {...registerTheme('accentColor')} className="h-10 w-20 bg-transparent border-none" />
              <input type="text" {...registerTheme('accentColor')} className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Font Family</label>
            <select {...registerTheme('fontFamily')} className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white">
              <option value="serif">Serif (Elegant)</option>
              <option value="sans">Sans-Serif (Modern)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Border Radius</label>
            <select {...registerTheme('borderRadius')} className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white">
              <option value="rounded-none">Square</option>
              <option value="rounded-sm">Small</option>
              <option value="rounded-md">Medium</option>
              <option value="rounded-lg">Large</option>
              <option value="rounded-full">Full</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded font-bold uppercase tracking-wide mt-4">
            Save Theme
          </button>
        </form>
      </div>

      {/* Homepage Content */}
      <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800">
        <h3 className="text-xl font-bold text-white mb-6">Homepage Content</h3>
        <form onSubmit={handleContentSubmit(onContentSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Hero Title</label>
            <input {...registerContent('heroTitle')} className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Hero Subtitle</label>
            <input {...registerContent('heroSubtitle')} className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Hero Image URL</label>
            <input {...registerContent('heroImage')} className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">About Section Title</label>
            <input {...registerContent('aboutTitle')} className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">About Section Text</label>
            <textarea {...registerContent('aboutText')} className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white h-32" />
          </div>

          <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded font-bold uppercase tracking-wide mt-4">
            Save Content
          </button>
        </form>
      </div>
    </div>
  );
}
