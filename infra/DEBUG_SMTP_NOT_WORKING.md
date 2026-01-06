# Debug: SMTP Not Sending Emails

## Problem
"Resend Invitation" button in n8n UI doesn't send emails, even though SMTP is configured.

## Step-by-Step Debugging

### Step 1: Verify SMTP is Loaded in Container

**On your VPS, run:**
```bash
ssh root@159.89.113.242
cd /opt/avallon-n8n
docker compose exec n8n env | grep -E "N8N_(EMAIL|SMTP)" | sort
```

**Expected output:**
```
N8N_EMAIL_MODE=smtp
N8N_SMTP_HOST=smtp.gmail.com
N8N_SMTP_PORT=587
N8N_SMTP_PASS=oagqtgpxwcldyibn
N8N_SMTP_SECURE=false
N8N_SMTP_SENDER=Hello@avallon.ca
N8N_SMTP_USER=Hello@avallon.ca
```

**If variables are missing:** Container needs to be recreated:
```bash
docker compose down
docker compose up -d
```

---

### Step 2: Check n8n Logs for SMTP Errors

```bash
docker compose logs n8n | grep -i -E "(smtp|email|mail|invitation|error)" | tail -50
```

**Look for:**
- `SMTP connection failed`
- `Authentication failed`
- `Email sending error`
- `SMTP not configured`

---

### Step 3: Test SMTP Connection from Container

```bash
docker compose exec n8n sh -c "timeout 5 nc -zv smtp.gmail.com 587"
```

**Expected:** `Connection to smtp.gmail.com 587 port [tcp/submission] succeeded!`

**If connection fails:** Firewall or network issue

---

### Step 4: Verify Gmail App Password

The app password might be wrong or expired. Check:

1. **Go to:** https://myaccount.google.com/apppasswords
2. **Sign in with:** Hello@avallon.ca
3. **Check if app password exists** for "n8n" or "Mail"
4. **If not, create new one:**
   - Select "Mail" → "Other (Custom name)" → "n8n"
   - Copy the 16-character password (no spaces)
   - Update `docker-compose.yml`:
     ```yaml
     - N8N_SMTP_PASS=your-new-app-password-here
     ```
   - Restart: `docker compose restart n8n`

---

### Step 5: Test SMTP Directly (Outside n8n)

**On your local machine:**
```bash
cd backend
npm install nodemailer  # If not installed
node test-smtp-directly.js aleemacheema@gmail.com
```

This tests if SMTP credentials work at all.

---

### Step 6: Check n8n Version Compatibility

Some n8n versions have SMTP bugs. Check version:
```bash
docker compose exec n8n n8n --version
```

**If using old version, update:**
```bash
docker compose pull n8n
docker compose up -d
```

---

### Step 7: Alternative: Use n8n Workflow to Send Email

If SMTP config isn't working, create an n8n workflow to send invitations:

1. **Create new workflow** in n8n
2. **Add "Send Email" node**
3. **Configure SMTP in node** (not environment variables)
4. **Test sending email**

---

## Common Issues & Fixes

### Issue: "Authentication failed"
**Fix:** 
- Verify app password is correct (16 chars, no spaces)
- Make sure 2FA is enabled on Gmail account
- Try regenerating app password

### Issue: "Connection timeout"
**Fix:**
- Check firewall allows port 587
- Verify network connectivity
- Try port 465 with `N8N_SMTP_SECURE=true`

### Issue: "SMTP not configured"
**Fix:**
- Verify env vars are in `docker-compose.yml`
- Recreate container: `docker compose down && docker compose up -d`
- Check logs for startup errors

### Issue: "Email sent but not received"
**Fix:**
- Check spam folder
- Verify sender email matches SMTP_USER
- Check Gmail account for blocked senders

---

## Quick Fix Commands

**On VPS:**
```bash
cd /opt/avallon-n8n

# Check SMTP vars
docker compose exec n8n env | grep SMTP

# Check logs
docker compose logs n8n | grep -i smtp | tail -20

# Recreate container (if vars missing)
docker compose down && docker compose up -d

# Restart n8n
docker compose restart n8n
```

---

## Next Steps

1. Run Step 1-3 above and share the output
2. Check if Gmail app password is correct
3. Try regenerating app password
4. If still not working, we'll test SMTP directly













