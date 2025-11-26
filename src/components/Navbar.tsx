"use client";

import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{
    username: string;
    role: string;
  } | null>(null);

  // Función para leer cookies y actualizar el estado del usuario
  const syncUserFromCookies = () => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");
    const username = Cookies.get("username");
    if (token && role && username) {
      setUser({ username, role });
    } else {
      setUser(null);
    }
  };

  // Al montar y cuando cambie la ruta, re-lee las cookies
  useEffect(() => {
    syncUserFromCookies();
  }, [pathname]);

  // Escucha un evento global para cambios de autenticación (login/registro)
  useEffect(() => {
    const handler = () => syncUserFromCookies();
    window.addEventListener("auth-changed", handler);
    return () => window.removeEventListener("auth-changed", handler);
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("username");
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/products" className="text-xl font-semibold text-gray-900">
            ProductStore
          </Link>
          <div className="flex gap-6 items-center">
            <Link
              href="/products"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Productos
            </Link>
            {user?.role === "admin" && (
              <Link
                href="/admin"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Admin
              </Link>
            )}
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-900 font-medium">
                  {user.role === "admin"
                    ? `Hola, Admin (${user.username})`
                    : `Hola, ${user.username}`}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="flex gap-4 items-center">
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-800 transition-colors text-center"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}