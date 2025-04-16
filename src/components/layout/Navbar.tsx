
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu,
  X, 
  ChevronDown, 
  User, 
  BookOpen, 
  CalendarDays, 
  Instagram 
} from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container-church py-4">
        <div className="flex justify-between items-center">
          {/* Logo on the left with spacing */}
          <Link to="/" className="flex items-center pl-2"> 
            <span className="text-2xl font-['Montserrat'] font-bold text-church-900">ICB <span className="text-church-700">610</span></span>
          </Link>

          {/* Desktop Navigation centered */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-4">
            <div className="flex space-x-8">
              <Link to="/" className="nav-link">Início</Link>
              <Link to="/sobre" className="nav-link">Sobre</Link>
              <div className="relative group">
                <button className="nav-link flex items-center">
                  Ministérios <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute z-10 hidden group-hover:block bg-white shadow-lg rounded-md py-2 w-48">
                  <Link to="/ministerios/louvor" className="block px-4 py-2 hover:bg-church-100">Louvor</Link>
                  <Link to="/ministerios/jovens" className="block px-4 py-2 hover:bg-church-100">Jovens</Link>
                  <Link to="/ministerios/casais" className="block px-4 py-2 hover:bg-church-100">Casais</Link>
                  <Link to="/ministerios/infantil" className="block px-4 py-2 hover:bg-church-100">Infantil</Link>
                  <Link to="/ministerios/intercessao" className="block px-4 py-2 hover:bg-church-100">Intercessão</Link>
                  <Link to="/ministerios/midia" className="block px-4 py-2 hover:bg-church-100">Mídia</Link>
                </div>
              </div>
              <Link to="/estudos" className="nav-link">Estudos</Link>
              <Link to="/eventos" className="nav-link">Eventos</Link>
              <Link to="/contribuicoes" className="nav-link">Contribuições</Link>
              <Link to="/testemunhos" className="nav-link">Testemunhos</Link>
              <Link to="/contato" className="nav-link">Contato</Link>
            </div>
          </div>

          {/* Authentication Buttons on the right with spacing */}
          <div className="hidden lg:flex items-center space-x-4 pr-2">
            {isLoggedIn ? (
              <Button className="btn-primary">Área do Membro</Button>
            ) : (
              <>
                <Link to="/cadastro">
                  <Button className="bg-black/80 text-white hover:bg-black/70 hover:text-white">Cadastre-se</Button>
                </Link>
                <Link to="/login">
                  <Button className="bg-black/80 text-white hover:bg-black/70 hover:text-white">Entrar</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button onClick={toggleMenu} className="text-church-900 focus:outline-none">
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="nav-link py-2">Início</Link>
              <Link to="/sobre" className="nav-link py-2">Sobre</Link>
              <details className="group">
                <summary className="nav-link py-2 flex cursor-pointer items-center justify-between">
                  Ministérios <ChevronDown className="h-4 w-4" />
                </summary>
                <div className="pl-4 mt-2 space-y-2">
                  <Link to="/ministerios/louvor" className="block py-2 hover:text-church-900">Louvor</Link>
                  <Link to="/ministerios/jovens" className="block py-2 hover:text-church-900">Jovens</Link>
                  <Link to="/ministerios/casais" className="block py-2 hover:text-church-900">Casais</Link>
                  <Link to="/ministerios/infantil" className="block py-2 hover:text-church-900">Infantil</Link>
                  <Link to="/ministerios/intercessao" className="block py-2 hover:text-church-900">Intercessão</Link>
                  <Link to="/ministerios/midia" className="block py-2 hover:text-church-900">Mídia</Link>
                </div>
              </details>
              <Link to="/estudos" className="nav-link py-2">Estudos</Link>
              <Link to="/eventos" className="nav-link py-2">Eventos</Link>
              <Link to="/contribuicoes" className="nav-link py-2">Contribuições</Link>
              <Link to="/testemunhos" className="nav-link py-2">Testemunhos</Link>
              <Link to="/contato" className="nav-link py-2">Contato</Link>
              
              {/* Authentication Buttons */}
              <div className="flex flex-col space-y-2 pt-2">
                {isLoggedIn ? (
                  <Button className="btn-primary w-full">Área do Membro</Button>
                ) : (
                  <>
                    <Link to="/cadastro" className="w-full">
                      <Button className="btn-outline w-full">Cadastre-se</Button>
                    </Link>
                    <Link to="/login" className="w-full">
                      <Button className="btn-primary w-full">Entrar</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Access Buttons */}
      <div className="bg-church-900 text-white py-3">
        <div className="container-church flex flex-wrap justify-center sm:justify-between items-center gap-3">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            <Link to="/cadastro">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-gray-600 hover:text-black flex items-center gap-2"
              >
                <User size={18} /> Cadastre-se
              </Button>
            </Link>
            <Link to="/estudos">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-gray-600 hover:text-black flex items-center gap-2"
              >
                <BookOpen size={18} /> Escola Bíblica
              </Button>
            </Link>
            <Link to="/eventos">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-gray-600 hover:text-black flex items-center gap-2"
              >
                <CalendarDays size={18} /> Eventos
              </Button>
            </Link>
          </div>
          <a 
            href="https://www.instagram.com/icb_610/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button 
              className="bg-transparent text-white hover:bg-gray-600 hover:text-black flex items-center gap-2"
            >
              <Instagram size={20} /> @icb_610
            </Button>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
