import React, { useState } from "react";
import axios from "axios";

function Signup() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {

    try {

      const res = await axios.post(
        "http://127.0.0.1:8000/signup",
        null,
        {
          params: {
            username,
            password
          }
        }
      );

      alert(res.data.message);

      window.location.href = "/";

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

        <h2>Create Account</h2>

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
          onClick={signup}
          style={{
            width: "100%",
            padding: "10px",
            background: "green",
            color: "white",
            border: "none"
          }}
        >
          Signup
        </button>

      </div>

    </div>
  );
}

export default Signup;