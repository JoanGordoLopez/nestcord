"use client";

import { useEffect, useState } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Verificar al cargar
    checkIfMobile();

    // Verificar al cambiar el tamaño de la ventana
    window.addEventListener("resize", checkIfMobile);

    // Limpiar el event listener
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return isMobile;
}
