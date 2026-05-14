import os
import shutil
import pandas as pd

import cloudinary
import cloudinary.uploader

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles


# ---------------- CLOUDINARY CONFIG ----------------
cloudinary.config(
    cloud_name=os.getenv("dwraiuxjj", ""),
    api_key=os.getenv("588174946831383", ""),
    api_secret=os.getenv("fatOe8qWlLhbSdn16RUjG4dh_zY", "")
)

# ---------------- APP INIT ----------------
app = FastAPI()

# ---------------- BASE PATHS ----------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_DIR = os.path.join(BASE_DIR, "..", "data")
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

DATA_PATH = os.path.join(DATA_DIR, "livestock.csv")
USER_PATH = os.path.join(DATA_DIR, "users.csv")

# ---------------- STATIC FILES ----------------
app.mount("/uploads", StaticFiles(directory=UPLOAD_FOLDER), name="uploads")

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- INIT CSV FILES ----------------
if not os.path.exists(DATA_PATH):
    pd.DataFrame(columns=[
        "Name", "Breed", "Age", "Price", "Contact", "Owner", "Image"
    ]).to_csv(DATA_PATH, index=False)

if not os.path.exists(USER_PATH):
    pd.DataFrame(columns=[
        "Username", "Password"
    ]).to_csv(USER_PATH, index=False)


# ---------------- HOME ----------------
@app.get("/")
def home():
    return {"message": "Backend running successfully"}


# ---------------- SIGNUP ----------------
@app.post("/signup")
def signup(username: str, password: str):

    users = pd.read_csv(USER_PATH)

    if (users["Username"] == username).any():
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

    livestock = pd.read_csv(DATA_PATH).fillna("")
    return livestock.to_dict(orient="records")


# ---------------- DELETE LIVESTOCK ----------------
@app.delete("/delete_livestock/{item_id}")
def delete_livestock(item_id: int):

    livestock = pd.read_csv(DATA_PATH)

    if item_id < 0 or item_id >= len(livestock):
        return {"error": "Invalid item ID"}

    livestock = livestock.drop(item_id).reset_index(drop=True)
    livestock.to_csv(DATA_PATH, index=False)

    return {"message": "Deleted successfully"}


# ---------------- IMAGE UPLOAD ----------------
@app.post("/upload")
def upload(file: UploadFile = File(...)):

    result = cloudinary.uploader.upload(file.file)

    return {
        "filename": file.filename,
        "path": result["secure_url"]
    }