"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, provider } from "@/lib/firebaseConfig";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Email/Password Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/"); // Redirect to homepage after login
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">Login</h2>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full p-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-all"
        >
          Sign in with Google
        </button>

        <form onSubmit={handleLogin} className="mt-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full p-2 mt-2 border rounded-md focus:ring focus:ring-red-400 dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full p-2 mt-2 border rounded-md focus:ring focus:ring-red-400 dark:bg-gray-700 dark:text-white"
            required
          />
          <button
            type="submit"
            className="w-full p-2 mt-4 text-white bg-red-600 rounded-md hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-all"
          >
            Login
          </button>
        </form>

        {error && <p className="mt-2 text-center text-red-500">{error}</p>}

        <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
          Don&apos;t have an account?
          <Link href="/signup" className="text-red-600 hover:underline dark:text-red-400"> Sign up</Link>
        </p>
      </div>
    </div>
  );
}
