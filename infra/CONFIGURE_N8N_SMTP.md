# Configure n8n SMTP for Invitation Emails

## Problem
Invitation emails are not being sent because SMTP is not configured on your n8n server.

## Quick Fix: Configure SMTP

### Step 1: Get Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in with: `alij123402@gmail.com`
3. Select "Mail" → "Other (Custom name)" → Enter "n8n"
4. Click "Generate"
5. Copy the 16-character app password (it will look like: `abcd efgh ijkl mnop`)

### Step 2: Update Docker Compose

Edit your n8n docker-compose file (likely `infra/docker-compose.n8n.yml`):

```yaml
n8n:
  environment:
    # ... existing environment variables ...
    
    # SMTP Configuration for sending invitation emails
    - N8N_EMAIL_MODE=smtp
    - N8N_SMTP_HOST=smtp.gmail.com
    - N8N_SMTP_PORT=587
    - N8N_SMTP_USER=alij123402@gmail.com
    - N8N_SMTP_PASS=your-16-char-app-password-here  # Replace with actual app password
    - N8N_SMTP_SENDER=alij123402@gmail.com
    - N8N_SMTP_SECURE=false  # Use TLS
```

### Step 3: Restart n8n

```bash
cd infra
docker compose -f docker-compose.n8n.yml restart n8n
```

Or if using a different compose file:

```bash
docker compose restart n8n
```

### Step 4: Test

After restarting, test by creating a new user or manually sending an invitation:

```bash
cd backend
node manually-send-invitation.js user@example.com
```

## Alternative: Use SendGrid or Other SMTP Provider

If you prefer not to use Gmail:

```yaml
- N8N_EMAIL_MODE=smtp
- N8N_SMTP_HOST=smtp.sendgrid.net
- N8N_SMTP_PORT=587
- N8N_SMTP_USER=apikey
- N8N_SMTP_PASS=your-sendgrid-api-key
- N8N_SMTP_SENDER=noreply@avallon.ca
```

## Verify SMTP is Working

1. Check n8n logs:
   ```bash
   docker compose logs n8n | grep -i smtp
   ```

2. Try sending a test invitation:
   ```bash
   cd backend
   node manually-send-invitation.js test@example.com
   ```

3. Check the user's email inbox for the invitation

## Troubleshooting

### Issue: "SMTP connection failed"

- Verify SMTP credentials are correct
- Check firewall allows outbound connections on port 587
- For Gmail, make sure you're using an App Password, not your regular password

### Issue: "Email sent but not received"

- Check spam folder
- Verify sender email is correct
- Check SMTP logs in n8n

### Issue: "Authentication failed"

- For Gmail: Make sure 2FA is enabled and you're using App Password
- Verify SMTP_USER and SMTP_PASS are correct
- Check if your email provider requires specific settings













