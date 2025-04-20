
import { createContext, useState, useEffect } from "react";

interface Settings {
  pageSize: number;
  showStatus: boolean;
  theme: 'light' | 'dark' | 'system';
  refreshInterval: number;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Settings) => void;
}

const defaultSettings: Settings = {
  pageSize: 10,
  showStatus: true,
  theme: 'light',
  refreshInterval: 0,
};

export const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
});

export const SettingsProvider = ({ children }) => {
  // Bug 11: Using useState directly without checking localStorage first
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  
  // This effect runs after the initial render with default settings
  useEffect(() => {
    const savedSettings = localStorage.getItem("appSettings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Failed to parse saved settings");
      }
    }
  }, []);
  
  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem("appSettings", JSON.stringify(newSettings));
    
    // Bug 12: Theme changes aren't applied immediately
    // Should check if theme changed and apply it
  };
  
  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
