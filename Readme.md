This is a real-time auction web application built with Laravel (PHP) for the backend and React for the frontend. Users can place bids in real time and see updates stream live, without refreshing the page.

⚡ Real-Time Technology
We used Server-Sent Events (SSE) to stream real-time data from the Laravel backend to the React frontend.

✅ Why SSE?
Simple to implement in Laravel with response()->stream() — no extra WebSocket server needed.

Lightweight for unidirectional communication (server → client), perfect for real-time updates like bid changes or countdowns.

Auto-reconnect built into the browser via EventSource.

Less setup overhead than WebSockets for this use case.

🛠️ How to Run Locally
🔧 Requirements
PHP 8+

Composer

Node.js + npm

Redis

Laravel

MySQL or SQLite

📦 Setup Instructions
Clone the repo

clone repo 
cd auction-app
Backend (Laravel API)


cd backend
cp .env.example .env
php artisan key:generate
composer install
php artisan migrate
php artisan serve


Frontend (React)

bash
Copy
Edit
cd ../frontend
npm install
npm run dev