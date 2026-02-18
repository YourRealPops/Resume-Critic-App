const API_URL = import.meta.env.VITE_API_URL;

export const waitForServer = async (onWaiting) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    await fetch(`${API_URL}/api/health`, { signal: controller.signal });
    clearTimeout(timeout);
    return true; // server is awake
  } catch {
    clearTimeout(timeout);
    onWaiting(); // server is sleeping, notify the user
    
    // Keep retrying every 3 seconds until it wakes up
    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        try {
          await fetch(`${API_URL}/api/health`);
          clearInterval(interval);
          resolve(true);
        } catch {
          // still sleeping, keep trying
        }
      }, 3000);
    });
  }
};