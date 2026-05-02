# Mock Interview: Stripe Payment Checkout Link Validator

**Domain**: Frontend (React)
**Style**: HackerRank
**Company**: Stripe
**Difficulty**: Senior

## Description
Implement a robust Checkout Link Management component. Users need to be able to type a "slug" for their checkout link (e.g., `stripe.com/pay/my-slug`).

### Tasks:
1. **Task 1 (Easy)**: Implement the basic input field. When the user types, show a "Checking..." status and then the result from the provided `checkSlugAvailability` API.
2. **Task 2 (Medium)**: Optimize the validation. Ensure the UI doesn't spam the API on every keystroke and remains responsive even during rapid input.
3. **Task 3 (Hard)**: Handle high-latency environments. Ensure that if multiple validation requests are in flight, only the result of the *latest* input is shown (prevent the UI from flickering between old and new results).

## Instructions for Candidate
- Your task is to implement the functionality described in the tasks above.
- Focus on performance, clean code, and accessibility.
