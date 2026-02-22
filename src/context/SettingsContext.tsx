import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ThemeSettings {
  primaryColor: string;
  accentColor: string;
  fontFamily: 'serif' | 'sans';
  borderRadius: string;
}

interface HomepageContent {
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutText: string;
  heroImage: string;
}

interface SettingsContextType {
  theme: ThemeSettings;
  homepageContent: HomepageContent;
  updateTheme: (newTheme: Partial<ThemeSettings>) => void;
  updateHomepageContent: (newContent: Partial<HomepageContent>) => void;
  isLoading: boolean;
}

const defaultTheme: ThemeSettings = {
  primaryColor: '#1a1a1a',
  accentColor: '#d97706',
  fontFamily: 'serif',
  borderRadius: 'rounded-sm'
};

const defaultHomepageContent: HomepageContent = {
  heroTitle: 'TASHA',
  heroSubtitle: 'Where Elegance Meets Flavor',
  aboutTitle: 'Our Story',
  aboutText: 'At Tasha Restaurant, we believe dining is more than a meal. It is an experience.',
  heroImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=80'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);
  const [homepageContent, setHomepageContent] = useState<HomepageContent>(defaultHomepageContent);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.theme) {
          const newTheme = { ...defaultTheme, ...data.theme };
          setTheme(newTheme);
          applyTheme(newTheme);
        }
        if (data.homepage_content) setHomepageContent({ ...defaultHomepageContent, ...data.homepage_content });
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load settings', err);
        setIsLoading(false);
      });
  }, []);

  const applyTheme = (theme: ThemeSettings) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primaryColor);
    root.style.setProperty('--color-accent', theme.accentColor);
    // You can add more CSS variables here if needed
    // For font family, we might need a different approach or just set it on body
    if (theme.fontFamily === 'serif') {
      root.style.setProperty('--font-serif', '"Playfair Display", serif');
      root.style.setProperty('--font-sans', '"Inter", sans-serif');
    } else {
      root.style.setProperty('--font-serif', '"Inter", sans-serif'); // Swap or make both sans
      root.style.setProperty('--font-sans', '"Inter", sans-serif');
    }
  };

  const updateTheme = (newTheme: Partial<ThemeSettings>) => {
    const updated = { ...theme, ...newTheme };
    setTheme(updated);
    applyTheme(updated);
    // Persist to backend
    fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'theme', value: updated })
    });
  };

  const updateHomepageContent = (newContent: Partial<HomepageContent>) => {
    const updated = { ...homepageContent, ...newContent };
    setHomepageContent(updated);
    // Persist to backend
    fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'homepage_content', value: updated })
    });
  };

  return (
    <SettingsContext.Provider value={{ theme, homepageContent, updateTheme, updateHomepageContent, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
