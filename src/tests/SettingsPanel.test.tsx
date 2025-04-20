
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsPanel } from '@/components/SettingsPanel';
import { SettingsContext } from '@/context/SettingsContext';

describe('SettingsPanel', () => {
  const defaultSettings = {
    pageSize: 10,
    showStatus: true,
    theme: 'light' as 'light' | 'dark' | 'system',
    refreshInterval: 0,
  };
  
  test('renders with correct initial values from context', () => {
    render(
      <SettingsContext.Provider value={{ 
        settings: defaultSettings,
        updateSettings: jest.fn(),
      }}>
        <SettingsPanel />
      </SettingsContext.Provider>
    );
    
    // Check that page size dropdown has correct value
    expect(screen.getByText('10 items per page')).toBeInTheDocument();
    
    // Check that show status checkbox is checked
    expect(screen.getByLabelText('Show status column')).toBeChecked();
    
    // Check that light theme is selected
    expect(screen.getByLabelText('light')).toBeChecked();
    
    // Check that refresh interval is set to disabled
    expect(screen.getByText('Disabled')).toBeInTheDocument();
  });
  
  test('updates settings when values are changed', () => {
    const updateSettings = jest.fn();
    
    render(
      <SettingsContext.Provider value={{ 
        settings: defaultSettings,
        updateSettings,
      }}>
        <SettingsPanel />
      </SettingsContext.Provider>
    );
    
    // Change page size
    fireEvent.change(screen.getByRole('combobox', { name: /page size/i }), { 
      target: { value: '20' } 
    });
    
    // Uncheck show status
    fireEvent.click(screen.getByLabelText('Show status column'));
    
    // Change theme to dark
    fireEvent.click(screen.getByLabelText('dark'));
    
    // Change refresh interval
    fireEvent.change(screen.getByRole('combobox', { name: /auto-refresh interval/i }), {
      target: { value: '10000' }
    });
    
    // Click save button
    fireEvent.click(screen.getByText('Save Settings'));
    
    // Bug: Due to direct state mutation in handleChange, this still works but is bad practice
    expect(updateSettings).toHaveBeenCalledWith({
      pageSize: 20,
      showStatus: false,
      theme: 'dark' as 'light' | 'dark' | 'system',
      refreshInterval: 10000,
    });
  });
});
