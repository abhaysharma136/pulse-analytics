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
      <main
        className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 dark:bg-slate-950"
        role="status"
        aria-label="Initializing Pulse Analytics"
      >
        <div className="mx-auto max-w-[1600px]">
          <div className="flex gap-6">
            {/* Sidebar placeholder */}
            <div className="hidden w-60 shrink-0 space-y-5 rounded-xl bg-slate-900 p-5 md:block">
              <div className="h-10 w-36 animate-pulse rounded-lg bg-slate-700" />
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="h-10 animate-pulse rounded-lg bg-slate-800"
                />
              ))}
            </div>

            {/* Dashboard placeholder */}
            <div className="min-w-0 flex-1 space-y-6">
              <div className="h-12 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />

              <div className="space-y-3">
                <div className="h-8 w-64 animate-pulse rounded-md bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-80 max-w-full animate-pulse rounded-md bg-slate-200 dark:bg-slate-800" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }, (_, i) => (
                  <div
                    key={i}
                    className="h-32 animate-pulse rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="h-80 animate-pulse rounded-xl border border-slate-200 bg-white xl:col-span-2 dark:border-slate-700 dark:bg-slate-900" />
                <div className="h-80 animate-pulse rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900" />
              </div>

              <div className="h-64 animate-pulse rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900" />
            </div>
          </div>
        </div>

        <span className="sr-only">Initializing Pulse Analytics...</span>
      </main>
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
