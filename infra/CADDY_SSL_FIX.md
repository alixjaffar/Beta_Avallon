# Caddy SSL Certificate Fix Guide

## Current Issue

Caddy is failing to obtain an SSL certificate for `agents.avallon.ca` with the error:
```
challenge failed - connection error
```

This means Let's Encrypt cannot connect to your server to validate the domain.

## Most Likely Causes

1. **Cloud Provider Firewall** (90% of cases)
   - Port 80 must be accessible from the internet for HTTP-01 validation
   - Check your cloud provider's firewall/security group settings

2. **DNS Not Configured**
   - `agents.avallon.ca` must point to `159.89.113.242`

3. **Local Firewall (UFW)**
   - Ports 80 and 443 must be allowed

## Quick Fix Steps

### Option 1: Automated Fix (Recommended)

```bash
# From your local machine
scp infra/diagnose-caddy-ssl.sh root@159.89.113.242:/tmp/
scp infra/fix-caddy-ssl.sh root@159.89.113.242:/tmp/

# SSH into server
ssh root@159.89.113.242

# Run diagnostic first
chmod +x /tmp/diagnose-caddy-ssl.sh
/tmp/diagnose-caddy-ssl.sh

# If issues found, run fix script
chmod +x /tmp/fix-caddy-ssl.sh
/tmp/fix-caddy-ssl.sh
```

### Option 2: Manual Fix

#### Step 1: Verify DNS
```bash
dig agents.avallon.ca
# Should return: 159.89.113.242
```

If not, update your DNS A record to point to `159.89.113.242`.

#### Step 2: Check Cloud Provider Firewall

**DigitalOcean:**
1. Go to Networking → Firewalls
2. Create/Edit firewall for your droplet
3. Add inbound rules:
   - HTTP (port 80) from 0.0.0.0/0
   - HTTPS (port 443) from 0.0.0.0/0

**AWS:**
1. Go to EC2 → Security Groups
2. Select your instance's security group
3. Add inbound rules:
   - Type: HTTP, Port: 80, Source: 0.0.0.0/0
   - Type: HTTPS, Port: 443, Source: 0.0.0.0/0

**GCP:**
1. Go to VPC Network → Firewall Rules
2. Create rule:
   - Name: allow-http-https
   - Direction: Ingress
   - Action: Allow
   - Targets: All instances
   - Source IP ranges: 0.0.0.0/0
   - Protocols/ports: tcp:80,443

**Azure:**
1. Go to Network Security Groups
2. Add inbound security rules for ports 80 and 443

#### Step 3: Verify Local Firewall
```bash
ufw status
ufw allow 80/tcp
ufw allow 443/tcp
```

#### Step 4: Test External Access
```bash
# From your local machine (not the server)
curl -I http://159.89.113.242
# Should return HTTP 200 or similar, not connection refused
```

#### Step 5: Restart Caddy
```bash
systemctl restart caddy
journalctl -u caddy -f
# Watch for certificate acquisition
```

## Verification

After fixing, verify SSL certificate:

```bash
# Check Caddy status
systemctl status caddy

# Test HTTPS
curl -I https://agents.avallon.ca

# Check certificate
echo | openssl s_client -servername agents.avallon.ca -connect agents.avallon.ca:443 2>/dev/null | openssl x509 -noout -dates
```

## Still Not Working?

1. **Check Caddy logs**:
   ```bash
   journalctl -u caddy -n 100 --no-pager
   ```

2. **Verify DNS propagation**:
   ```bash
   dig agents.avallon.ca @8.8.8.8
   ```

3. **Test port accessibility**:
   ```bash
   # From external network (not the server)
   telnet 159.89.113.242 80
   # Should connect, not timeout
   ```

4. **Use staging environment for testing**:
   - Run fix script and choose "yes" when asked about staging
   - This helps identify issues without hitting rate limits

## Expected Timeline

- DNS propagation: 5-60 minutes (usually instant)
- Firewall changes: Immediate
- SSL certificate: 30-60 seconds after all issues resolved
- Full HTTPS access: 1-2 minutes after certificate issued
















