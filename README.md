# Mock Interview: Stripe Payment Checkout Link Validator

**Domain**: Frontend (React)
**Style**: HackerRank
**Company**: Stripe
**Difficulty**: Senior

## Description
Implement a robust Checkout Link Management component with real-time slug validation, debouncing, and race condition handling (latest request wins).

## Interviewer Guide
### Key Concepts to Test (Hints)
- **Debouncing**: Candidate should implement debouncing to avoid overwhelming the API.
- **Race Conditions**: Candidate must handle "latest request wins" (e.g., using an abort controller or a simple flag/counter).
- **Loading States**: Ensure "Checking..." status is visually clear.

### Key Concepts to Test (Checklist)
- [ ] State Management
- [ ] Performance (Memoization)
- [ ] Error Handling

### Expected Solution
(Solution implementation details here)
