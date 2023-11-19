# Build frontend
cd client
npm ci
npm run build

# Build backend
cd ../server
npm ci
npm run build
