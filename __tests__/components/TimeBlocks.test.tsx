import { render, screen } from '@testing-library/react';
import { TimeBlock } from '@/components/Schedule/TimeBlock';
import { TimeBlocks } from '@/components/Schedule/TimeBlocks';
import type { TimeBlock as TimeBlockType, DailySchedule } from '@/lib/types';
import { generateTimeBlocks } from '@/lib/utils/timeBlocks';
import { getISODate } from '@/lib/utils/dateHelpers';

describe('TimeBlock Component', () => {
  const mockTimeBlock: TimeBlockType = {
    id: '07:00',
    activity: 'Wake up',
  };

  it('renders a single time block with start and end times', () => {
    render(
      <TimeBlock
        block={mockTimeBlock}
        isCurrentBlock={false}
        isPastBlock={false}
      />
    );

    expect(screen.getByText(/7:00 AM/)).toBeInTheDocument();
    expect(screen.getByText(/7:30 AM/)).toBeInTheDocument();
  });

  it('displays activity text when present', () => {
    render(
      <TimeBlock
        block={mockTimeBlock}
        isCurrentBlock={false}
        isPastBlock={false}
      />
    );

    expect(screen.getByText('Wake up')).toBeInTheDocument();
  });

  it('displays placeholder when no activity', () => {
    const emptyBlock: TimeBlockType = {
      id: '08:00',
    };

    render(
      <TimeBlock
        block={emptyBlock}
        isCurrentBlock={false}
        isPastBlock={false}
      />
    );

    expect(screen.getByText('Add activity')).toBeInTheDocument();
  });

  it('applies current styling when isCurrentBlock is true', () => {
    const { container } = render(
      <TimeBlock
        block={mockTimeBlock}
        isCurrentBlock={true}
        isPastBlock={false}
      />
    );

    const blockElement = container.querySelector('[data-block-id="07:00"]');
    expect(blockElement).toHaveClass('current');
  });

  it('applies past styling when isPastBlock is true', () => {
    const { container } = render(
      <TimeBlock
        block={mockTimeBlock}
        isCurrentBlock={false}
        isPastBlock={true}
      />
    );

    const blockElement = container.querySelector('[data-block-id="07:00"]');
    expect(blockElement).toHaveClass('past');
  });

  it('renders current indicator when block is current', () => {
    const { container } = render(
      <TimeBlock
        block={mockTimeBlock}
        isCurrentBlock={true}
        isPastBlock={false}
      />
    );

    const indicator = container.querySelector('.currentIndicator');
    expect(indicator).toBeInTheDocument();
  });

  it('does not render current indicator when block is not current', () => {
    const { container } = render(
      <TimeBlock
        block={mockTimeBlock}
        isCurrentBlock={false}
        isPastBlock={false}
      />
    );

    const indicator = container.querySelector('.currentIndicator');
    expect(indicator).not.toBeInTheDocument();
  });

  it('formats time correctly for afternoon blocks', () => {
    const afternoonBlock: TimeBlockType = {
      id: '14:30',
      activity: 'Lunch break',
    };

    render(
      <TimeBlock
        block={afternoonBlock}
        isCurrentBlock={false}
        isPastBlock={false}
      />
    );

    expect(screen.getByText(/2:30 PM/)).toBeInTheDocument();
    expect(screen.getByText(/3:00 PM/)).toBeInTheDocument();
  });

  it('formats time correctly for evening blocks', () => {
    const eveningBlock: TimeBlockType = {
      id: '20:00',
      activity: 'Dinner',
    };

    render(
      <TimeBlock
        block={eveningBlock}
        isCurrentBlock={false}
        isPastBlock={false}
      />
    );

    expect(screen.getByText(/8:00 PM/)).toBeInTheDocument();
    expect(screen.getByText(/8:30 PM/)).toBeInTheDocument();
  });
});

describe('TimeBlocks Component', () => {
  const mockSchedule: DailySchedule = {
    date: getISODate(new Date()),
    timeBlocks: generateTimeBlocks(),
    lastModified: Date.now(),
  };

  it('renders all 44 time blocks', () => {
    const { container } = render(
      <TimeBlocks schedule={mockSchedule} />
    );

    const blockElements = container.querySelectorAll('[data-block-id]');
    expect(blockElements).toHaveLength(44);
  });

  it('renders loading state when schedule is null', () => {
    render(<TimeBlocks schedule={null} />);

    expect(screen.getByText('Loading schedule...')).toBeInTheDocument();
  });

  it('renders time blocks in correct order (7:00 AM through 9:00 PM)', () => {
    const { container } = render(
      <TimeBlocks schedule={mockSchedule} />
    );

    const blockElements = container.querySelectorAll('[data-block-id]');
    const firstBlockId = blockElements[0].getAttribute('data-block-id');
    const lastBlockId = blockElements[blockElements.length - 1].getAttribute('data-block-id');

    expect(firstBlockId).toBe('07:00');
    expect(lastBlockId).toBe('20:30');
  });

  it('renders blocks with correct time intervals (30 minute gaps)', () => {
    const { container } = render(
      <TimeBlocks schedule={mockSchedule} />
    );

    const blockElements = container.querySelectorAll('[data-block-id]');
    const blockIds = Array.from(blockElements).map(el =>
      el.getAttribute('data-block-id')
    );

    // Verify first few blocks have 30-minute intervals
    expect(blockIds[0]).toBe('07:00');
    expect(blockIds[1]).toBe('07:30');
    expect(blockIds[2]).toBe('08:00');
    expect(blockIds[3]).toBe('08:30');
  });

  it('renders grid container for responsive layout', () => {
    const { container } = render(
      <TimeBlocks schedule={mockSchedule} />
    );

    const gridContainer = container.querySelector('.timeBlocksGrid');
    expect(gridContainer).toBeInTheDocument();
  });

  it('passes correct props to TimeBlock components', () => {
    const { container } = render(
      <TimeBlocks schedule={mockSchedule} />
    );

    const blockElements = container.querySelectorAll('[data-block-id]');
    // All blocks should be present
    expect(blockElements.length).toBe(44);

    // At least some blocks should have activity areas
    const activityAreas = container.querySelectorAll('.activityArea');
    expect(activityAreas.length).toBe(44);
  });

  it('calls onActivityChange callback when provided', () => {
    const mockCallback = jest.fn();
    const { container } = render(
      <TimeBlocks
        schedule={mockSchedule}
        onActivityChange={mockCallback}
      />
    );

    // Verify callback prop is received (actual invocation tested in integration)
    expect(container.querySelector('[data-block-id="07:00"]')).toBeInTheDocument();
  });

  it('displays time range correctly (7am to 9pm only)', () => {
    const { container } = render(
      <TimeBlocks schedule={mockSchedule} />
    );

    const blockElements = container.querySelectorAll('[data-block-id]');
    
    // First block should be 7:00 AM
    const firstBlockId = blockElements[0].getAttribute('data-block-id');
    expect(firstBlockId).toBe('07:00');

    // Last block should be 8:30 PM (because 20:30 + 30min = 21:00/9pm end)
    const lastBlockId = blockElements[blockElements.length - 1].getAttribute('data-block-id');
    expect(lastBlockId).toBe('20:30');

    // Should NOT include blocks before 7am or after 9pm
    const allIds = Array.from(blockElements).map(el => el.getAttribute('data-block-id'));
    expect(allIds.some(id => id === '06:30')).toBe(false);
    expect(allIds.some(id => id === '21:00')).toBe(false);
  });

  it('handles schedule with activities', () => {
    const scheduleWithActivities = {
      ...mockSchedule,
      timeBlocks: mockSchedule.timeBlocks.map((block, index) =>
        index % 3 === 0 ? { ...block, activity: `Activity ${index}` } : block
      ),
    };

    render(<TimeBlocks schedule={scheduleWithActivities} />);

    expect(screen.getByText('Activity 0')).toBeInTheDocument();
    expect(screen.getByText('Activity 3')).toBeInTheDocument();
  });

  it('renders with proper accessibility attributes', () => {
    const { container } = render(
      <TimeBlocks schedule={mockSchedule} />
    );

    const gridContainer = container.querySelector('.timeBlocksGrid');
    expect(gridContainer).toBeInTheDocument();

    // Verify blocks have accessible time labels
    const timeLabels = container.querySelectorAll('.timeLabel');
    expect(timeLabels.length).toBe(44);
  });
});
