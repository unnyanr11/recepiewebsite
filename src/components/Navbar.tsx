"use client";

import { useState, useEffect } from "react";
import DarkModeToggle from "@/components/DarkModeToggle";
import Link from "next/link";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false); // Close menu on mouse leave

  return (
    <nav className="relative flex items-center justify-between p-6 shadow-md bg-red-800 dark:bg-red-900 h-24">
      {/* Hamburger Menu (Left) */}
      <div className="flex items-center">
        <button
          onClick={toggleMenu}
          className="p-2 rounded-md flex flex-col space-y-1 transition-all duration-300 ease-in-out focus:outline-none bg-black"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-[3px] bg-white transition-transform duration-300 ease-in-out ${
              isMenuOpen ? "rotate-45 translate-y-[5px]" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-[3px] bg-white transition-opacity duration-300 ease-in-out ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-[3px] bg-white transition-transform duration-300 ease-in-out ${
              isMenuOpen ? "-rotate-45 -translate-y-[5px]" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile Menu (Dropdown) */}
      <div
        onMouseLeave={closeMenu}
        className={`absolute top-24 left-4 w-48 bg-white p-4 shadow-lg rounded-lg dark:bg-red-900 z-50 transition-transform duration-300 ease-in-out transform ${
          isMenuOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <Link href="/" className="block px-4 py-2 text-red-800 dark:text-white hover:bg-gray-200 dark:hover:bg-red-700 rounded-md transition-all">
          Home
        </Link>
        {user && (
          <>
            <Link href="/profile" className="block px-4 py-2 text-red-800 dark:text-white hover:bg-gray-200 dark:hover:bg-red-700 rounded-md transition-all">
              Profile
            </Link>
            <Link href="/my-recipes" className="block px-4 py-2 text-red-800 dark:text-white hover:bg-gray-200 dark:hover:bg-red-700 rounded-md transition-all">
              My Recipes
            </Link>
          </>
        )}
        <Link href="/about" className="block px-4 py-2 text-red-800 dark:text-white hover:bg-gray-200 dark:hover:bg-red-700 rounded-md transition-all">
          About Us
        </Link>
        {user && (
          <button
            onClick={() => signOut(auth)}
            className="block w-full text-left px-4 py-2 text-red-800 dark:text-white hover:bg-gray-200 dark:hover:bg-red-700 rounded-md transition-all"
          >
            Logout
          </button>
        )}
      </div>

      {/* Centered Recipe Hub Title */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <Link href="/" className="text-4xl font-extrabold text-white dark:text-gray-200 flex items-center gap-2">
          <span role="img" aria-label="plate">🍽</span> Recipe Hub
        </Link>
      </div>

      {/* Right Section: Login / Logout */}
      <div className="flex flex-col items-center gap-2 absolute right-4">
        {user ? (
          <p className="text-green-400 font-semibold">Logged In</p>
        ) : (
          <Link
            href="/signup"
            className="px-4 py-2 w-full text-center rounded-md bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-all"
          >
            Login / Signup
          </Link>
        )}
      </div>

      {/* Dark Mode Toggle (Bottom Right) */}
      <div className="fixed bottom-4 right-4 z-50">
        <DarkModeToggle />
      </div>
    </nav>
  );
}
