"use client";

import { useState } from "react";

export default function AuthButton() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuth = () => {
    setIsAuthenticated((prev) => !prev);
  };

  return (
    <button
      onClick={handleAuth}
      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all"
    >
      {isAuthenticated ? "Logout" : "Login / Sign Up"}
    </button>
  );
}
