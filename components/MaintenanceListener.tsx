'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MaintenanceListener({ currentStatus }: { currentStatus: boolean }) {
  const router = useRouter();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/maintenance-check');
        const data = await res.json();

        // 🔥 Agar Database ka status aur Current page ka status alag hai
        // Matlab Admin ne button daba diya hai -> Page Reload karo!
        if (data.isMaintenance !== currentStatus) {
          console.log("Status Changed! Reloading...");
          window.location.reload(); 
        }
      } catch (error) {
        console.error("Check failed", error);
      }
    };

    // ⏱️ Har 5 second (5000ms) me check karega
    const interval = setInterval(checkStatus, 5000);

    return () => clearInterval(interval);
  }, [currentStatus, router]);

  return null; // Ye component screen par kuch nahi dikhata, bas kaam karta hai
}