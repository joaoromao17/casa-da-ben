
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
        <div className="fixed bottom-4 right-4 bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs font-medium border border-gray-300 shadow-sm">
          Backend: Java Spring Boot
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
