
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchBar } from '@/components/SearchBar';
import { DataContext } from '@/context/DataContext';

describe('SearchBar', () => {
  test('updates search term and triggers context search immediately (without debounce)', async () => {
    const setContextSearchTerm = jest.fn();
    
    render(
      <DataContext.Provider value={{ 
        setSearchTerm: setContextSearchTerm,
        data: [],
        filteredData: [],
        loading: false,
        error: null,
        currentPage: 0,
        totalPages: 0,
        setCurrentPage: jest.fn(),
        filters: { role: null, status: null },
        setFilters: jest.fn(),
        refreshData: jest.fn(),
      }}>
        <SearchBar />
      </DataContext.Provider>
    );
    
    const searchInput = screen.getByRole('searchbox');
    
    // Type one character at a time
    fireEvent.change(searchInput, { target: { value: 'a' } });
    fireEvent.change(searchInput, { target: { value: 'ad' } });
    fireEvent.change(searchInput, { target: { value: 'adm' } });
    fireEvent.change(searchInput, { target: { value: 'admi' } });
    fireEvent.change(searchInput, { target: { value: 'admin' } });
    
    // Each change should trigger a search context update immediately due to missing debounce
    // This test will "pass" but it's highlighting a performance bug
    await waitFor(() => {
      expect(setContextSearchTerm).toHaveBeenCalledTimes(5);
      expect(setContextSearchTerm).toHaveBeenLastCalledWith('admin');
    });
  });
  
  test('should use useDebounce hook to prevent excessive search calls', () => {
    // This test will fail because the component doesn't use the useDebounce hook
    const mockUseDebounce = jest.fn().mockImplementation((value) => value);
    // Let's mock the useDebounce implementation
    jest.mock('../utils/useDebounce', () => ({
      useDebounce: (value) => mockUseDebounce(value),
    }));
    
    const setContextSearchTerm = jest.fn();
    
    render(
      <DataContext.Provider value={{ 
        setSearchTerm: setContextSearchTerm,
        data: [],
        filteredData: [],
        loading: false,
        error: null,
        currentPage: 0,
        totalPages: 0,
        setCurrentPage: jest.fn(),
        filters: { role: null, status: null },
        setFilters: jest.fn(),
        refreshData: jest.fn(),
      }}>
        <SearchBar />
      </DataContext.Provider>
    );
    
    // This is an intentional failing test since the component has a bug
    // It should use the useDebounce hook but doesn't
    expect(mockUseDebounce).toHaveBeenCalled();
  });
});
