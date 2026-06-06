# Testing Guide

## Manual Verification
1. **Authentication:** 
   - Ensure Guests cannot apply for jobs or access community.
   - Verify Mobile login restriction (10 AM to 1 PM).
2. **Subscriptions:** 
   - Attempt payment outside of 10 AM-11 AM IST to verify 403 Forbidden.
   - Verify Razorpay test mode signature processing.
3. **Password Reset:**
   - Request reset, check email/SMS for A-Z only password.
   - Request again within 24 hours to verify 429 Too Many Requests.
4. **Community Limits:**
   - Attempt to post with 0 friends to verify 403 Forbidden.

## Automated Testing
- Frontend tests located in `internarea/__tests__` (Jest/React Testing Library).
- Backend tests located in `backend/tests` (Mocha/Chai).
