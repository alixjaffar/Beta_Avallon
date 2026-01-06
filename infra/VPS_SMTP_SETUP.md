# Configure SMTP on VPS - Step by Step

## What to Do on Your VPS

You're already SSH'd into your VPS (`root@Avallon:/opt/avallon-n8n`). Here's what to do:

### Step 1: Edit docker-compose file

```bash
nano docker-compose.n8n.yml
```

### Step 2: Find and Add SMTP Configuration

Look for this line:
```yaml
      - N8N_SECURE_COOKIE=true
```

Add these lines **right after** that line:

```yaml
      # SMTP Configuration for sending invitation emails
      # Using Hello@avallon.ca (Google Workspace) via Gmail SMTP
      - N8N_EMAIL_MODE=smtp
      - N8N_SMTP_HOST=smtp.gmail.com
      - N8N_SMTP_PORT=587
      - N8N_SMTP_USER=Hello@avallon.ca
      - N8N_SMTP_PASS=oagqtgpxwcldyibn
      - N8N_SMTP_SENDER=Hello@avallon.ca
      - N8N_SMTP_SECURE=false
```

### Step 3: Save and Exit

- Press `Ctrl+X`
- Press `Y` (to confirm)
- Press `Enter` (to save)

### Step 4: Restart n8n

```bash
docker compose restart n8n
```

### Step 5: Check Logs

```bash
docker compose logs n8n | tail -30
```

Look for any errors. If you see "SMTP" or "email" related errors, let me know!

---

## What to Do on Your Local Machine

The test scripts (`test-n8n-invitation.js`) are meant to run **locally**, not on the VPS.

**On your local machine** (in a new terminal):

```bash
cd /Users/alijaffar/Documents/GitHub/Beta_Avallon/backend
node test-n8n-invitation.js
```

This will test the connection from your local machine to n8n.

---

## Quick Reference

**On VPS:**
- ✅ Edit `docker-compose.n8n.yml`
- ✅ Add SMTP configuration
- ✅ Restart n8n: `docker compose restart n8n`

**On Local Machine:**
- ✅ Run test scripts
- ✅ Test invitation sending
- ✅ Verify everything works

---

## After Configuring SMTP

Once SMTP is configured on the VPS:

1. **Test locally:**
   ```bash
   cd backend
   node manually-send-invitation.js user@example.com
   ```

2. **Or create a new user** in Avallon frontend - they should receive invitation email!













