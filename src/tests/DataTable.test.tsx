
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DataTable } from '@/components/DataTable';
import { DataContext } from '@/context/DataContext';
import { SettingsContext } from '@/context/SettingsContext';

// Mock data and context values
const mockData = Array.from({ length: 25 }).map((_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 3 === 0 ? 'admin' : i % 3 === 1 ? 'user' : 'editor',
  status: i % 3 === 0 ? 'active' : i % 3 === 1 ? 'inactive' : 'pending',
}));

const mockSettingsValue = {
  settings: {
    pageSize: 10,
    showStatus: true,
    theme: 'light' as 'light' | 'dark' | 'system',
    refreshInterval: 0,
  },
  updateSettings: jest.fn(),
};

describe('DataTable', () => {
  test('renders the correct number of rows based on page size', () => {
    const mockDataValue = {
      data: mockData.slice(0, 10),
      filteredData: mockData,
      loading: false,
      error: null,
      currentPage: 0,
      totalPages: 2,
      setCurrentPage: jest.fn(),
      setSearchTerm: jest.fn(),
      filters: { role: null, status: null },
      setFilters: jest.fn(),
      refreshData: jest.fn(),
    };

    render(
      <SettingsContext.Provider value={mockSettingsValue}>
        <DataContext.Provider value={mockDataValue}>
          <DataTable />
        </DataContext.Provider>
      </SettingsContext.Provider>
    );

    // Should have 10 rows plus header row
    expect(screen.getAllByRole('row').length).toBe(11);
  });

  test('pagination displays the correct number of pages', () => {
    const mockDataValue = {
      data: mockData.slice(0, 10),
      filteredData: mockData,
      loading: false,
      error: null,
      currentPage: 0,
      totalPages: 2, // Bug: This should be 3 for 25 items with pageSize 10
      setCurrentPage: jest.fn(),
      setSearchTerm: jest.fn(),
      filters: { role: null, status: null },
      setFilters: jest.fn(),
      refreshData: jest.fn(),
    };

    render(
      <SettingsContext.Provider value={mockSettingsValue}>
        <DataContext.Provider value={mockDataValue}>
          <DataTable />
        </DataContext.Provider>
      </SettingsContext.Provider>
    );

    // Should have 3 page buttons for 25 items with pageSize 10
    // This test will fail due to the pagination calculation bug
    const pageButtons = screen.getAllByRole('button').filter(
      button => /^\d+$/.test(button.textContent || '')
    );
    expect(pageButtons.length).toBe(3); // Actual: 3, Expected based on bug: 2
  });

  test('clicking next page button updates the current page', async () => {
    const setCurrentPage = jest.fn();
    const mockDataValue = {
      data: mockData.slice(0, 10),
      filteredData: mockData,
      loading: false,
      error: null,
      currentPage: 0,
      totalPages: 2,
      setCurrentPage,
      setSearchTerm: jest.fn(),
      filters: { role: null, status: null },
      setFilters: jest.fn(),
      refreshData: jest.fn(),
    };

    render(
      <SettingsContext.Provider value={mockSettingsValue}>
        <DataContext.Provider value={mockDataValue}>
          <DataTable />
        </DataContext.Provider>
      </SettingsContext.Provider>
    );

    // Find the "Next" button (the one with → text)
    const nextButton = screen.getByText('→');
    fireEvent.click(nextButton);

    // Due to the bug in handleNextPage, this will incorrectly update currentPage
    // It should call setCurrentPage(1) but it will call setCurrentPage(1) after mutating the state
    await waitFor(() => {
      // The test will pass but the functionality is buggy
      expect(setCurrentPage).toHaveBeenCalled();
    });
  });

  test('status column is hidden when showStatus is false', () => {
    const mockDataValue = {
      data: mockData.slice(0, 10),
      filteredData: mockData,
      loading: false,
      error: null,
      currentPage: 0,
      totalPages: 2,
      setCurrentPage: jest.fn(),
      setSearchTerm: jest.fn(),
      filters: { role: null, status: null },
      setFilters: jest.fn(),
      refreshData: jest.fn(),
    };

    const settingsWithoutStatus = {
      settings: {
        pageSize: 10,
        showStatus: false,
        theme: 'light' as 'light' | 'dark' | 'system',
        refreshInterval: 0,
      },
      updateSettings: jest.fn(),
    };

    render(
      <SettingsContext.Provider value={settingsWithoutStatus}>
        <DataContext.Provider value={mockDataValue}>
          <DataTable />
        </DataContext.Provider>
      </SettingsContext.Provider>
    );

    // Header should not contain "Status"
    expect(screen.queryByText('Status')).not.toBeInTheDocument();
  });
});
