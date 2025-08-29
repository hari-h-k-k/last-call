import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

export const metadata = {
  title: "Next.js Auth App",
  description: "Login, Signup & Protected Routes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
