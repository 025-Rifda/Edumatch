# AI Major Recommendation System

This project now contains:

- A React frontend in `src/`
- A Flask backend in `app.py`, `models/`, `routes/`, and `services/`

The original design source is available at:
https://www.figma.com/design/fNuWxterheHbLtxxSkXeeI/AI-Major-Recommendation-System

## Frontend

Install and run the Vite app:

```bash
npm i
npm run dev
```

## Backend

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Run the Flask API:

```bash
python app.py
```

The backend uses:

- Flask
- Flask-CORS
- SQLite (`data/edumatch.db` is created automatically)

## Clean Architecture

```text
app.py
models/
routes/
services/
```

## Available APIs

- `POST /register`
- `POST /login`
- `POST /recommend`
- `GET /history?user_id=<id>`
- `POST /admin/major`
- `PUT /admin/major`
- `DELETE /admin/major`

## Request and Response Examples

### `POST /register`

Request:

```json
{
  "name": "Budi Santoso",
  "email": "budi@email.com",
  "password": "rahasia123"
}
```

Response:

```json
{
  "message": "Registration successful.",
  "user": {
    "id": 2,
    "name": "Budi Santoso",
    "email": "budi@email.com",
    "is_admin": false
  }
}
```

### `POST /login`

Request:

```json
{
  "email": "admin@gmail.com",
  "password": "123"
}
```

Response:

```json
{
  "message": "Login successful.",
  "user": {
    "id": 1,
    "name": "Admin EduMatch",
    "email": "admin@gmail.com",
    "is_admin": true
  }
}
```

### `POST /recommend`

Request:

```json
{
  "user_id": 2,
  "academic_scores": {
    "matematika": 90,
    "indonesia": 84,
    "inggris": 88,
    "fisika": 86,
    "kimia": 82,
    "biologi": 78
  },
  "interest_answers": [5, 5, 3, 3, 2, 2, 2, 3, 2, 3, 5, 5, 3, 4, 5, 4, 2, 4, 3, 5],
  "budget": 5000000
}
```

Response:

```json
{
  "top3": [
    {
      "id": 3,
      "name": "Ilmu Komputer",
      "match": 92.3,
      "min_score": 80.0,
      "ukt": 4300000,
      "academic_score": 91.6,
      "interest_score": 94.0,
      "budget_score": 92.0,
      "within_budget": true,
      "reasons": [
        "Skor akademik 91.6 dengan rata-rata nilai 84.7.",
        "Skor minat fuzzy 94.0; kategori terkuat ada pada technology dan cocok untuk rumpun technology.",
        "UKT Rp 4,300,000 masih berada dalam budget Rp 5,000,000."
      ]
    }
  ],
  "top10": []
}
```

### `GET /history?user_id=2`

Response:

```json
{
  "user": {
    "id": 2,
    "name": "Budi Santoso",
    "email": "budi@email.com"
  },
  "history": [
    {
      "id": 1,
      "user_id": 2,
      "created_at": "2026-04-14 10:15:00",
      "top_major": {
        "id": 3,
        "name": "Ilmu Komputer",
        "match": 92.3
      },
      "top3": [],
      "top10": []
    }
  ]
}
```

### `POST /admin/major`

Request:

```json
{
  "name": "Arsitektur",
  "min_score": 79,
  "ukt": 4800000
}
```

### `PUT /admin/major`

Request:

```json
{
  "id": 5,
  "name": "Teknik Elektro",
  "min_score": 83,
  "ukt": 4900000
}
```

### `DELETE /admin/major`

Request:

```json
{
  "id": 5
}
```

## Notes

- Passwords are stored as hashed values using Werkzeug.
- `admin@gmail.com` / `123` is seeded automatically for admin login.
- Recommendation logic combines:
  - Academic rule-based decision tree
  - Interest fuzzy scoring
  - UKT budget filtering
