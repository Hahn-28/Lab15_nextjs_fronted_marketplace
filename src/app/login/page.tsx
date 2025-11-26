"use client";

import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (!apiBaseUrl) {
        throw new Error("API base URL no configurada (NEXT_PUBLIC_API_URL)");
      }

      const res = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        Cookies.set("token", data.token);
        Cookies.set("role", data.user.role);
        Cookies.set("username", data.user.username);
        router.push("/products");
        router.refresh();
      } else {
        setError(data.message || "Error al iniciar sesión");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error de conexión"
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Iniciar Sesión
        </h2>
        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block font-bold text-gray-700">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded border px-3 py-2 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div className="mb-6">
            <label className="mb-2 block font-bold text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border px-3 py-2 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
          >
            Ingresar
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-blue-500 hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
