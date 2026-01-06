# Configure n8n SMTP for Hello@avallon.ca

## ✅ Configuration Complete

Your n8n is now configured to:
- **Send invitation emails from:** `Hello@avallon.ca`
- **Admin account:** `Hello@avallon.ca` (also used for n8n management)

## 📧 SMTP Settings

- **SMTP Host:** `smtp.gmail.com`
- **SMTP Port:** `587`
- **SMTP User:** `Hello@avallon.ca`
- **SMTP Password:** `oagqtgpxwcldyibn` (App Password)
- **SMTP Sender:** `Hello@avallon.ca`
- **Security:** TLS (not SSL)

## 🚀 Quick Setup on Your VPS

### Step 1: SSH into your n8n server

```bash
ssh root@159.89.113.242
```

### Step 2: Navigate to n8n directory

```bash
cd /opt/avallon-n8n
```

### Step 3: Edit docker-compose file

```bash
nano docker-compose.n8n.yml
```

### Step 4: Add SMTP Configuration

Find the line with `N8N_SECURE_COOKIE=true` and add these lines right after it:

```yaml
      # SMTP Configuration for sending invitation emails
      # Using Hello@avallon.ca (Google Workspace) via Gmail SMTP
      - N8N_EMAIL_MODE=smtp
      - N8N_SMTP_HOST=smtp.gmail.com
      - N8N_SMTP_PORT=587
      - N8N_SMTP_USER=Hello@avallon.ca
      - N8N_SMTP_PASS=oagqtgpxwcldyibn
      - N8N_SMTP_SENDER=Hello@avallon.ca
      - N8N_SMTP_SECURE=false  # Use TLS
```

### Step 5: Save and Exit

- Press `Ctrl+X`
- Press `Y` to confirm
- Press `Enter` to save

### Step 6: Restart n8n

```bash
docker compose restart n8n
```

### Step 7: Verify

```bash
docker compose logs n8n | tail -20
```

Look for any SMTP-related errors. If you see "SMTP connection successful" or no errors, it's working!

## ✅ Test It

After configuration:

1. **Create a new user** in Avallon frontend
2. **Check the user's email** - they should receive invitation from `Hello@avallon.ca`
3. **Or manually send invitation:**
   ```bash
   cd backend
   node manually-send-invitation.js user@example.com
   ```

## 📝 What This Does

When a new user signs up in Avallon:
1. ✅ n8n account is created automatically
2. ✅ Account is activated automatically
3. ✅ **Invitation email is sent from Hello@avallon.ca** ✨
4. ✅ User receives professional invitation email

## 🔍 Troubleshooting

### "SMTP authentication failed"
- Verify the App Password is correct: `oagqtgpxwcldyibn` (no spaces)
- Make sure `Hello@avallon.ca` has 2FA enabled
- Check that Google Workspace allows SMTP access

### "Email not received"
- Check spam folder
- Verify SMTP settings in docker-compose.yml
- Check n8n logs: `docker compose logs n8n | grep -i smtp`

### "Connection timeout"
- Check firewall allows outbound port 587
- Verify `smtp.gmail.com` is accessible from your server

## 🎉 Success!

Once configured, all invitation emails will be sent from **Hello@avallon.ca** - your professional business email! 🚀

