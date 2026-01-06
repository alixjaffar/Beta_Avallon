# n8n Automatic Invitation Email Setup

## ✅ Configuration Complete

Your n8n admin credentials have been configured:
- **Admin Email:** `Hello@avallon.ca`
- **Invitation Sending:** Enabled (`N8N_SEND_INVITATIONS=true`)

## How It Works

When a new user signs up in Avallon:

1. ✅ **n8n account is created** automatically
2. ✅ **Account is activated** automatically (no manual approval needed)
3. ✅ **Invitation email is sent** automatically to the user's email address
4. ✅ User receives email with invitation link to set up their n8n account

## Next Steps: Configure n8n SMTP

For invitation emails to be sent, you need to configure SMTP settings on your n8n server.

### Option 1: Update Docker Compose (Recommended)

Edit your `infra/docker-compose.n8n.yml` file and add SMTP environment variables:

```yaml
n8n:
  environment:
    # ... existing environment variables ...
    
    # SMTP Configuration for sending invitation emails
    - N8N_EMAIL_MODE=smtp
    - N8N_SMTP_HOST=smtp.gmail.com  # or your SMTP server
    - N8N_SMTP_PORT=587
    - N8N_SMTP_USER=alij123402@gmail.com  # Your Gmail address
    - N8N_SMTP_PASS=your-app-password  # Gmail App Password (not regular password)
    - N8N_SMTP_SENDER=alij123402@gmail.com
    - N8N_SMTP_SECURE=false  # Use TLS
```

### Option 2: Use Gmail App Password

If using Gmail for SMTP:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)" → "n8n"
   - Copy the 16-character app password
3. **Update docker-compose.yml** with the app password:
   ```yaml
   - N8N_SMTP_PASS=xxxx xxxx xxxx xxxx  # Your 16-char app password
   ```

### Option 3: Use Another SMTP Provider

You can use any SMTP provider (SendGrid, Mailgun, etc.):

```yaml
- N8N_SMTP_HOST=smtp.sendgrid.net
- N8N_SMTP_PORT=587
- N8N_SMTP_USER=apikey
- N8N_SMTP_PASS=your-sendgrid-api-key
- N8N_SMTP_SENDER=noreply@avallon.ca
```

## Restart n8n After Configuration

After updating SMTP settings:

```bash
cd infra
docker compose -f docker-compose.n8n.yml restart n8n
```

Or if using a different compose file:

```bash
docker compose restart n8n
```

## Testing

1. **Create a test account** in Avallon
2. **Check the user's email** for invitation email from n8n
3. **Check backend logs** for:
   - "Invitation email sent successfully"
   - Any errors related to SMTP

## Troubleshooting

### Issue: Invitation emails not being sent

**Check:**
1. Is `N8N_SEND_INVITATIONS=true` in your `.env` file?
2. Are SMTP settings configured correctly in n8n?
3. Check n8n logs: `docker compose logs n8n | grep -i smtp`
4. Check backend logs for invitation sending errors

### Issue: SMTP authentication failed

**Solutions:**
- If using Gmail, make sure you're using an **App Password**, not your regular password
- Verify SMTP host, port, and credentials are correct
- Check if your email provider requires specific security settings

### Issue: Emails going to spam

**Solutions:**
- Set up SPF/DKIM records for your domain
- Use a professional email service (SendGrid, Mailgun)
- Configure `N8N_SMTP_SENDER` with a verified email address

## Security Notes

- ✅ Admin credentials are stored in `.env` file (not committed to git)
- ✅ Passwords are never logged or exposed
- ✅ SMTP credentials are stored securely in docker-compose environment variables
- ⚠️ Never commit `.env` or docker-compose files with real credentials to git

## Current Configuration

Your backend is now configured to:
- ✅ Automatically create n8n accounts for new users
- ✅ Automatically activate accounts (no manual approval)
- ✅ Automatically send invitation emails (when SMTP is configured)

Once you configure SMTP on your n8n server, invitation emails will be sent automatically!

