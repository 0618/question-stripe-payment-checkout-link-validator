import React, { useState, useEffect, useRef } from 'react';
import './App.css';

/**
 * MOCK API
 * Simulates a Stripe backend check for slug availability.
 */
const checkSlugAvailability = async (slug: string, signal: AbortSignal): Promise<'available' | 'taken' | 'invalid'> => {
  // Simulate network delay (500ms - 1500ms)
  const delay = 500 + Math.random() * 1000;
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, delay);
    signal.addEventListener('abort', () => {
      clearTimeout(timeout);
      reject(new Error('Aborted'));
    });
  });

  if (!/^[a-z0-9-]+$/.test(slug)) return 'invalid';
  if (slug === 'stripe' || slug === 'pay') return 'taken';
  return 'available';
};

function App() {
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  
  // useRef to keep track of the latest debounced value
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const validateSlug = async (value: string) => {
    if (!value) {
      setStatus('idle');
      return;
    }

    setStatus('checking');

    // Abort previous request to handle race conditions (latest request wins)
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const result = await checkSlugAvailability(value, abortControllerRef.current.signal);
      setStatus(result);
    } catch (err: any) {
      if (err.name === 'Aborted') {
        console.log(`Request for "${value}" was aborted.`);
      } else {
        setStatus('invalid');
      }
    }
  };

  useEffect(() => {
    // Debouncing implementation
    if (timerRef.current) clearTimeout(timerRef.current);
    
    if (slug) {
      timerRef.current = setTimeout(() => {
        validateSlug(slug);
      }, 500);
    } else {
      setStatus('idle');
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [slug]);

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
          className={status === 'invalid' || status === 'taken' ? 'error' : ''}
        />
      </div>

      <div className="status-message">
        {status === 'checking' && <span className="checking">Checking availability...</span>}
        {status === 'available' && <span className="success">✓ This link is available</span>}
        {status === 'taken' && <span className="error">✗ This link is already taken</span>}
        {status === 'invalid' && <span className="error">✗ Slugs can only contain lowercase letters, numbers, and hyphens</span>}
      </div>

      <button disabled={status !== 'available'} className="primary-button">
        Create Link
      </button>

      <div className="interviewer-notes" style={{ marginTop: '3rem', padding: '1rem', background: '#f9f9f9', border: '1px solid #ddd' }}>
        <h3>Interviewer Hints:</h3>
        <ul>
          <li><strong>Debouncing:</strong> Look for <code>setTimeout</code> or a custom hook to avoid rapid API calls.</li>
          <li><strong>Race Conditions:</strong> Essential for Senior/Stripe style. Use <code>AbortController</code> or a ref counter to ignore stale results.</li>
          <li><strong>Loading State:</strong> Ensure UI feedback during the "checking" phase.</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
