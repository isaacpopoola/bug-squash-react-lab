
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterPanel } from '@/components/FilterPanel';
import { DataContext } from '@/context/DataContext';

describe('FilterPanel', () => {
  test('renders filter button with correct count', () => {
    const filters = { role: 'admin', status: null };
    
    render(
      <DataContext.Provider value={{ 
        filters,
        setFilters: jest.fn(),
        data: [],
        filteredData: [],
        loading: false,
        error: null,
        currentPage: 0,
        totalPages: 0,
        setCurrentPage: jest.fn(),
        setSearchTerm: jest.fn(),
        refreshData: jest.fn(),
      }}>
        <FilterPanel />
      </DataContext.Provider>
    );
    
    expect(screen.getByText('Filter (1)')).toBeInTheDocument();
  });
  
  test('opens filter panel when button is clicked', () => {
    render(
      <DataContext.Provider value={{ 
        filters: { role: null, status: null },
        setFilters: jest.fn(),
        data: [],
        filteredData: [],
        loading: false,
        error: null,
        currentPage: 0,
        totalPages: 0,
        setCurrentPage: jest.fn(),
        setSearchTerm: jest.fn(),
        refreshData: jest.fn(),
      }}>
        <FilterPanel />
      </DataContext.Provider>
    );
    
    // Panel should not be visible initially
    expect(screen.queryByText('Role')).not.toBeInTheDocument();
    
    // Click the filter button
    fireEvent.click(screen.getByText('Filter (0)'));
    
    // Panel should now be visible
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });
  
  test('updates filters when options are selected', () => {
    const setFilters = jest.fn();
    
    render(
      <DataContext.Provider value={{ 
        filters: { role: null, status: null },
        setFilters,
        data: [],
        filteredData: [],
        loading: false,
        error: null,
        currentPage: 0,
        totalPages: 0,
        setCurrentPage: jest.fn(),
        setSearchTerm: jest.fn(),
        refreshData: jest.fn(),
      }}>
        <FilterPanel />
      </DataContext.Provider>
    );
    
    // Open the filter panel
    fireEvent.click(screen.getByText('Filter (0)'));
    
    // Select admin role
    fireEvent.click(screen.getByLabelText('admin'));
    
    // Bug: handleFilterChange is recreated on every render
    // This will work but it's a performance issue
    expect(setFilters).toHaveBeenCalledWith({ role: 'admin', status: null });
  });
  
  test('clears all filters when "Clear all" is clicked', () => {
    const setFilters = jest.fn();
    
    render(
      <DataContext.Provider value={{ 
        filters: { role: 'admin', status: 'active' },
        setFilters,
        data: [],
        filteredData: [],
        loading: false,
        error: null,
        currentPage: 0,
        totalPages: 0,
        setCurrentPage: jest.fn(),
        setSearchTerm: jest.fn(),
        refreshData: jest.fn(),
      }}>
        <FilterPanel />
      </DataContext.Provider>
    );
    
    // Open the filter panel
    fireEvent.click(screen.getByText('Filter (2)'));
    
    // Click "Clear all"
    fireEvent.click(screen.getByText('Clear all'));
    
    expect(setFilters).toHaveBeenCalledWith({ role: null, status: null });
  });
});
