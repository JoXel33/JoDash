import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StarsLogger } from '@/components/Input/StarsLogger';
import { getISODate, getNextDate, getPreviousDate } from '@/lib/utils/dateHelpers';

/**
 * Integration tests for StarsLogger
 * Verify that star counts are independent across different dates
 * and that data persists correctly when navigating between dates
 */
describe('StarsLogger Integration Tests', () => {
  const mockOnStarsSaved = jest.fn();

  beforeEach(() => {
    mockOnStarsSaved.mockClear();
    // Clear localStorage for each test
    localStorage.clear();
  });

  it('maintains separate star counts for different dates', async () => {
    const user = userEvent.setup();

    // Simulate logging stars for today
    const { rerender } = render(
      <StarsLogger currentStars={0} onStarsSaved={mockOnStarsSaved} />
    );

    const input = screen.getByPlaceholderText('0-5') as HTMLInputElement;

    // Save 3 stars for today
    await user.type(input, '3');
    const submitButton = screen.getByRole('button', { name: /save stars/i });
    await user.click(submitButton);

    expect(mockOnStarsSaved).toHaveBeenCalledWith(3);

    // Simulate navigating to different date and checking different star count
    mockOnStarsSaved.mockClear();
    rerender(<StarsLogger currentStars={2} onStarsSaved={mockOnStarsSaved} />);

    // Should display different star count for different date
    expect(screen.getByText('2')).toBeInTheDocument();

    // Save 2 stars for different date
    await user.clear(input);
    await user.type(input, '2');
    await user.click(submitButton);

    expect(mockOnStarsSaved).toHaveBeenCalledWith(2);
  });

  it('updates star count when form is submitted', async () => {
    const user = userEvent.setup();

    const onStarsSaved = jest.fn();
    const { rerender } = render(
      <StarsLogger currentStars={1} onStarsSaved={onStarsSaved} />
    );

    // Initial display shows 1 star
    expect(screen.getByText('1')).toBeInTheDocument();

    // Enter 4 stars
    const input = screen.getByPlaceholderText('0-5');
    await user.type(input, '4');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /save stars/i });
    await user.click(submitButton);

    // Verify callback was called
    expect(onStarsSaved).toHaveBeenCalledWith(4);

    // Simulate parent updating the displayed count
    rerender(<StarsLogger currentStars={4} onStarsSaved={onStarsSaved} />);

    // Verify display is updated
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('allows resetting and changing star count multiple times', async () => {
    const user = userEvent.setup();
    const onStarsSaved = jest.fn();

    const { rerender } = render(
      <StarsLogger currentStars={0} onStarsSaved={onStarsSaved} />
    );

    const input = screen.getByPlaceholderText('0-5') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /save stars/i });

    // First entry: 2 stars
    await user.type(input, '2');
    await user.click(submitButton);
    expect(onStarsSaved).toHaveBeenCalledWith(2);

    // Update display
    rerender(<StarsLogger currentStars={2} onStarsSaved={onStarsSaved} />);
    expect(screen.getByText('2')).toBeInTheDocument();

    // Second entry: 5 stars
    await user.type(input, '5');
    await user.click(submitButton);
    expect(onStarsSaved).toHaveBeenCalledWith(5);

    // Update display
    rerender(<StarsLogger currentStars={5} onStarsSaved={onStarsSaved} />);
    expect(screen.getByText('5')).toBeInTheDocument();

    // Third entry: 0 stars
    await user.type(input, '0');
    await user.click(submitButton);
    expect(onStarsSaved).toHaveBeenCalledWith(0);

    // Update display
    rerender(<StarsLogger currentStars={0} onStarsSaved={onStarsSaved} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('correctly displays star visualization on update', async () => {
    const user = userEvent.setup();
    const onStarsSaved = jest.fn();

    const { rerender, container } = render(
      <StarsLogger currentStars={2} onStarsSaved={onStarsSaved} />
    );

    // Verify 2 filled stars initially
    let filledStars = container.querySelectorAll('.filled');
    expect(filledStars).toHaveLength(2);

    // Save 5 stars
    const input = screen.getByPlaceholderText('0-5');
    await user.type(input, '5');
    const submitButton = screen.getByRole('button', { name: /save stars/i });
    await user.click(submitButton);

    // Update display with new count
    rerender(<StarsLogger currentStars={5} onStarsSaved={onStarsSaved} />);

    // Verify 5 filled stars now
    filledStars = container.querySelectorAll('.filled');
    expect(filledStars).toHaveLength(5);
  });

  it('handles concurrent date changes with correct star display', async () => {
    const user = userEvent.setup();
    const onStarsSaved = jest.fn();

    const today = getISODate(new Date());
    const tomorrow = getISODate(getNextDate(today));
    const yesterday = getISODate(getPreviousDate(today));

    // Start with today
    const { rerender } = render(
      <StarsLogger currentStars={0} onStarsSaved={onStarsSaved} />
    );

    // Save 3 stars for today
    let input = screen.getByPlaceholderText('0-5');
    await user.type(input, '3');
    let submitButton = screen.getByRole('button', { name: /save stars/i });
    await user.click(submitButton);
    expect(onStarsSaved).toHaveBeenCalledWith(3);

    // Navigate to tomorrow
    rerender(<StarsLogger currentStars={0} onStarsSaved={onStarsSaved} />);

    // Save 5 stars for tomorrow
    input = screen.getByPlaceholderText('0-5');
    await user.clear(input);
    await user.type(input, '5');
    submitButton = screen.getByRole('button', { name: /save stars/i });
    await user.click(submitButton);
    expect(onStarsSaved).toHaveBeenCalledWith(5);

    // Navigate to yesterday
    rerender(<StarsLogger currentStars={1} onStarsSaved={onStarsSaved} />);

    // Should show 1 star for yesterday
    expect(screen.getByText('1')).toBeInTheDocument();

    // Navigate back to today
    rerender(<StarsLogger currentStars={3} onStarsSaved={onStarsSaved} />);

    // Should show 3 stars again for today
    expect(screen.getByText('3')).toBeInTheDocument();

    // Navigate to tomorrow again
    rerender(<StarsLogger currentStars={5} onStarsSaved={onStarsSaved} />);

    // Should show 5 stars for tomorrow
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('displays correct state after rapid navigation', async () => {
    const user = userEvent.setup();
    const onStarsSaved = jest.fn();

    const { rerender, container } = render(
      <StarsLogger currentStars={2} onStarsSaved={onStarsSaved} />
    );

    // Verify initial state
    let filledStars = container.querySelectorAll('.filled');
    expect(filledStars).toHaveLength(2);

    // Rapid re-renders simulating fast date navigation
    for (let i = 0; i < 5; i++) {
      const starCount = i % 6; // 0-5
      rerender(<StarsLogger currentStars={starCount} onStarsSaved={onStarsSaved} />);

      filledStars = container.querySelectorAll('.filled');
      expect(filledStars).toHaveLength(starCount);
    }
  });

  it('preserves form state during date transitions', async () => {
    const user = userEvent.setup();
    const onStarsSaved = jest.fn();

    const { rerender } = render(
      <StarsLogger currentStars={0} onStarsSaved={onStarsSaved} />
    );

    // Start typing but don't submit
    const input = screen.getByPlaceholderText('0-5') as HTMLInputElement;
    await user.type(input, '3');

    // Verify input still has value
    expect(input.value).toBe('3');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /save stars/i });
    await user.click(submitButton);

    // Navigate to different date
    rerender(<StarsLogger currentStars={1} onStarsSaved={onStarsSaved} />);

    // Input should be cleared after submission
    expect(input.value).toBe('');
  });
});
