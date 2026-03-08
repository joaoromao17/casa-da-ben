
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Instagram } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container-church py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center pl-2">
              <img src="/lovable-uploads/logo.png" alt="Logo da Casa da Benção" width="75px" />
            </Link>
          </div>

          {/* Menu Desktop */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-4">
            <div className="flex space-x-6">
              <Link to="/" className="nav-link">Início</Link>
              <Link to="/sobre" className="nav-link">Sobre</Link>
              <Link to="/cultos" className="nav-link">Cultos</Link>
              <Link to="/contato" className="nav-link">Contato</Link>
            </div>
          </div>

          {/* Instagram - Desktop */}
          <div className="hidden lg:flex items-center flex-shrink-0">
            <a
              href="https://www.instagram.com/icb_610/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-church-900 hover:text-church-600"
              >
                <Instagram size={20} /> @icb_610
              </Button>
            </a>
          </div>

          {/* Menu Mobile Toggle */}
          <div className="lg:hidden flex-shrink-0">
            <button onClick={toggleMenu} className="text-church-900 focus:outline-none">
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>Início</Link>
              <Link to="/sobre" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>Sobre</Link>
              <Link to="/cultos" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>Cultos</Link>
              <Link to="/contato" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>Contato</Link>
              <a
                href="https://www.instagram.com/icb_610/"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link py-2 flex items-center gap-2"
              >
                <Instagram size={16} /> @icb_610
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
