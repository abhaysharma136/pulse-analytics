let initializationPromise: Promise<void> | null = null;

export function initializeMocks(): Promise<void> {
  console.log("[MSW] initializeMocks called");
  console.log("[MSW] NODE_ENV:", process.env.NODE_ENV);
  console.log(
    "[MSW] NEXT_PUBLIC_ENABLE_MOCKS:",
    process.env.NEXT_PUBLIC_ENABLE_MOCKS,
  );

  if (
    process.env.NODE_ENV !== "development" ||
    process.env.NEXT_PUBLIC_ENABLE_MOCKS !== "true"
  ) {
    console.log("[MSW] Mocks disabled; skipping initialization");
    return Promise.resolve();
  }

  if (!initializationPromise) {
    console.log("[MSW] Importing browser worker...");

    initializationPromise = import("./browser")
      .then(async ({ worker }) => {
        console.log("[MSW] Browser worker imported");
        console.log("[MSW] Starting worker...");

        await worker.start({
          onUnhandledRequest: "bypass",
        });

        console.log("[MSW] Worker started successfully");
      })
      .catch((error) => {
        console.error("[MSW] Initialization failed:", error);
        initializationPromise = null;
        throw error;
      });
  }

  return initializationPromise;
}
