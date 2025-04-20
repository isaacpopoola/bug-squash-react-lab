
import { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { SearchBar } from "@/components/SearchBar";
import { FilterPanel } from "@/components/FilterPanel";
import { SettingsPanel } from "@/components/SettingsPanel";
import { DataProvider } from "@/context/DataContext";
import { SettingsProvider } from "@/context/SettingsContext";

const Index = () => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <SettingsProvider>
      <DataProvider>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Bug Squash Interview Challenge</h1>
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Settings
              </button>
            </div>
          </header>
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-grow">
                <SearchBar />
              </div>
              <div>
                <FilterPanel />
              </div>
            </div>
            
            <DataTable />
            
            {showSettings && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Settings</h2>
                    <button 
                      onClick={() => setShowSettings(false)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      ✕
                    </button>
                  </div>
                  <SettingsPanel />
                </div>
              </div>
            )}
          </main>
        </div>
      </DataProvider>
    </SettingsProvider>
  );
};

export default Index;
