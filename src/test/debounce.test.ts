import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from '../utils/debounce';

describe('debounce utility', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should delay the function execution', () => {
    const callback = vi.fn();
    const debouncedFn = debounce(callback, 500);

    debouncedFn();

    // Should not be called immediately
    expect(callback).not.toHaveBeenCalled();

    // Advance time by 499ms
    vi.advanceTimersByTime(499);
    expect(callback).not.toHaveBeenCalled();

    // Advance time by 1ms to reach 500ms
    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should only call the function once after multiple calls', () => {
    const callback = vi.fn();
    const debouncedFn = debounce(callback, 500);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    // Advance time by 500ms
    vi.advanceTimersByTime(500);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should reset the timer on subsequent calls', () => {
    const callback = vi.fn();
    const debouncedFn = debounce(callback, 500);

    debouncedFn();

    // Advance 300ms
    vi.advanceTimersByTime(300);
    
    // Call again, should reset timer
    debouncedFn();

    // Advance another 300ms (total 600ms from start, but 300ms from last call)
    vi.advanceTimersByTime(300);
    expect(callback).not.toHaveBeenCalled();

    // Advance another 200ms to reach 500ms since last call
    vi.advanceTimersByTime(200);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should pass correct arguments to the original function', () => {
    const callback = vi.fn();
    const debouncedFn = debounce(callback, 500);

    debouncedFn('hello', 123);
    vi.advanceTimersByTime(500);

    expect(callback).toHaveBeenCalledWith('hello', 123);
  });
});
