# n8n Automatic Account Creation & Login Setup

This document explains how Avallon automatically creates n8n accounts for new users and enables automatic login.

## Overview

When a user signs up for Avallon:
1. ✅ An n8n user account is automatically created on your VPS n8n instance
2. ✅ **The account is automatically activated** (no manual approval needed)
3. ✅ The n8n password is encrypted and stored securely in the database
4. ✅ Users can automatically log into n8n to edit their agents

## How It Works

### 1. User Signup Flow

When a user signs up via `/api/signup-notification`:
- Signup data is stored
- User is redirected to dashboard
- Frontend calls `/api/users/onboard` automatically

### 2. Onboarding Flow (`/api/users/onboard`)

The onboarding endpoint:
1. **Creates n8n user account** via `createN8nUser()`:
   - Uses `N8N_API_KEY` if available (requires user management permissions)
   - Falls back to `N8N_ADMIN_EMAIL` + `N8N_ADMIN_PASSWORD` if API key lacks permissions
   - Generates a secure random password automatically
   - **Automatically activates the user account** (sets `isPending: false`)
   - **Optionally sends invitation email** if `N8N_SEND_INVITATIONS=true` is set
   - Returns the password for storage

2. **Stores credentials securely**:
   - Encrypts the n8n password using AES-256-GCM encryption
   - Stores encrypted password in `User.n8nPassword` field
   - Stores n8n user ID in `User.n8nUserId` field
   - Creates User record if it doesn't exist

3. **Creates default agent**:
   - Creates an n8n workflow for the user
   - Links it to the user's account

### 3. Automatic Login (`/api/n8n/login`)

Users can automatically log into n8n by calling:
- **GET** `/api/n8n/login` - Redirects to n8n with session cookie
- **POST** `/api/n8n/login` - Returns session info for frontend handling

The endpoint:
1. Retrieves user's encrypted n8n password from database
2. Decrypts the password
3. Logs into n8n using `/rest/login` endpoint
4. Gets session cookie from n8n
5. Redirects user to n8n with authenticated session

## Database Schema

The `User` model now includes:
```prisma
model User {
  id             String        @id @default(cuid())
  clerkId        String        @unique
  email          String        @unique
  n8nPassword    String?       // Encrypted n8n password for automatic login
  n8nUserId      String?       // n8n user ID
  // ... other fields
}
```

## Environment Variables Required

```env
# n8n Configuration
N8N_BASE_URL=https://agents.avallon.ca
N8N_API_KEY=your_api_key_here  # Optional: if has user management permissions
N8N_ADMIN_EMAIL=admin@example.com  # Required if N8N_API_KEY lacks permissions
N8N_ADMIN_PASSWORD=your_admin_password  # Required if N8N_API_KEY lacks permissions

# Optional: Automatically send invitation emails to new users
N8N_SEND_INVITATIONS=true  # Set to "true" to send invitation emails automatically

# Encryption Key (for password storage)
N8N_ENCRYPTION_KEY=base64_encoded_32_byte_key  # Optional: auto-generated in dev
```

## Security Notes

1. **Password Encryption**: n8n passwords are encrypted using AES-256-GCM before storage
2. **Encryption Key**: Set `N8N_ENCRYPTION_KEY` in production (32-byte key, base64 encoded)
3. **Session Cookies**: n8n session cookies are domain-specific and cannot be set cross-domain
4. **HTTPS Required**: n8n instance should use HTTPS for secure cookie transmission

## Testing the Flow

### 1. Test Signup

```bash
# Sign up a new user via frontend
# Check backend logs for:
# - "Creating n8n user account"
# - "n8n user account created"
# - "Stored n8n credentials in database"
```

### 2. Verify n8n Account Creation

```bash
# Check n8n instance at https://agents.avallon.ca
# Go to Settings → Users
# Verify new user appears with email matching signup
# User should be ACTIVE (not pending) - automatically activated
```

### 3. Test Automatic Login

```bash
# Call the login endpoint
curl -X GET "http://localhost:3000/api/n8n/login" \
  -H "x-user-email: user@example.com" \
  -L

# Should redirect to n8n with authenticated session
```

## Troubleshooting

### Issue: "n8n account not found"

**Cause**: User record doesn't exist or n8n credentials weren't stored

**Solution**:
1. Check if User record exists: `SELECT * FROM "User" WHERE email = 'user@example.com'`
2. Verify onboarding was called during signup
3. Check backend logs for errors during n8n user creation

### Issue: "Failed to login to n8n"

**Cause**: Password decryption failed or n8n login endpoint unavailable

**Solution**:
1. Verify `N8N_ENCRYPTION_KEY` is set correctly (same key used for encryption/decryption)
2. Check n8n instance is accessible: `curl https://agents.avallon.ca/rest/login`
3. Verify n8n user account exists and password is correct

### Issue: "No n8n admin credentials configured"

**Cause**: Missing `N8N_API_KEY` or `N8N_ADMIN_EMAIL` + `N8N_ADMIN_PASSWORD`

**Solution**:
1. Set `N8N_API_KEY` with user management permissions, OR
2. Set both `N8N_ADMIN_EMAIL` and `N8N_ADMIN_PASSWORD`

### Issue: "User account is pending in n8n"

**Cause**: Automatic activation failed (API key may lack permissions or n8n API endpoint changed)

**Solution**:
1. Check backend logs for activation errors
2. Verify `N8N_API_KEY` has user management permissions
3. Manually activate user in n8n UI: Settings → Users → Activate
4. The system will try multiple activation methods automatically, but if all fail, manual activation is required

### Issue: Cross-domain cookie not working

**Cause**: n8n is on different domain than Avallon backend

**Solution**:
- Use POST endpoint and handle redirect in frontend
- Or use a proxy endpoint that sets cookies server-side
- Or implement SSO/OAuth integration

## Migration Required

Run the database migration to add the new fields:

```bash
cd backend
npx prisma migrate dev --name add_n8n_credentials
```

## Automatic Invitation Emails

To automatically send invitation emails when new users sign up:

1. **Set environment variable:**
   ```env
   N8N_SEND_INVITATIONS=true
   ```

2. **Ensure admin credentials are set:**
   ```env
   N8N_ADMIN_EMAIL=your-admin@example.com
   N8N_ADMIN_PASSWORD=your-admin-password
   ```

3. **Configure n8n SMTP settings** (on your n8n server):
   - Set SMTP environment variables in your n8n docker-compose.yml or .env
   - Required variables:
     - `N8N_EMAIL_MODE=smtp`
     - `N8N_SMTP_HOST=your-smtp-server.com`
     - `N8N_SMTP_PORT=587`
     - `N8N_SMTP_USER=your-smtp-username`
     - `N8N_SMTP_PASS=your-smtp-password`
     - `N8N_SMTP_SENDER=noreply@yourdomain.com`

4. **Restart n8n** after configuring SMTP

When enabled, new users will automatically receive an invitation email with a link to set up their n8n account.

## Next Steps

- [ ] Run database migration
- [ ] Set `N8N_ENCRYPTION_KEY` in production environment
- [ ] Set `N8N_ADMIN_EMAIL` and `N8N_ADMIN_PASSWORD` for invitation emails
- [ ] Set `N8N_SEND_INVITATIONS=true` to enable automatic invitations
- [ ] Configure n8n SMTP settings for email delivery
- [ ] Test signup flow end-to-end
- [ ] Verify n8n accounts are created correctly
- [ ] Verify invitation emails are sent
- [ ] Test automatic login functionality
- [ ] Add frontend button/link to "Edit in n8n" that calls `/api/n8n/login`



