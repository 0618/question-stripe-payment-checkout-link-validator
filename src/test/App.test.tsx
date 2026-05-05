import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

describe('Checkout Link Validator - Task Verification', () => {
  beforeEach(() => {
    // No fake timers to avoid complexity with async API simulation
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Task 1: Basic Integration (Easy)', () => {
    it('shows "Checking..." status after typing', async () => {
      render(<App />);
      const input = screen.getByPlaceholderText('your-slug');
      
      fireEvent.change(input, { target: { value: 'test' } });
      
      const getCheckingMessage = () => screen.queryByText('Checking availability...', { selector: '.checking' });

      // Wait for debounce (500ms)
      await waitFor(() => {
        expect(getCheckingMessage()).toBeInTheDocument();
      }, { timeout: 1000 });
    });

    it('displays validation result from the API', async () => {
      render(<App />);
      const input = screen.getByPlaceholderText('your-slug');
      
      fireEvent.change(input, { target: { value: 'stripe' } });
      
      // Wait for debounce (500ms) + API delay (max 1500ms)
      await waitFor(() => {
        expect(screen.getByText(/already taken/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Task 2: Debouncing (Medium)', () => {
    it('does not trigger API result early', async () => {
      render(<App />);
      const input = screen.getByPlaceholderText('your-slug');
      
      fireEvent.change(input, { target: { value: 'valid' } });

      const getCheckingMessage = () => screen.queryByText('Checking availability...', { selector: '.checking' });

      // Check after 200ms (less than 500ms debounce)
      await new Promise(r => setTimeout(r, 200));
      expect(getCheckingMessage()).toBeNull();

      // Now wait for it to actually trigger
      await waitFor(() => {
        expect(getCheckingMessage()).toBeInTheDocument();
      }, { timeout: 1000 });
    });

    it('resets debounce timer on subsequent keystrokes', async () => {
      render(<App />);
      const input = screen.getByPlaceholderText('your-slug');
      const getCheckingMessage = () => screen.queryByText('Checking availability...', { selector: '.checking' });
      
      // Keystroke 1
      fireEvent.change(input, { target: { value: 'v' } });
      await new Promise(r => setTimeout(r, 300));
      
      // Keystroke 2 (resets timer)
      fireEvent.change(input, { target: { value: 'va' } });
      await new Promise(r => setTimeout(r, 300));

      // Total 600ms passed, but only 300ms since last change.
      expect(getCheckingMessage()).toBeNull();

      // Final wait
      await waitFor(() => {
        expect(getCheckingMessage()).toBeInTheDocument();
      }, { timeout: 1000 });
    });
  });

  describe('Task 3: Race Conditions (Hard)', () => {
    it('only honors the latest request result (Latest Wins)', async () => {
      render(<App />);
      const input = screen.getByPlaceholderText('your-slug');

      // 1. Start a request for "stripe" (taken)
      fireEvent.change(input, { target: { value: 'stripe' } });
      
      // 2. Wait 300ms (within debounce), then change to "valid-link" (available)
      await new Promise(r => setTimeout(r, 300));
      fireEvent.change(input, { target: { value: 'valid-link' } });

      // Verification: UI must eventually show "available" and NEVER "already taken"
      await waitFor(() => {
        expect(screen.getByText(/available/i)).toBeInTheDocument();
      }, { timeout: 4000 });

      expect(screen.queryByText(/already taken/i)).not.toBeInTheDocument();
    });
  });
});
