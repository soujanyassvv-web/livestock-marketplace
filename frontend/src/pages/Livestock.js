import React, { useEffect, useState } from "react";
import axios from "axios";

function Livestock() {
  const [livestock, setLivestock] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");

  // FETCH
  const fetchLivestock = async () => {
    try {
      const res = await axios.get(
        "https://livestock-backend-x7k6.onrender.com/livestock"
      );
      setLivestock(res.data);
    } catch (err) {
      alert("Error loading livestock");
    }
  };

  useEffect(() => {
    fetchLivestock();
  }, []);

  // DELETE
  const deleteLivestock = async (index) => {
    try {
      await axios.delete(
        `https://livestock-backend-x7k6.onrender.com/delete_livestock/${index}`
      );
      fetchLivestock();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // FAVORITES
  const toggleFavorite = (index) => {
    if (favorites.includes(index)) {
      setFavorites(favorites.filter((fav) => fav !== index));
    } else {
      setFavorites([...favorites, index]);
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  // SEARCH FILTER
  const filteredLivestock = livestock.filter(
    (item) =>
      item.Name?.toLowerCase().includes(search.toLowerCase()) ||
      item.Breed?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        padding: "20px",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h1>🐄 Livestock Marketplace</h1>

        <div>
          <button
            onClick={() => (window.location.href = "/add")}
            style={{
              marginRight: "10px",
              padding: "10px",
              background: "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            + Add Livestock
          </button>

          <button
            onClick={logout}
            style={{
              padding: "10px",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search by name or breed..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "20px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />

      {/* CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
          gap: "20px",
        }}
      >
        {filteredLivestock.map((item, index) => {
          console.log(item.Image);

          return (
            <div
              key={index}
              style={{
                background: "white",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              }}
            >
              {/* IMAGE */}
              {item.Image && (
                <img
                  src={
                    item.Image.startsWith("http")
                      ? item.Image.replace(
                          "http://127.0.0.1:8000",
                          "https://livestock-backend-x7k6.onrender.com"
                        )
                      : `https://livestock-backend-x7k6.onrender.com${item.Image}`
                  }
                  alt=""
                  style={{
                    width: "100%",
                    height: "220px",
                    objectFit: "cover",
                  }}
                />
              )}

              {/* CONTENT */}
              <div style={{ padding: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <h2>{item.Name}</h2>

                  <button
                    onClick={() => toggleFavorite(index)}
                    style={{
                      border: "none",
                      background: "none",
                      fontSize: "24px",
                      cursor: "pointer",
                    }}
                  >
                    {favorites.includes(index) ? "❤️" : "🤍"}
                  </button>
                </div>

                <p>
                  <b>Breed:</b> {item.Breed}
                </p>
                <p>
                  <b>Age:</b> {item.Age}
                </p>
                <p>
                  <b>Price:</b> ₹{item.Price}
                </p>
                <p>
                  <b>Contact:</b> {item.Contact}
                </p>
                <p>
                  <b>Owner:</b> {item.Owner}
                </p>

                <button
                  onClick={() => deleteLivestock(index)}
                  style={{
                    marginTop: "10px",
                    width: "100%",
                    padding: "10px",
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Livestock;