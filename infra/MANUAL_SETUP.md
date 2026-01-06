# Manual SSL Setup Instructions

Since automated SSH deployment isn't working, here are manual steps to set up Caddy SSL for n8n.

## Step 1: Add Your SSH Key to the VPS

SSH into your VPS and add your public key:

```bash
ssh root@159.89.113.242
# Enter your password when prompted

# Add your public key to authorized_keys
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFv/h6z4R0/dmtWk/GD3yf5Rgxny3CwD0gXtO1kT5ldR alijaffar@Alis-MacBook-Pro-2.local" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

## Step 2: Copy the Setup Script

From your local machine:

```bash
scp infra/setup-caddy-ssl.sh root@159.89.113.242:/tmp/
```

## Step 3: Run the Setup Script

SSH into your VPS and run:

```bash
ssh root@159.89.113.242
chmod +x /tmp/setup-caddy-ssl.sh
N8N_DOMAIN=n8n.avallon.ca LETSENCRYPT_EMAIL=admin@avallon.ca /tmp/setup-caddy-ssl.sh
```

## Alternative: Run Setup Directly on VPS

If you prefer, you can copy the script content and paste it directly on the VPS:

1. SSH into your VPS: `ssh root@159.89.113.242`
2. Create the script: `nano /tmp/setup-caddy-ssl.sh`
3. Paste the script content (from `infra/setup-caddy-ssl.sh`)
4. Save and run: `chmod +x /tmp/setup-caddy-ssl.sh && N8N_DOMAIN=n8n.avallon.ca LETSENCRYPT_EMAIL=admin@avallon.ca /tmp/setup-caddy-ssl.sh`

