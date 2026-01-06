# Fix SMTP on VPS - Step by Step

## The Problem

Your test shows:
- ✅ Admin login works
- ✅ User found (iloveresolvio@gmail.com, pending)
- ❌ **Invitation sending fails** - SMTP not configured

## Solution: Configure SMTP on VPS

### Step 1: SSH Back into VPS

```bash
ssh root@159.89.113.242
```

### Step 2: Navigate to n8n Directory

```bash
cd /opt/avallon-n8n
```

### Step 3: Check if SMTP is Configured

```bash
grep -A 6 "N8N_SMTP_HOST" docker-compose.n8n.yml
```

**If you see SMTP settings:** Skip to Step 5 (just restart n8n)

**If you see nothing:** Continue to Step 4

### Step 4: Add SMTP Configuration

```bash
nano docker-compose.n8n.yml
```

Find this line:
```yaml
      - N8N_SECURE_COOKIE=true
```

Add these lines **right after** it:
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

Save: `Ctrl+X`, then `Y`, then `Enter`

### Step 5: Restart n8n

```bash
docker compose restart n8n
```

### Step 6: Check Logs

```bash
docker compose logs n8n | tail -30
```

Look for SMTP-related messages. If you see errors, share them.

### Step 7: Test Again (from local machine)

Exit VPS (`exit`), then on your local machine:

```bash
cd /Users/alijaffar/Documents/GitHub/Beta_Avallon/backend
node manually-send-invitation.js iloveresolvio@gmail.com
```

## Quick Commands Summary

**On VPS:**
```bash
cd /opt/avallon-n8n
grep N8N_SMTP docker-compose.n8n.yml  # Check if configured
nano docker-compose.n8n.yml           # Add SMTP if needed
docker compose restart n8n            # Restart
docker compose logs n8n | tail -30    # Check logs
```

**On Local Machine:**
```bash
cd /Users/alijaffar/Documents/GitHub/Beta_Avallon/backend
node manually-send-invitation.js iloveresolvio@gmail.com
```

## Expected Result

After configuring SMTP and restarting, the invitation should send successfully and the user will receive an email from `Hello@avallon.ca`!













