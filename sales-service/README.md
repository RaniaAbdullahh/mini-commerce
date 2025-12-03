# Sales Service

## Project Overview
This is the backend service for managing orders in the e-commerce platform. It handles creating orders, storing order items, calculating totals and taxes, and retrieving orders by ID.

**Technologies used:**  
- Python 3.11+  
- FastAPI  
- Uvicorn (ASGI server)  
- SQLAlchemy (ORM)  
- Alembic (DB migrations)  
- PostgreSQL (`psycopg2-binary`)  
- Pydantic (data validation)  
- python-dotenv (environment variables)  
- Requests (for external API calls)

---

## Features
- Create orders with multiple items, quantity, price, subtotal, and tax  
- Retrieve order by ID  
- Return detailed items in the order  


---

## Setup Instructions

### 1. Clone the repository
```bash
git clone <sales-service-repo-url>
cd sales-service
```

### 2. Create a virtual environment
```bash
# Linux / macOS
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment variables

Create a .env file in the root directory:
```bash
DATABASE_URL=
PORT=
```
### 5. Database Setup

```bash
#Initialize Alembic (if not already initialized):

alembic init alembic


#Run migrations:

alembic upgrade head
```
### 5. Running the Service
```bash 
uvicorn main:app --reload --host 0.0.0.0 --port 9000
```