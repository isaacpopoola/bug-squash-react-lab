
import { useState, useContext, useCallback } from "react";
import { DataContext } from "@/context/DataContext";

export const FilterPanel = () => {
  const { filters, setFilters } = useContext(DataContext);
  const [isOpen, setIsOpen] = useState(false);
  
  // Bug 5: Recreating callback on every render
  const handleFilterChange = (name, value) => {
    // This should use a functional update and useCallback
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
        </svg>
        Filter ({Object.values(filters).filter(Boolean).length})
      </button>
      
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <div className="px-4 py-2">
              <h3 className="text-sm font-medium text-gray-900">Role</h3>
              <div className="mt-2 space-y-2">
                {["admin", "user", "editor"].map((role) => (
                  <div key={role} className="flex items-center">
                    <input
                      id={`role-${role}`}
                      name={`role-${role}`}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={filters.role === role}
                      onChange={() => handleFilterChange("role", filters.role === role ? null : role)}
                    />
                    <label htmlFor={`role-${role}`} className="ml-3 text-sm text-gray-700 capitalize">
                      {role}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="px-4 py-2">
              <h3 className="text-sm font-medium text-gray-900">Status</h3>
              <div className="mt-2 space-y-2">
                {["active", "inactive", "pending"].map((status) => (
                  <div key={status} className="flex items-center">
                    <input
                      id={`status-${status}`}
                      name={`status-${status}`}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={filters.status === status}
                      onChange={() => handleFilterChange("status", filters.status === status ? null : status)}
                    />
                    <label htmlFor={`status-${status}`} className="ml-3 text-sm text-gray-700 capitalize">
                      {status}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="px-4 py-2 border-t border-gray-100 flex justify-between">
              <button
                onClick={() => {
                  setFilters({ role: null, status: null });
                  setIsOpen(false);
                }}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Clear all
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
