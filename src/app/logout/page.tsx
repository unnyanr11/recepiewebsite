"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // Clear user session (if using authentication)
    localStorage.removeItem("user");
    router.push("/"); // Redirect to homepage after logout
  }, [router]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Logging Out...</h1>
      <p>You are being redirected to the homepage.</p>
    </div>
  );
}
