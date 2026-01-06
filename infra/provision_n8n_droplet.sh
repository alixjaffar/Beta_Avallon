#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Avallon n8n Droplet Provisioning Script ===${NC}"

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${RED}Error: jq is required but not installed.${NC}"
    echo "Please install jq: brew install jq (macOS) or apt-get install jq (Ubuntu)"
    exit 1
fi

# Load environment variables from .env.infra
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$PROJECT_ROOT/.env.infra"

if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}Error: .env.infra file not found at $ENV_FILE${NC}"
    echo "Please copy .env.infra.example to .env.infra and fill in your values."
    exit 1
fi

echo -e "${GREEN}Loading environment variables from .env.infra...${NC}"
source "$ENV_FILE"

# Validate required variables
REQUIRED_VARS=(
    "DIGITALOCEAN_API_TOKEN"
    "SSH_KEY_NAME"
    "SSH_PUBLIC_KEY_PATH"
    "N8N_DROPLET_NAME"
    "N8N_DROPLET_REGION"
    "N8N_DROPLET_SIZE"
    "N8N_DOMAIN"
    "LETSENCRYPT_EMAIL"
)

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo -e "${RED}Error: Required variable $var is not set in .env.infra${NC}"
        exit 1
    fi
done

# Expand SSH_PUBLIC_KEY_PATH if it contains $HOME
SSH_PUBLIC_KEY_PATH=$(eval echo "$SSH_PUBLIC_KEY_PATH")

if [ ! -f "$SSH_PUBLIC_KEY_PATH" ]; then
    echo -e "${RED}Error: SSH public key not found at $SSH_PUBLIC_KEY_PATH${NC}"
    exit 1
fi

echo -e "${GREEN}SSH public key found at: $SSH_PUBLIC_KEY_PATH${NC}"

# Read SSH public key content
SSH_PUBLIC_KEY=$(cat "$SSH_PUBLIC_KEY_PATH")

# DigitalOcean API base URL
DO_API_URL="https://api.digitalocean.com/v2"

# Function to make DO API calls
do_api_call() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    if [ -z "$data" ]; then
        curl -s -X "$method" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $DIGITALOCEAN_API_TOKEN" \
            "$DO_API_URL$endpoint"
    else
        curl -s -X "$method" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $DIGITALOCEAN_API_TOKEN" \
            -d "$data" \
            "$DO_API_URL$endpoint"
    fi
}

# Step 1: Check if SSH key exists, create if not
echo -e "${YELLOW}Step 1: Checking SSH key in DigitalOcean...${NC}"
SSH_KEYS_RESPONSE=$(do_api_call "GET" "/account/keys")
SSH_KEY_ID=$(echo "$SSH_KEYS_RESPONSE" | jq -r ".ssh_keys[] | select(.name == \"$SSH_KEY_NAME\") | .id")

if [ -z "$SSH_KEY_ID" ] || [ "$SSH_KEY_ID" == "null" ]; then
    echo -e "${YELLOW}SSH key '$SSH_KEY_NAME' not found. Creating...${NC}"
    CREATE_KEY_DATA=$(jq -n \
        --arg name "$SSH_KEY_NAME" \
        --arg public_key "$SSH_PUBLIC_KEY" \
        '{name: $name, public_key: $public_key}')
    
    CREATE_RESPONSE=$(do_api_call "POST" "/account/keys" "$CREATE_KEY_DATA")
    SSH_KEY_ID=$(echo "$CREATE_RESPONSE" | jq -r '.ssh_key.id')
    
    if [ -z "$SSH_KEY_ID" ] || [ "$SSH_KEY_ID" == "null" ]; then
        echo -e "${RED}Error: Failed to create SSH key${NC}"
        echo "$CREATE_RESPONSE" | jq '.'
        exit 1
    fi
    echo -e "${GREEN}SSH key created with ID: $SSH_KEY_ID${NC}"
else
    echo -e "${GREEN}SSH key found with ID: $SSH_KEY_ID${NC}"
fi

# Step 2: Check if droplet already exists
echo -e "${YELLOW}Step 2: Checking for existing droplet...${NC}"
DROPLETS_RESPONSE=$(do_api_call "GET" "/droplets")
EXISTING_DROPLET=$(echo "$DROPLETS_RESPONSE" | jq -r ".droplets[] | select(.name == \"$N8N_DROPLET_NAME\") | .id")

if [ -n "$EXISTING_DROPLET" ] && [ "$EXISTING_DROPLET" != "null" ]; then
    echo -e "${YELLOW}Droplet '$N8N_DROPLET_NAME' already exists with ID: $EXISTING_DROPLET${NC}"
    echo -e "${YELLOW}Fetching droplet details...${NC}"
    DROPLET_DETAILS=$(do_api_call "GET" "/droplets/$EXISTING_DROPLET")
    DROPLET_IP=$(echo "$DROPLET_DETAILS" | jq -r '.droplet.networks.v4[] | select(.type == "public") | .ip_address')
    
    if [ -z "$DROPLET_IP" ] || [ "$DROPLET_IP" == "null" ]; then
        echo -e "${RED}Error: Droplet exists but has no public IP yet. Please wait and try again.${NC}"
        exit 1
    fi
    echo -e "${GREEN}Using existing droplet with IP: $DROPLET_IP${NC}"
else
    # Step 3: Create droplet
    echo -e "${YELLOW}Step 3: Creating droplet...${NC}"
    DROPLET_DATA=$(jq -n \
        --arg name "$N8N_DROPLET_NAME" \
        --arg region "$N8N_DROPLET_REGION" \
        --arg size "$N8N_DROPLET_SIZE" \
        --arg ssh_key_id "$SSH_KEY_ID" \
        '{
            name: $name,
            region: $region,
            size: $size,
            image: "ubuntu-22-04-x64",
            ssh_keys: [$ssh_key_id],
            tags: ["avallon", "n8n"]
        }')
    
    CREATE_DROPLET_RESPONSE=$(do_api_call "POST" "/droplets" "$DROPLET_DATA")
    DROPLET_ID=$(echo "$CREATE_DROPLET_RESPONSE" | jq -r '.droplet.id')
    
    if [ -z "$DROPLET_ID" ] || [ "$DROPLET_ID" == "null" ]; then
        echo -e "${RED}Error: Failed to create droplet${NC}"
        echo "$CREATE_DROPLET_RESPONSE" | jq '.'
        exit 1
    fi
    
    echo -e "${GREEN}Droplet created with ID: $DROPLET_ID${NC}"
    
    # Step 4: Wait for droplet to be active and get IP
    echo -e "${YELLOW}Step 4: Waiting for droplet to be active...${NC}"
    DROPLET_IP=""
    MAX_WAIT=300  # 5 minutes
    ELAPSED=0
    
    while [ -z "$DROPLET_IP" ] || [ "$DROPLET_IP" == "null" ]; do
        if [ $ELAPSED -ge $MAX_WAIT ]; then
            echo -e "${RED}Error: Timeout waiting for droplet IP address${NC}"
            exit 1
        fi
        
        sleep 10
        ELAPSED=$((ELAPSED + 10))
        DROPLET_DETAILS=$(do_api_call "GET" "/droplets/$DROPLET_ID")
        DROPLET_STATUS=$(echo "$DROPLET_DETAILS" | jq -r '.droplet.status')
        DROPLET_IP=$(echo "$DROPLET_DETAILS" | jq -r '.droplet.networks.v4[] | select(.type == "public") | .ip_address')
        
        echo -e "${YELLOW}Status: $DROPLET_STATUS, IP: ${DROPLET_IP:-"not yet assigned"}${NC}"
    done
    
    echo -e "${GREEN}Droplet is active with IP: $DROPLET_IP${NC}"
fi

# Step 5: Wait for SSH to be ready
echo -e "${YELLOW}Step 5: Waiting for SSH to be ready...${NC}"
SSH_READY=false
MAX_SSH_WAIT=120  # 2 minutes
SSH_ELAPSED=0

while [ "$SSH_READY" = false ]; do
    if [ $SSH_ELAPSED -ge $MAX_SSH_WAIT ]; then
        echo -e "${RED}Error: Timeout waiting for SSH to be ready${NC}"
        exit 1
    fi
    
    if ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no root@"$DROPLET_IP" "echo 'SSH ready'" &>/dev/null; then
        SSH_READY=true
    else
        sleep 5
        SSH_ELAPSED=$((SSH_ELAPSED + 5))
        echo -e "${YELLOW}Waiting for SSH... (${SSH_ELAPSED}s)${NC}"
    fi
done

echo -e "${GREEN}SSH is ready!${NC}"

# Step 6: Set up the server
echo -e "${YELLOW}Step 6: Setting up server...${NC}"

# Read docker-compose template
DOCKER_COMPOSE_TEMPLATE="$SCRIPT_DIR/docker-compose.n8n.yml"
if [ ! -f "$DOCKER_COMPOSE_TEMPLATE" ]; then
    echo -e "${RED}Error: docker-compose.n8n.yml not found at $DOCKER_COMPOSE_TEMPLATE${NC}"
    exit 1
fi

# Create setup script to run on remote server
SETUP_SCRIPT=$(cat <<EOF
set -e
echo "Updating and upgrading packages..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get upgrade -y -qq

echo "Installing curl, git, and ufw..."
apt-get install -y -qq curl git ufw

echo "Installing Docker..."
curl -fsSL https://get.docker.com -o /tmp/get-docker.sh
sh /tmp/get-docker.sh

echo "Installing Docker Compose plugin..."
apt-get install -y -qq docker-compose-plugin

echo "Configuring firewall..."
ufw --force enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp

echo "Creating n8n directory..."
mkdir -p /opt/avallon-n8n
cd /opt/avallon-n8n

echo "Creating docker-compose.yml..."
cat > docker-compose.yml <<'DOCKER_COMPOSE_EOF'
$(cat "$DOCKER_COMPOSE_TEMPLATE")
DOCKER_COMPOSE_EOF

# Generate a secure admin password for n8n
N8N_ADMIN_PASSWORD=\$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)

# Replace environment variables in docker-compose.yml
sed -i "s|\\\${N8N_DOMAIN}|$N8N_DOMAIN|g" docker-compose.yml
sed -i "s|\\\${LETSENCRYPT_EMAIL}|$LETSENCRYPT_EMAIL|g" docker-compose.yml
sed -i "s|\\\${N8N_ADMIN_PASSWORD:-changeme}|$N8N_ADMIN_PASSWORD|g" docker-compose.yml

# Save the admin password to a secure file
echo "N8N_ADMIN_PASSWORD=$N8N_ADMIN_PASSWORD" > /opt/avallon-n8n/.env.secrets
chmod 600 /opt/avallon-n8n/.env.secrets
echo ""
echo "=========================================="
echo "n8n Admin Credentials:"
echo "Username: admin"
echo "Password: $N8N_ADMIN_PASSWORD"
echo "=========================================="
echo "Password also saved to /opt/avallon-n8n/.env.secrets"

echo "Starting services with Docker Compose..."
docker compose up -d

echo "Setup complete!"
EOF
)

# Execute setup script on remote server
echo -e "${YELLOW}Executing setup script on remote server...${NC}"
ssh -o StrictHostKeyChecking=no root@"$DROPLET_IP" "$SETUP_SCRIPT"

echo -e "${GREEN}=== Provisioning Complete! ===${NC}"
echo -e "${GREEN}Droplet IP: $DROPLET_IP${NC}"
echo -e "${GREEN}n8n will be available at: https://$N8N_DOMAIN${NC}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Before SSL will work, you must:${NC}"
echo -e "${YELLOW}   1. Create an A record in your DNS provider${NC}"
echo -e "${YELLOW}   2. Point $N8N_DOMAIN to $DROPLET_IP${NC}"
echo -e "${YELLOW}   3. Wait for DNS propagation (usually 5-15 minutes)${NC}"
echo ""
echo -e "${GREEN}You can SSH into the server with:${NC}"
echo -e "${GREEN}   ssh root@$DROPLET_IP${NC}"

