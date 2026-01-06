# Quick SMTP Setup for n8n Invitation Emails

## 🚀 Quick Setup (2 Steps)

### Step 1: Get Gmail App Password

1. Go to: **https://myaccount.google.com/apppasswords**
2. Sign in with: `alij123402@gmail.com`
3. Select **"Mail"** → **"Other (Custom name)"** → Enter **"n8n"**
4. Click **"Generate"**
5. Copy the **16-character app password** (looks like: `abcd efgh ijkl mnop`)

### Step 2: Run Configuration Script

**On your n8n server:**

```bash
cd /path/to/infra  # Where your docker-compose.n8n.yml is located
./configure-n8n-smtp.sh
```

The script will:
- ✅ Ask for your Gmail App Password
- ✅ Add SMTP configuration to docker-compose.yml
- ✅ Optionally restart n8n container

## 📧 Manual Configuration

If you prefer to configure manually:

1. **SSH into your n8n server**
2. **Edit docker-compose file:**
   ```bash
   nano docker-compose.n8n.yml
   ```

3. **Add these lines** after `N8N_SECURE_COOKIE=true`:
   ```yaml
   # SMTP Configuration for sending invitation emails
   - N8N_EMAIL_MODE=smtp
   - N8N_SMTP_HOST=smtp.gmail.com
   - N8N_SMTP_PORT=587
   - N8N_SMTP_USER=alij123402@gmail.com
   - N8N_SMTP_PASS=your-16-char-app-password-here
   - N8N_SMTP_SENDER=alij123402@gmail.com
   - N8N_SMTP_SECURE=false  # Use TLS
   ```

4. **Restart n8n:**
   ```bash
   docker compose restart n8n
   ```

## ✅ Verify It's Working

After configuration, test by:

1. **Creating a new user** in Avallon frontend
2. **Or manually send invitation:**
   ```bash
   cd backend
   node manually-send-invitation.js user@example.com
   ```

3. **Check the user's email** for the invitation

## 🔍 Troubleshooting

### "SMTP connection failed"
- Verify App Password is correct (16 characters, no spaces)
- Make sure 2FA is enabled on Gmail account
- Check firewall allows outbound port 587

### "Email not received"
- Check spam folder
- Verify SMTP settings in docker-compose.yml
- Check n8n logs: `docker compose logs n8n | grep -i smtp`

### "Authentication failed"
- Make sure you're using **App Password**, not regular password
- Verify `N8N_SMTP_USER` matches your Gmail address
- Check that 2FA is enabled

## 📝 Current Configuration

Your n8n is configured to send invitations from:
- **From:** alij123402@gmail.com
- **SMTP:** smtp.gmail.com:587
- **Security:** TLS

Once configured, all new users will automatically receive invitation emails! 🎉













