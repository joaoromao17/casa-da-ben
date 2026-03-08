import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MobileFloatingCTA from "@/components/ui/MobileFloatingCTA";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <MobileFloatingCTA />
    </div>
  );
};

export default Layout;
