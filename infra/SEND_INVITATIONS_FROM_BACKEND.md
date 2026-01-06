# Send Invitations from Backend Instead of n8n

## Problem
n8n container can't connect to SMTP (firewall blocking), but SMTP works from backend.

## Solution: Send Invitations Directly from Backend

Since SMTP works from your local machine/backend, we can send invitation emails directly from the backend code instead of relying on n8n.

### Implementation

The backend already has the `sendN8nInvitation` function, but it tries to use n8n's API. We can modify it to send emails directly using nodemailer (which we know works).

### Benefits
- ✅ SMTP works from backend (already tested)
- ✅ No firewall issues
- ✅ More reliable
- ✅ Better error handling

### Next Steps
1. Update `sendN8nInvitation` to send emails directly
2. Use the same SMTP config that works
3. Send invitation emails when users are created

This will bypass n8n's SMTP entirely and send invitations directly from the backend.













