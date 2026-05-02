import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

describe('Checkout Link Validator - Task Verification', () => {
  beforeEach(() => {
    // We are NOT using fake timers here to avoid complexity with async/await
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Task 1: Basic Integration (Easy)', () => {
    it('shows "Checking..." status immediately after typing', async () => {
      render(<App />);
      const input = screen.getByPlaceholderText('your-slug');
      
      fireEvent.change(input, { target: { value: 'test' } });
      
      // Should show checking state
      expect(screen.getByText(/checking/i)).toBeInTheDocument();
    });

    it('displays validation result from the API', async () => {
      render(<App />);
      const input = screen.getByPlaceholderText('your-slug');
      
      fireEvent.change(input, { target: { value: 'stripe' } });
      
      // Wait for debounce (500ms) + API delay (max 1500ms)
      await waitFor(() => {
        expect(screen.getByText(/already taken/i)).toBeInTheDocument();
      }, { timeout: 4000 });
    });
  });

  describe('Task 2: Debouncing (Medium)', () => {
    it('does not trigger API result early, and eventually shows result', async () => {
      render(<App />);
      const input = screen.getByPlaceholderText('your-slug');
      
      fireEvent.change(input, { target: { value: 'valid' } });

      // Check after 200ms (less than 500ms debounce)
      await new Promise(r => setTimeout(r, 200));

      // Status should still be checking or idle, not a final result yet
      expect(screen.queryByText(/available/i)).not.toBeInTheDocument();

      // Now wait for it to actually finish
      await waitFor(() => {
        expect(screen.getByText(/available/i)).toBeInTheDocument();
      }, { timeout: 4000 });
    });
  });

  describe('Task 3: Race Conditions (Hard)', () => {
    it('only honors the latest request result (Latest Wins)', async () => {
      render(<App />);
      const input = screen.getByPlaceholderText('your-slug');

      // 1. Start a request for "stripe" (taken)
      fireEvent.change(input, { target: { value: 'stripe' } });
      
      // 2. Wait 100ms, then change to "valid-link" (available)
      await new Promise(r => setTimeout(r, 100));
      fireEvent.change(input, { target: { value: 'valid-link' } });

      // Verification: Even if the "stripe" request eventually finishes, 
      // the UI must show "available" because "valid-link" was the last input.
      await waitFor(() => {
        expect(screen.getByText(/available/i)).toBeInTheDocument();
      }, { timeout: 5000 });

      expect(screen.queryByText(/already taken/i)).not.toBeInTheDocument();
    });
  });
});
