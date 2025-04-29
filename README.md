#  Game Collection Website

A simple web application where users can browse and play a collection of mini-games.  
Built using **React (frontend)** and **FastAPI (backend)**.

---

##  Project Structure
/game-website
│
├── backend/  （Python FastAPI backend）
│    ├── main.py   # API
│    ├── models.py # Database Model（Games、Scores）
│    ├── database.py # Database connection
│    └── routers/
│         └── games.py # Games API
│         └── scores.py # Scores API
│
├── frontend/  （React frontend）
│    ├── public/
│    ├── src/
│        ├── App.js
│        ├── components/
│            └── GameList.js
│            └── GamePage.js
│            └── ScoreBoard.js
│        ├── games/   # Game folders
│            └── skiing/ （Skiing Game）
│            └── jump/ （Jumping Game）
│
└── README.md

---

##  Features

- View a list of available games
- Play simple front-end games (e.g. skiing, jumping)
- Submit and track high scores (planned)
- Add new games easily

---

##  Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/game-website.git
cd game-website
```

### 2. Backend Setup (Python + FastAPI)
```bash
cd backend
python -m venv venv
# Activate venv:
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install fastapi uvicorn

# Run the backend server
uvicorn main:app --reload
```
## API will be available at: http://localhost:8000/games

### 3. Frontend Setup (React)
```bash
cd ../frontend
npm install
npm start
```
## React app will be running at: http://localhost:3000
