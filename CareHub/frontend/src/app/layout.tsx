import "./global.css";
import React from "react";

export const metadata = {
  title: "Sistema de Pagamentos",
  description: "Aplicação com Next.js e TypeScript",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
        <header className="bg-blue-600 text-white py-4 shadow-md">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold">💳 Sistema de Pagamentos</h1>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">{children}</main>

        <footer className="bg-gray-200 dark:bg-gray-800 text-center py-4 mt-8">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            © 2026 - Todos os direitos reservados
          </p>
        </footer>
      </body>
    </html>
  );
}
