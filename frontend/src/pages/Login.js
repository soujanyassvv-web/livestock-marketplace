import React, { useState } from "react";
import axios from "axios";

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {

    try {

      const res = await axios.post(
        "https://livestock-backend-x7k6.onrender.com/login",
        null,
        {
          params: {
            username,
            password
          }
        }
      );

      if (res.data.message === "Login successful") {

        localStorage.setItem("user", username);

        window.location.href = "/livestock";

      } else {

        alert("Invalid login");

      }

    } catch (err) {

      alert("Server error");

    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5"
      }}
    >

      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "10px",
          width: "300px",
          boxShadow: "0 0 10px rgba(0,0,0,0.2)"
        }}
      >

        <h2>Livestock Marketplace</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px"
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px"
          }}
        />

        <button
          onClick={login}
          style={{
            width: "100%",
            padding: "10px",
            background: "green",
            color: "white",
            border: "none"
          }}
        >
          Login
        </button>

        <br />
        <br />

        <button
          onClick={() => window.location.href="/signup"}
          style={{
            width: "100%",
            padding: "10px"
          }}
        >
          Signup
        </button>

      </div>

    </div>
  );
}

export default Login;