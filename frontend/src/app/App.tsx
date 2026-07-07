import { useState, useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { BootLoader } from "./components/BootLoader";
import { trackUserAction } from "./utils/telemetry";

export default function App() {
  const [isServerReady, setIsServerReady] = useState(false);

  useEffect(() => {
    const handleAppInstalled = () => {
      trackUserAction("APP_DOWNLOAD", "PWA installed to home screen");
    };
    window.addEventListener("appinstalled", handleAppInstalled);

    const intervalId = setInterval(() => {
      const user = localStorage.getItem("currentUser") || localStorage.getItem("user");
      if (user) {
        trackUserAction("ACTIVE_SESSION", "User is actively using the app");
      }
    }, 5 * 60 * 1000);

    return () => {
      window.removeEventListener("appinstalled", handleAppInstalled);
      clearInterval(intervalId);
    };
  }, []);

  if (!isServerReady) {
    return <BootLoader onReady={() => setIsServerReady(true)} />;
  }

  return <RouterProvider router={router} />;
}
