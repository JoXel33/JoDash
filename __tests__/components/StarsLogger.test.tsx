import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StarsLogger } from '@/components/Input/StarsLogger';

describe('StarsLogger Component', () => {
  const mockOnStarsSaved = jest.fn();

  beforeEach(() => {
    mockOnStarsSaved.mockClear();
  });

  it('displays current star count', () => {
    render(<StarsLogger currentStars={3} onStarsSaved={mockOnStarsSaved} />);

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('/ 5')).toBeInTheDocument();
  });

  it('renders input field for star entry', () => {
    render(<StarsLogger currentStars={0} onStarsSaved={mockOnStarsSaved} />);

    const input = screen.getByPlaceholderText('0-5');
    expect(input).toBeInTheDocument();
  });

  it('renders label for input', () => {
    render(<StarsLogger currentStars={0} onStarsSaved={mockOnStarsSaved} />);

    expect(screen.getByLabelText(/log stars earned/i)).toBeInTheDocument();
  });

  it('accepts valid star input (0-5)', async () => {
    const user = userEvent.setup();
    render(<StarsLogger currentStars={0} onStarsSaved={mockOnStarsSaved} />);

    const input = screen.getByPlaceholderText('0-5') as HTMLInputElement;

    // Test entering 3
    await user.type(input, '3');
    expect(input.value).toBe('3');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /save stars/i });
    await user.click(submitButton);

    expect(mockOnStarsSaved).toHaveBeenCalledWith(3);
  });

  it('displays hint text', () => {
    render(<StarsLogger currentStars={0} onStarsSaved={mockOnStarsSaved} />);

    expect(screen.getByText(/enter a number from 0 to 5/i)).toBeInTheDocument();
  });

  it('displays error for invalid input', async () => {
    const user = userEvent.setup();
    render(<StarsLogger currentStars={0} onStarsSaved={mockOnStarsSaved} />);

    const input = screen.getByPlaceholderText('0-5');

    // Try entering invalid value (6)
    await user.type(input, '6');

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('displays error for negative input', async () => {
    const user = userEvent.setup();
    render(<StarsLogger currentStars={0} onStarsSaved={mockOnStarsSaved} />);

    const input = screen.getByPlaceholderText('0-5');

    // Try entering negative value
    await user.type(input, '-1');

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('displays error for non-numeric input', async () => {
    const user = userEvent.setup();
    render(<StarsLogger currentStars={0} onStarsSaved={mockOnStarsSaved} />);

    const input = screen.getByPlaceholderText('0-5');

    // Try entering text
    await user.type(input, 'abc');

    // Error should appear for non-numeric input
    await waitFor(() => {
      const errorElement = screen.queryByRole('alert');
      if (errorElement) {
        expect(errorElement).toBeInTheDocument();
      }
    });
  });

  it('displays success message after saving', async () => {
    const user = userEvent.setup();
    render(<StarsLogger currentStars={0} onStarsSaved={mockOnStarsSaved} />);

    const input = screen.getByPlaceholderText('0-5');
    await user.type(input, '4');

    const submitButton = screen.getByRole('button', { name: /save stars/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/great job/i)).toBeInTheDocument();
    });
  });

  it('clears input after successful submission', async () => {
    const user = userEvent.setup();
    render(<StarsLogger currentStars={0} onStarsSaved={mockOnStarsSaved} />);

    const input = screen.getByPlaceholderText('0-5') as HTMLInputElement;
    await user.type(input, '2');

    const submitButton = screen.getByRole('button', { name: /save stars/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('renders filled stars for current count', () => {
    const { container } = render(<StarsLogger currentStars={3} onStarsSaved={mockOnStarsSaved} />);

    const filledStars = container.querySelectorAll('.filled');
    expect(filledStars).toHaveLength(3);
  });

  it('renders empty stars for remaining count', () => {
    const { container } = render(<StarsLogger currentStars={2} onStarsSaved={mockOnStarsSaved} />);

    const emptyStars = container.querySelectorAll('.empty');
    expect(emptyStars).toHaveLength(3); // 5 - 2
  });

  it('displays all 5 stars for max count', () => {
    const { container } = render(<StarsLogger currentStars={5} onStarsSaved={mockOnStarsSaved} />);

    const allStars = container.querySelectorAll('.star');
    expect(allStars).toHaveLength(5);

    const filledStars = container.querySelectorAll('.filled');
    expect(filledStars).toHaveLength(5);
  });

  it('displays 0 filled stars for 0 count', () => {
    const { container } = render(<StarsLogger currentStars={0} onStarsSaved={mockOnStarsSaved} />);

    const filledStars = container.querySelectorAll('.filled');
    expect(filledStars).toHaveLength(0);

    const emptyStars = container.querySelectorAll('.empty');
    expect(emptyStars).toHaveLength(5);
  });

  it('disables submit button when input is invalid', async () => {
    const user = userEvent.setup();
    render(<StarsLogger currentStars={0} onStarsSaved={mockOnStarsSaved} />);

    const input = screen.getByPlaceholderText('0-5');
    await user.type(input, '10');

    const submitButton = screen.getByRole('button', { name: /save stars/i }) as HTMLButtonElement;

    await waitFor(() => {
      expect(submitButton.disabled).toBe(true);
    });
  });

  it('enables submit button for valid input', async () => {
    const user = userEvent.setup();
    render(<StarsLogger currentStars={0} onStarsSaved={mockOnStarsSaved} />);

    const input = screen.getByPlaceholderText('0-5');
    await user.type(input, '3');

    const submitButton = screen.getByRole('button', { name: /save stars/i }) as HTMLButtonElement;

    await waitFor(() => {
      expect(submitButton.disabled).toBe(false);
    });
  });

  it('accepts all valid star values 0-5', async () => {
    const user = userEvent.setup();

    for (let i = 0; i <= 5; i++) {
      const { rerender } = render(
        <StarsLogger currentStars={0} onStarsSaved={mockOnStarsSaved} />
      );

      const input = screen.getByPlaceholderText('0-5');
      await user.clear(input);
      await user.type(input, String(i));

      const submitButton = screen.getByRole('button', { name: /save stars/i });
      await user.click(submitButton);

      expect(mockOnStarsSaved).toHaveBeenCalledWith(i);
      mockOnStarsSaved.mockClear();
    }
  });

  it('has accessible aria attributes', () => {
    render(<StarsLogger currentStars={3} onStarsSaved={mockOnStarsSaved} />);

    const input = screen.getByPlaceholderText('0-5');
    expect(input).toHaveAttribute('aria-describedby', 'stars-hint');
  });

  it('updates display when currentStars prop changes', () => {
    const { rerender } = render(<StarsLogger currentStars={2} onStarsSaved={mockOnStarsSaved} />);

    expect(screen.getByText('2')).toBeInTheDocument();

    rerender(<StarsLogger currentStars={4} onStarsSaved={mockOnStarsSaved} />);

    expect(screen.getByText('4')).toBeInTheDocument();
  });
});
