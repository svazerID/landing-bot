#!/bin/bash

# ============================================
# GitHub Push Tool
# Usage: ./push-github.sh <path> <username> <token> [repo-url]
# ============================================

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check arguments
if [ $# -lt 3 ]; then
    echo "Usage: $0 <path> <github-username> <github-token> [repo-url]"
    echo ""
    echo "Arguments:"
    echo "  path            - Directory path of the repository"
    echo "  github-username - Your GitHub username"
    echo "  github-token    - Your GitHub personal access token"
    echo "  repo-url        - (Optional) GitHub repo URL (default: https://github.com/<username>/<folder-name>.git)"
    echo ""
    echo "Examples:"
    echo "  $0 /storage/emulated/0/myproject myuser ghp_xxxxxxxxxxxx"
    echo "  $0 ./myproject myuser ghp_xxxxxxxxxxxx https://github.com/myuser/myrepo.git"
    exit 1
fi

REPO_PATH="$1"
GITHUB_USER="$2"
GITHUB_TOKEN="$3"
REPO_URL="${4:-}"

# Navigate to repository path
cd "$REPO_PATH" || { print_error "Cannot access directory: $REPO_PATH"; exit 1; }

print_info "Working directory: $(pwd)"

# Reset
print_info "Resetting repository..."
git reset --hard

# Configure Git
print_info "Configuring Git user..."
git config --global user.email "glamoursylofficial@gmail.com"
git config --global user.name "svazerID"

# Add current dir as safe
print_info "Adding safe directory..."
git config --global --add safe.directory "$(pwd)"

# Initialize if not already a git repo
if [ ! -d ".git" ]; then
    print_info "Initializing Git repository..."
    git init
fi

# Add all files
print_info "Staging files..."
git add *

# Commit
print_info "Committing changes..."
git commit -m "yayaya"

# Set branch to main
print_info "Setting branch to main..."
git branch -M main

# Add remote
if git remote get-url origin &>/dev/null; then
    print_warning "Remote 'origin' already exists. Removing..."
    git remote remove origin
fi

# Build repo URL if not provided
if [ -z "$REPO_URL" ]; then
    FOLDER_NAME=$(basename "$(pwd)")
    REPO_URL="https://github.com/${GITHUB_USER}/${FOLDER_NAME}.git"
fi

print_info "Adding remote origin: $REPO_URL"
# Use token-authenticated URL
AUTH_URL=$(echo "$REPO_URL" | sed "s|https://|https://${GITHUB_USER}:${GITHUB_TOKEN}@|")
git remote add origin "$AUTH_URL"

# Push
print_info "Pushing to GitHub..."
git push -u origin main --force

if [ $? -eq 0 ]; then
    print_success "Successfully pushed to GitHub!"
    echo ""
    print_info "Clean URL (without token): $REPO_URL"
else
    print_error "Push failed! Check your credentials and repository."
    exit 1
fi

# Helper commands info
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}  Additional Commands:${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "  git pull origin main --rebase   - Pull and rebase changes"
echo "  git push origin main            - Push to main branch"
echo "  git push origin main --force    - Force push to main"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
