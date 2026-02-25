import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Lock, AlertCircle, ChevronRight } from "lucide-react";

export default function MediatorLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!credentials.username || !credentials.password) {
      setError("Please enter username and password");
      return;
    }

    setLoading(true);
    const api = (import.meta as any).env.VITE_API_URL || "http://localhost:8080";

    try {
      const res = await fetch(`${api}/api/mediator/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) throw new Error("Login failed");
      const data = await res.json();

      localStorage.setItem("mediatorToken", data.token);
      localStorage.setItem("mediatorRole", data.role);
      navigate("/mediator");
    } catch (err) {
      setError("Invalid credentials. Try: mediator / password123");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--off-white)" }}>
      <div className="max-w-md w-full mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "var(--navy-blue)" }}
          >
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            Mediator Login
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Access the Queue Manager
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="rounded-lg p-4 mb-4 flex items-start gap-3"
            style={{ backgroundColor: "var(--error-light)", border: "1px solid var(--error-red)" }}
          >
            <AlertCircle className="w-5 h-5" style={{ color: "var(--error-red)" }} />
            <p className="text-sm" style={{ color: "var(--error-red)" }}>
              {error}
            </p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl p-6 space-y-4" style={{ border: "1px solid var(--border-color)" }}>
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
              Username
            </label>
            <input
              type="text"
              placeholder="Enter username"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1"
              style={{ borderColor: "var(--border-color)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1"
              style={{ borderColor: "var(--border-color)" }}
            />
          </div>

          <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Demo credentials: <strong>mediator</strong> / <strong>password123</strong>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ backgroundColor: "var(--navy-blue)" }}
          >
            {loading ? "Logging in..." : "Login"}
            {!loading && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

        {/* Footer */}
        <button
          onClick={() => navigate("/")}
          className="w-full mt-4 py-2 text-sm text-center font-medium"
          style={{ color: "var(--navy-blue)" }}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
