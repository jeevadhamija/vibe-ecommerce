# Vibe - ecommerce website

This archive contains two folders:
- server/ — Express + Mongoose backend. On start, seeds initial products into MongoDB if none exist.
- client/ — React (Vite) frontend 

## Quick start

1. Ensure MongoDB is running locally (mongod).
2. Start server:
   cd server
   npm install
   npm start

3. Start client:
   cd client
   npm install
   npm run dev

Frontend expects the backend at http://localhost:5000 by default (client/.env).
<img width="952" height="498" alt="1" src="https://github.com/user-attachments/assets/af1dd105-543a-4bd2-b9ba-d5667a4df914" />
