import Navbar from "./components/Navbar";
import AuthContext from "./context/AuthContext";

import "./globals.css";
import "react-datepicker/dist/react-datepicker.css";

export const metadata = {
  title: "OpenTable",
  description: "This is an open table clone app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="bg-gray-100 min-h-screen w-screen">
          <AuthContext>
            <main className="max-w-screen-2xl mx-auto bg-white">
              <Navbar />
              {children}
            </main>
          </AuthContext>
        </main>
      </body>
    </html>
  );
}
