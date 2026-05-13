from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os
import shutil

app = FastAPI()
UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.mount("/uploads", StaticFiles(directory=UPLOAD_FOLDER), name="uploads")


# ---------------- CORS ----------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- PATHS ----------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_PATH = os.path.join(BASE_DIR, "..", "data", "livestock.csv")
USER_PATH = os.path.join(BASE_DIR, "..", "data", "users.csv")
UPLOAD_FOLDER = os.path.join(BASE_DIR, "..", "uploads")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ---------------- INIT FILES ----------------

if not os.path.exists(DATA_PATH):
    pd.DataFrame(columns=[
        "Name",
        "Breed",
        "Age",
        "Price",
        "Contact",
        "Owner",
        "Image"
    ]).to_csv(DATA_PATH, index=False)

if not os.path.exists(USER_PATH):
    pd.DataFrame(columns=[
        "Username",
        "Password"
    ]).to_csv(USER_PATH, index=False)

# ---------------- HOME ----------------

@app.get("/")
def home():
    return {"message": "Backend running successfully"}

# ---------------- SIGNUP ----------------

@app.post("/signup")
def signup(username: str, password: str):

    users = pd.read_csv(USER_PATH)

    existing = users[users["Username"] == username]

    if not existing.empty:
        return {"message": "User already exists"}

    new_user = pd.DataFrame([{
        "Username": username,
        "Password": password
    }])

    users = pd.concat([users, new_user], ignore_index=True)

    users.to_csv(USER_PATH, index=False)

    return {"message": "Signup successful"}

# ---------------- LOGIN ----------------

@app.post("/login")
def login(username: str, password: str):

    users = pd.read_csv(USER_PATH)

    user = users[
        (users["Username"] == username) &
        (users["Password"] == password)
    ]

    if user.empty:
        return {"message": "Invalid credentials"}

    return {"message": "Login successful"}

# ---------------- ADD LIVESTOCK ----------------

@app.post("/add_livestock")
def add_livestock(
    name: str,
    breed: str,
    age: int,
    price: int,
    contact: str,
    owner: str,
    image: str = ""
):

    livestock = pd.read_csv(DATA_PATH)

    new_item = pd.DataFrame([{
        "Name": name,
        "Breed": breed,
        "Age": age,
        "Price": price,
        "Contact": contact,
        "Owner": owner,
        "Image": image
    }])

    livestock = pd.concat([livestock, new_item], ignore_index=True)

    livestock.to_csv(DATA_PATH, index=False)

    return {"message": "Livestock added successfully"}

# ---------------- GET LIVESTOCK ----------------

@app.get("/livestock")
def get_livestock():

    try:

        livestock = pd.read_csv(DATA_PATH)

        livestock = livestock.fillna("")

        return livestock.to_dict(orient="records")

    except Exception as e:

        return {"error": str(e)}

# ---------------- DELETE LIVESTOCK ----------------

@app.delete("/delete_livestock/{item_id}")
def delete_livestock(item_id: int):

    livestock = pd.read_csv(DATA_PATH)

    livestock = livestock.drop(item_id).reset_index(drop=True)

    livestock.to_csv(DATA_PATH, index=False)

    return {"message": "Deleted successfully"}

# ---------------- IMAGE UPLOAD ----------------

@app.post("/upload")
def upload(file: UploadFile = File(...)):

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "filename": file.filename,
        "filename": file.filename,
"path": f"https://livestock-backend-x7k6.onrender.com/uploads/{file.filename}"
    }