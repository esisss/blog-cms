"use client";

import { createAuthClient } from "better-auth/react";

// En el cliente, usamos el origen actual del navegador
// Esto funciona en desarrollo (localhost) y producción (tu-dominio.com)
const getBaseURL = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  // Fallback para SSR (no debería usarse, pero por seguridad)
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});

export const { useSession, signIn, signOut, signUp } = authClient;
