# Mock Interview: Stripe Payment Checkout Link Validator

**Domain**: Frontend (React)
**Style**: HackerRank
**Company**: Stripe
**Difficulty**: Senior

## Description
Implement a robust Checkout Link Management component with 3 progressive tasks:
1. **Easy**: Basic API integration & loading states.
2. **Medium**: Debouncing / Optimization.
3. **Hard**: Race condition handling (AbortController / Latest-wins).

## Interviewer Guide
### Task 1: Basic Integration (Easy)
- **Check for**: Correct use of `useState` and `useEffect` to trigger the API.
- **Check for**: Displaying "Checking..." immediately when input changes.

### Task 2: Debouncing (Medium)
- **Check for**: Implementation of a debounce (via `setTimeout` or custom hook) to prevent API spam.
- **Check for**: Cleanup of the timeout on unmount or input change.

### Task 3: Race Conditions (Hard)
- **Check for**: Handling out-of-order API responses. If Task 1 request takes 2s and Task 2 request takes 0.5s, Task 1 must not overwrite Task 2.
- **Stripe/Senior expectation**: Use of `AbortController` or a ref-based version counter.

### Key Concepts to Test (Checklist)
- [ ] State Management
- [ ] Performance (Memoization)
- [ ] Error Handling

### Expected Solution
(Solution implementation details here)
