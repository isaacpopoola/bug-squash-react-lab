
import { useContext, useState } from "react";
import { SettingsContext } from "@/context/SettingsContext";

export const SettingsPanel = () => {
  const { settings, updateSettings } = useContext(SettingsContext);
  // Bug 6: Unnecessarily recreating state from context
  const [localSettings, setLocalSettings] = useState({
    pageSize: settings.pageSize,
    showStatus: settings.showStatus,
    theme: settings.theme,
    refreshInterval: settings.refreshInterval,
  });
  
  const handleChange = (name, value) => {
    // Bug 7: This mutates state directly before updating it
    localSettings[name] = value;
    setLocalSettings({ ...localSettings });
  };
  
  const handleSave = () => {
    updateSettings(localSettings);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900">Page Size</h3>
        <div className="mt-2">
          <select
            value={localSettings.pageSize}
            onChange={(e) => handleChange("pageSize", Number(e.target.value))}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size} items per page
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-900">Display Options</h3>
        <div className="mt-2 space-y-4">
          <div className="flex items-center">
            <input
              id="show-status"
              name="show-status"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={localSettings.showStatus}
              onChange={(e) => handleChange("showStatus", e.target.checked)}
            />
            <label htmlFor="show-status" className="ml-3 text-sm text-gray-700">
              Show status column
            </label>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-900">Theme</h3>
        <div className="mt-2">
          <div className="flex items-center space-x-4">
            {["light", "dark", "system"].map((theme) => (
              <div key={theme} className="flex items-center">
                <input
                  id={`theme-${theme}`}
                  name="theme"
                  type="radio"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  checked={localSettings.theme === theme}
                  onChange={() => handleChange("theme", theme)}
                />
                <label htmlFor={`theme-${theme}`} className="ml-3 text-sm text-gray-700 capitalize">
                  {theme}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-900">Auto-refresh Interval</h3>
        <div className="mt-2">
          <select
            value={localSettings.refreshInterval}
            onChange={(e) => handleChange("refreshInterval", Number(e.target.value))}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value={0}>Disabled</option>
            <option value={5000}>Every 5 seconds</option>
            <option value={10000}>Every 10 seconds</option>
            <option value={30000}>Every 30 seconds</option>
            <option value={60000}>Every minute</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};
