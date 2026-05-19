import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DatePicker } from '@/components/Navigation/DatePicker';
import { getISODate, getNextDate, getPreviousDate } from '@/lib/utils/dateHelpers';

describe('DatePicker Component', () => {
  const today = getISODate(new Date());
  const mockOnDateChange = jest.fn();

  beforeEach(() => {
    mockOnDateChange.mockClear();
  });

  it('displays today&apos;s date on initial render', () => {
    render(<DatePicker selectedDate={today} onDateChange={mockOnDateChange} />);

    expect(screen.getByText(/today/i)).toBeInTheDocument();
  });

  it('displays the selected date in correct format', () => {
    render(<DatePicker selectedDate={today} onDateChange={mockOnDateChange} />);

    // Should include day of week and date
    const dateButton = screen.getByRole('button', { name: /today/i });
    expect(dateButton).toBeInTheDocument();
  });

  it('shows &quot;Today&quot; badge when on today&apos;s date', () => {
    render(<DatePicker selectedDate={today} onDateChange={mockOnDateChange} />);

    expect(screen.getByText(/today/i)).toBeInTheDocument();
  });

  it('does not show &quot;Today&quot; badge when on different date', () => {
    const tomorrow = getNextDate(today);
    render(<DatePicker selectedDate={tomorrow} onDateChange={mockOnDateChange} />);

    // The badge should not be visible, but the "Today" button should be
    const todayButton = screen.getByRole('button', { name: /go to today/i });
    expect(todayButton).toBeInTheDocument();
  });

  it('calls onDateChange with next date when next button clicked', async () => {
    const user = userEvent.setup();
    const tomorrow = getNextDate(today);

    render(<DatePicker selectedDate={today} onDateChange={mockOnDateChange} />);

    const nextButton = screen.getByRole('button', { name: /next day/i });
    await user.click(nextButton);

    expect(mockOnDateChange).toHaveBeenCalledWith(tomorrow);
  });

  it('calls onDateChange with previous date when previous button clicked', async () => {
    const user = userEvent.setup();
    const yesterday = getPreviousDate(today);

    render(<DatePicker selectedDate={today} onDateChange={mockOnDateChange} />);

    const prevButton = screen.getByRole('button', { name: /previous day/i });
    await user.click(prevButton);

    expect(mockOnDateChange).toHaveBeenCalledWith(yesterday);
  });

  it('navigates to today when &quot;Today&quot; button clicked and on different date', async () => {
    const user = userEvent.setup();
    const tomorrow = getNextDate(today);

    render(<DatePicker selectedDate={tomorrow} onDateChange={mockOnDateChange} />);

    const todayButton = screen.getByRole('button', { name: /go to today/i });
    await user.click(todayButton);

    expect(mockOnDateChange).toHaveBeenCalledWith(today);
  });

  it('opens date picker modal when date button clicked', async () => {
    const user = userEvent.setup();

    render(<DatePicker selectedDate={today} onDateChange={mockOnDateChange} />);

    const dateButton = screen.getByRole('button', { name: /today/i });
    await user.click(dateButton);

    // Should show date input after clicking
    await waitFor(() => {
      expect(screen.getByRole('textbox', { type: 'date' })).toBeInTheDocument();
    });
  });

  it('updates date when date input changes', async () => {
    const user = userEvent.setup();
    const nextWeek = getNextDate(getNextDate(getNextDate(today)));

    render(<DatePicker selectedDate={today} onDateChange={mockOnDateChange} />);

    const dateButton = screen.getByRole('button', { name: /today/i });
    await user.click(dateButton);

    const dateInput = screen.getByRole('textbox', { type: 'date' });
    await user.clear(dateInput);
    await user.type(dateInput, nextWeek);

    expect(mockOnDateChange).toHaveBeenCalledWith(nextWeek);
  });

  it('closes modal after selecting a date', async () => {
    const user = userEvent.setup();
    const nextDay = getNextDate(today);

    render(<DatePicker selectedDate={today} onDateChange={mockOnDateChange} />);

    const dateButton = screen.getByRole('button', { name: /today/i });
    await user.click(dateButton);

    const dateInput = screen.getByRole('textbox', { type: 'date' });
    await user.clear(dateInput);
    await user.type(dateInput, nextDay);

    await waitFor(() => {
      expect(screen.queryByRole('textbox', { type: 'date' })).not.toBeInTheDocument();
    });
  });

  it('closes modal when close button clicked', async () => {
    const user = userEvent.setup();

    render(<DatePicker selectedDate={today} onDateChange={mockOnDateChange} />);

    const dateButton = screen.getByRole('button', { name: /today/i });
    await user.click(dateButton);

    await waitFor(() => {
      expect(screen.getByRole('textbox', { type: 'date' })).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: /close date picker/i });
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByRole('textbox', { type: 'date' })).not.toBeInTheDocument();
    });
  });

  it('has accessible button labels', () => {
    render(<DatePicker selectedDate={today} onDateChange={mockOnDateChange} />);

    expect(screen.getByRole('button', { name: /previous day/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next day/i })).toBeInTheDocument();
  });

  it('renders all navigation elements', () => {
    render(<DatePicker selectedDate={today} onDateChange={mockOnDateChange} />);

    expect(screen.getByRole('button', { name: /previous day/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next day/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /today/i })).toBeInTheDocument();
  });

  it('handles multiple consecutive date changes', async () => {
    const user = userEvent.setup();
    let currentDate = today;

    render(
      <DatePicker selectedDate={currentDate} onDateChange={mockOnDateChange} />
    );

    // Simulate multiple next clicks
    const nextButton = screen.getByRole('button', { name: /next day/i });

    for (let i = 0; i < 3; i++) {
      await user.click(nextButton);
      currentDate = getISODate(getNextDate(currentDate));
    }

    expect(mockOnDateChange).toHaveBeenCalledTimes(3);
  });

  it('updates display when selectedDate prop changes', () => {
    const tomorrow = getISODate(getNextDate(today));

    const { rerender } = render(
      <DatePicker selectedDate={today} onDateChange={mockOnDateChange} />
    );

    rerender(<DatePicker selectedDate={tomorrow} onDateChange={mockOnDateChange} />);

    // Should show "Today" button when not on today
    expect(screen.getByRole('button', { name: /go to today/i })).toBeInTheDocument();
  });

  it('correctly formats past date', () => {
    const yesterday = getISODate(getPreviousDate(today));

    render(<DatePicker selectedDate={yesterday} onDateChange={mockOnDateChange} />);

    // Should display correctly even for past dates
    expect(screen.getByRole('button', { name: /go to today/i })).toBeInTheDocument();
  });

  it('correctly formats future date', () => {
    const nextMonth = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000);
    const futureDate = getISODate(nextMonth);

    render(<DatePicker selectedDate={futureDate} onDateChange={mockOnDateChange} />);

    // Should display correctly even for future dates
    expect(screen.getByRole('button', { name: /go to today/i })).toBeInTheDocument();
  });
});

describe('DatePicker Integration Tests', () => {
  const today = getISODate(new Date());
  const mockOnDateChange = jest.fn();

  beforeEach(() => {
    mockOnDateChange.mockClear();
  });

  it('maintains date navigation consistency', async () => {
    const user = userEvent.setup();
    let currentDate = today;

    const { rerender } = render(
      <DatePicker selectedDate={currentDate} onDateChange={mockOnDateChange} />
    );

    // Navigate forward
    let nextButton = screen.getByRole('button', { name: /next day/i });
    await user.click(nextButton);
    currentDate = getISODate(getNextDate(currentDate));

    rerender(<DatePicker selectedDate={currentDate} onDateChange={mockOnDateChange} />);

    // Navigate backward
    let prevButton = screen.getByRole('button', { name: /previous day/i });
    await user.click(prevButton);
    const expectedDate = getISODate(getPreviousDate(currentDate));

    expect(mockOnDateChange).toHaveBeenLastCalledWith(expectedDate);
  });

  it('handles rapid consecutive navigation', async () => {
    const user = userEvent.setup();
    let currentDate = today;

    const { rerender } = render(
      <DatePicker selectedDate={currentDate} onDateChange={mockOnDateChange} />
    );

    // Rapid forward navigation
    for (let i = 0; i < 7; i++) {
      const nextButton = screen.getByRole('button', { name: /next day/i });
      await user.click(nextButton);
      currentDate = getISODate(getNextDate(currentDate));
      rerender(<DatePicker selectedDate={currentDate} onDateChange={mockOnDateChange} />);
    }

    // Should have called onDateChange 7 times
    expect(mockOnDateChange).toHaveBeenCalledTimes(7);
  });
});
