
import { createContext, useState, useEffect, useContext } from "react";
import { fetchUsers } from "@/utils/api";
import { SettingsContext } from "./SettingsContext";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface Filters {
  role: string | null;
  status: string | null;
}

interface DataContextType {
  data: User[];
  filteredData: User[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  setSearchTerm: (term: string) => void;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  refreshData: () => void;
}

export const DataContext = createContext<DataContextType>({
  data: [],
  filteredData: [],
  loading: false,
  error: null,
  currentPage: 0,
  totalPages: 0,
  setCurrentPage: () => {},
  setSearchTerm: () => {},
  filters: { role: null, status: null },
  setFilters: () => {},
  refreshData: () => {},
});

export const DataProvider = ({ children }) => {
  const { settings } = useContext(SettingsContext);
  const [allData, setAllData] = useState<User[]>([]);
  const [filteredData, setFilteredData] = useState<User[]>([]);
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>({ role: null, status: null });
  
  // Bug 8: Missing dependency in useEffect and not cleaning up refresh interval
  useEffect(() => {
    let intervalId: number | null = null;
    
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchUsers();
        setAllData(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };
    
    loadData();
    
    if (settings.refreshInterval > 0) {
      intervalId = window.setInterval(loadData, settings.refreshInterval);
    }
    
    // Missing cleanup function
    // And missing settings.refreshInterval as a dependency
  }, []);
  
  // Bug 9: Creating a new object in provider value every render
  useEffect(() => {
    let result = [...allData];
    
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        item =>
          item.name.toLowerCase().includes(lowerSearchTerm) ||
          item.email.toLowerCase().includes(lowerSearchTerm) ||
          item.role.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    if (filters.role) {
      result = result.filter(item => item.role === filters.role);
    }
    
    if (filters.status) {
      result = result.filter(item => item.status === filters.status);
    }
    
    setFilteredData(result);
    // Bug 10: Incorrect totalPages calculation
    const totalPages = Math.ceil(result.length / settings.pageSize) - 1;
    
    // Adjust current page if it's now out of bounds
    if (currentPage > totalPages && totalPages >= 0) {
      setCurrentPage(totalPages);
    }
    
    // Paginate the data
    const start = currentPage * settings.pageSize;
    const end = start + settings.pageSize;
    setData(result.slice(start, end));
  }, [allData, searchTerm, filters, currentPage, settings.pageSize]);
  
  const refreshData = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setAllData(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data");
      setLoading(false);
    }
  };
  
  const totalPages = Math.ceil(filteredData.length / settings.pageSize) - 1;
  
  // Bug 9: Creating a new object in context value on every render
  const value = {
    data,
    filteredData,
    loading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    setSearchTerm,
    filters,
    setFilters,
    refreshData,
  };
  
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
