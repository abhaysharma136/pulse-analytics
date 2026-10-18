"use client";

import { useEffect, useState } from "react";
import { initializeMocks } from "@/mocks/initialize";

export default function MockProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    initializeMocks()
      .then(() => {
        if (mounted) setReady(true);
      })
      .catch((err) => {
        console.error("Failed to initialize mock API:", err);
        if (mounted) {
          setError(true);
          setReady(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Initializing Pulse Analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center text-sm text-red-600">
        Mock API initialization failed. Check the browser console and restart
        the development server.
      </div>
    );
  }

  return children;
}
