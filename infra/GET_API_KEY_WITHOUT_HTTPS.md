# Getting n8n API Key Without HTTPS Access

Since `https://agents.avallon.ca` is not accessible due to cloud firewall issues, here's how to get the API key directly from the VPS.

## Option 1: Access via SSH Tunnel (Recommended)

Create an SSH tunnel to access n8n locally:

```bash
# On your local machine, create SSH tunnel
ssh -L 8080:127.0.0.1:5678 root@159.89.113.242

# Keep this terminal open, then in another terminal or browser:
# Open: http://localhost:8080
```

Then:
1. Open `http://localhost:8080` in your browser
2. Log in to n8n
3. Go to Settings → API
4. Create API key
5. Copy the key

## Option 2: Get API Key via Command Line

If you can't access the UI, you can create an API key via n8n's API (if you have initial access):

```bash
# SSH into your VPS
ssh root@159.89.113.242

# Access n8n container
cd /opt/avallon-n8n
docker compose exec n8n sh

# Note: n8n doesn't have a CLI command to create API keys
# You'll need to access the UI or use the API with existing credentials
```

## Option 3: Fix Cloud Firewall First

The root cause is likely your cloud provider's firewall blocking ports 80/443.

### DigitalOcean:
1. Go to: https://cloud.digitalocean.com/networking/firewalls
2. Create/edit firewall for your droplet
3. Add inbound rules:
   - **HTTP** (TCP port 80) from `0.0.0.0/0`
   - **HTTPS** (TCP port 443) from `0.0.0.0/0`

### AWS EC2:
1. Go to: EC2 → Security Groups
2. Select your instance's security group
3. Add inbound rules:
   - **HTTP** (TCP port 80) from `0.0.0.0/0`
   - **HTTPS** (TCP port 443) from `0.0.0.0/0`

### Other Providers:
- **Linode**: Networking → Firewalls
- **Azure**: Network Security Groups
- **Google Cloud**: VPC Firewall Rules

After configuring the firewall, wait 1-2 minutes, then try accessing `https://agents.avallon.ca` again.

## Option 4: Temporary HTTP Access (Not Recommended)

If you need immediate access and can't configure the firewall right now:

1. **Temporarily allow HTTP access** (less secure):
   ```bash
   ssh root@159.89.113.242
   # Modify Caddyfile to allow HTTP temporarily
   # Or access n8n directly on port 5678 via SSH tunnel
   ```

2. **Use SSH tunnel** (safer):
   ```bash
   ssh -L 8080:127.0.0.1:5678 root@159.89.113.242
   # Then access http://localhost:8080
   ```

## Recommended Approach

1. **Fix cloud firewall** (best long-term solution)
2. **Use SSH tunnel** to get API key immediately
3. **Configure backend** with the API key
4. **Test integration** once HTTPS is working

## Quick SSH Tunnel Setup

```bash
# Terminal 1: Create tunnel
ssh -L 8080:127.0.0.1:5678 root@159.89.113.242

# Terminal 2: Access n8n
open http://localhost:8080
# or
curl http://localhost:8080
```

Then follow the normal steps:
1. Log in to n8n
2. Settings → API
3. Create API Key
4. Copy and configure in backend
















