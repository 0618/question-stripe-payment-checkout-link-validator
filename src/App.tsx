import React, { useState } from 'react';
import './App.css';

/**
 * MOCK API
 * Simulates a Stripe backend check for slug availability.
 * DO NOT MODIFY THIS FUNCTION.
 */
const checkSlugAvailability = async (slug: string, signal?: AbortSignal): Promise<'available' | 'taken' | 'invalid'> => {
  // Simulate network delay (500ms - 1500ms)
  const delay = 500 + Math.random() * 1000;
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, delay);
    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timeout);
        reject(new Error('Aborted'));
      });
    }
  });

  if (!/^[a-z0-9-]+$/.test(slug)) return 'invalid';
  if (slug === 'stripe' || slug === 'pay') return 'taken';
  return 'available';
};

function App() {
  const [slug, setSlug] = useState('');

  // TODO: Implement the validation logic here.
  // 1. Debounce the API call to avoid rapid requests.
  // 2. Handle race conditions (ensure latest request wins).
  // 3. Show "Checking..." state during validation.
  // 4. Show success/error messages based on API results.

  return (
    <div className="container">
      <h1>Stripe Checkout Link</h1>
      <p>Customise your checkout link slug.</p>
      
      <div className="input-group">
        <span className="prefix">stripe.com/pay/</span>
        <input 
          type="text" 
          value={slug}
          onChange={(e) => setSlug(e.target.value.toLowerCase())}
          placeholder="your-slug"
        />
      </div>

      <div className="status-message">
        {/* TODO: Display status messages here */}
      </div>

      <button className="primary-button">
        Create Link
      </button>
    </div>
  );
}

export default App;
