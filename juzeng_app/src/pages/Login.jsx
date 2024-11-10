import React, { useState } from "react";
import axios from "axios";
import API_URL from "../utils/config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    const payload = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(`${API_URL}/token/`, payload, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      // Assuming token response structure
      const { access, refresh, role } = response.data;

      // Store tokens and role in localStorage
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("role", role);

      // Route based on the role
      if (role === "superadmin" || role === "supervisor") {
        window.location.href = "/calendar";
      } else if (role === "teacher" || role === "curator") {
        window.location.href = "/calendar";
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Invalid credentials");
      } else {
        console.error("Error:", err);
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center">
      <div className="flex flex-col md:flex-row max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden m-4">
        {/* Image Section */}
        <div className="w-full md:w-1/2 bg-gray-100 flex justify-center">
          <img
            src="/images/login_background.png"
            alt="Login Background"
            className="object-cover w-full h-full md:rounded-l-lg"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Sign in to your account
          </h2>
          <p className="text-center mb-6">
            Welcome back! Login with your data provided by JuzEng :)
          </p>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              <strong>Error!</strong> {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="mb-1 block text-gray-700">
                <strong>Email</strong>
              </label>
              <input
                type="email"
                className="form-control w-full px-4 py-2 border rounded focus:outline-none"
                placeholder="hello@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="mb-1 block text-gray-700">
                <strong>Password</strong>
              </label>
              <input
                type="password"
                className="form-control w-full px-4 py-2 border rounded focus:outline-none"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="row d-flex justify-between mt-4 mb-2">
              <div className="mb-3">
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox" />
                  <span className="ml-2 text-gray-700">
                    Remember my preference
                  </span>
                </label>
              </div>
              <div className="mb-3">
                <a
                  href="/forgot-password"
                  className="text-blue-600 hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary btn-block w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >
                Sign Me In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
