'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MaintenanceListener({ currentStatus }: { currentStatus: boolean }) {
  const router = useRouter();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // 🔥 UPDATE: Cache hatane ke liye timestamp aur headers lagaye hain
        // Taki browser purana status na pakde
        const res = await fetch(`/api/maintenance-check?t=${new Date().getTime()}`, {
            cache: 'no-store',
            headers: {
                'Pragma': 'no-cache',
                'Cache-Control': 'no-cache'
            }
        });

        if (!res.ok) return;

        const data = await res.json();

        // 🔥 Agar Database ka status aur Current page ka status alag hai
        // Matlab Admin ne button daba diya hai -> Page Reload karo!
        if (data.isMaintenance !== currentStatus) {
          console.log("Status Changed! Reloading...");
          
          // Full Hard Reload taki Layout.tsx wapis se DB check kare
          window.location.reload(); 
        }
      } catch (error) {
        console.error("Maintenance check failed (ignore if offline)", error);
      }
    };

    // ⏱️ Har 5 second (5000ms) me check karega
    const interval = setInterval(checkStatus, 5000);

    return () => clearInterval(interval);
  }, [currentStatus, router]);

  return null; // Ye component screen par kuch nahi dikhata, bas background me kaam karta hai
}