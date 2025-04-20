
import { useState, useEffect, useContext } from "react";
import { DataContext } from "@/context/DataContext";
import { SettingsContext } from "@/context/SettingsContext";

export const DataTable = () => {
  const { data, loading, totalPages, currentPage, setCurrentPage } = useContext(DataContext);
  const { settings } = useContext(SettingsContext);
  
  // Bug 1: Missing dependency causes unnecessary re-renders
  useEffect(() => {
    console.log("DataTable re-rendered");
    // This should include all dependencies but is missing 'settings'
  }, [data, currentPage]);
  
  // Bug 2: Direct state mutation in pagination
  const handleNextPage = () => {
    // Direct state mutation 
    // This is a bug - can't modify currentPage directly since it's from context
    setCurrentPage(currentPage + 1);
  };
  
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="h-16 bg-gray-200 rounded w-full mb-2"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            {settings.showStatus && (
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.role}</td>
              {settings.showStatus && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.status === 'active' ? 'bg-green-100 text-green-800' : 
                    item.status === 'inactive' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status}
                  </span>
                </td>
              )}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={settings.showStatus ? 5 : 4} className="px-6 py-4 text-center text-sm text-gray-500">
                No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {/* Bug 3: Off-by-one error in pagination */}
      <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              currentPage === 0 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{data.length > 0 ? currentPage * settings.pageSize + 1 : 0}</span> to{' '}
              <span className="font-medium">
                {Math.min((currentPage + 1) * settings.pageSize, data.length)}
              </span>{' '}
              of <span className="font-medium">{data.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === 0 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                ←
              </button>
              {Array.from({ length: totalPages + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx)}
                  className={`relative inline-flex items-center px-4 py-2 border ${
                    currentPage === idx
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  } text-sm font-medium`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                →
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};
