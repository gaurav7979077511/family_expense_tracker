"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AddEntryForm from "@/components/AddEntryForm";
import { isLoggedIn } from "@/lib/auth";

export default function EntriesPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">Add Entry</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage expenses, contributions, and required fund updates from one locked page.
          </p>
        </div>

        <div className="mb-3 text-xs text-gray-500 uppercase tracking-wider font-medium px-1">
          {loggedIn ? "Admin Access" : "Locked"}
        </div>
        <AddEntryForm
          isLoggedIn={loggedIn}
          onSuccess={() => setRefreshKey((current) => current + 1)}
          key={refreshKey}
        />
      </main>
    </div>
  );
}
