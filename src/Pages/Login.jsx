import React, { useState } from "react";
import { useNavigate, Link } from "react-router";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("https://intern-project-1-fose.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.name);
        setMessage("✅ Login successful!");
        navigate("/", { replace: true });
      } else {
        setMessage(data.error || "Invalid credentials");
      }
    } catch (error) {
      setMessage("Server error");
    }
  };

  return (
    <div className="bg-[#393E46] min-h-screen flex justify-center items-center">
      <div className="bg-[#222831] border border-[#DFD0B8] rounded-lg p-8 w-[400px] shadow-lg">
        <h2 className="text-[#DFD0B8] text-3xl font-bold mb-6 text-center">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="p-3 rounded-md bg-[#393E46] text-[#DFD0B8] border border-[#DFD0B8] placeholder-[#B8B8B8]"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="p-3 rounded-md bg-[#393E46] text-[#DFD0B8] border border-[#DFD0B8] placeholder-[#B8B8B8]"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="p-3 bg-[#F6C90E] text-[#393E46] font-semibold rounded-md hover:bg-[#FFD700] transition"
          >
            Login
          </button>
        </form>
        {message && <p className="text-center text-[#DFD0B8] mt-4">{message}</p>}
        <p className="text-[#B8B8B8] text-sm text-center mt-3">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-[#F6C90E] hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
