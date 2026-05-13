import React, { useState } from "react";
import axios from "axios";

function AddLivestock() {

  const [form, setForm] = useState({
    name: "",
    breed: "",
    age: "",
    price: "",
    contact: "",
    owner: ""
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  // IMAGE UPLOAD

  const uploadImage = async () => {

    if (!image) return "";

    const data = new FormData();

    data.append("file", image);

    const res = await axios.post(
      "http://127.0.0.1:8000/upload",
      data
    );

    return `http://127.0.0.1:8000${res.data.path}`;
  };

  // ADD LIVESTOCK

  const addLivestock = async () => {

    try {

      const imageUrl = await uploadImage();

      const res = await axios.post(
        "http://127.0.0.1:8000/add_livestock",
        null,
        {
          params: {
            name: form.name,
            breed: form.breed,
            age: form.age,
            price: form.price,
            contact: form.contact,
            owner: form.owner,
            image: imageUrl
          }
        }
      );

      alert(res.data.message);

      window.location.href = "/livestock";

    } catch (err) {

      alert("Server error");

    }
  };

  return (
    <div
      style={{
        padding: "40px",
        background: "#f5f5f5",
        minHeight: "100vh"
      }}
    >

      <div
        style={{
          maxWidth: "400px",
          margin: "auto",
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)"
        }}
      >

        <h2>Add Livestock</h2>

        <input
          name="name"
          placeholder="Animal Name"
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="breed"
          placeholder="Breed"
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="age"
          placeholder="Age"
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="price"
          placeholder="Price"
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="contact"
          placeholder="Contact"
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="owner"
          placeholder="Owner"
          onChange={handleChange}
          style={inputStyle}
        />

        <label
  style={{
    display: "block",
    padding: "12px",
    background: "#ddd",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "15px",
    textAlign: "center"
  }}
>
  {image ? image.name : "📷 Upload Image"}

  <input
    type="file"
    hidden
    onChange={(e) => setImage(e.target.files[0])}
  />
</label>

        <button
          onClick={addLivestock}
          style={{
            width: "100%",
            padding: "12px",
            background: "green",
            color: "white",
            border: "none",
            borderRadius: "5px"
          }}
        >
          Add Livestock
        </button>

      </div>

    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px"
};

export default AddLivestock;