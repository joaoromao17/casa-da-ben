import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  ChevronDown,
  User,
  BookOpen,
  CalendarDays,
  Instagram,
  Settings,
} from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    setIsLoggedIn(!!token);
    
    if (token) {
      try {
        // Decodificar o payload do token JWT
        const payload = token.split(".")[1];
        const decodedPayload = JSON.parse(atob(payload));
        setUserRoles(decodedPayload.roles || []);
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
        setUserRoles([]);
      }
    }
  }, []);

  const hasAdminAccess = userRoles.some(role => 
    role === "ROLE_ADMIN" || role === "ROLE_PASTOR"
  );

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    window.location.reload();
  };


  return (
    <nav className="bg-white shadow-md">
      <div className="container-church py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center pl-2">
            <img src="/lovable-uploads/logo.png" alt="Logo da Casa da Benção" width="75px" />
          </Link>

          <div className="hidden lg:flex items-center justify-center flex-1 mx-4">
            <div className="flex space-x-8">
              <Link to="/" className="nav-link">Início</Link>
              <Link to="/sobre" className="nav-link">Sobre</Link>
              <Link to="/eventos" className="nav-link">Eventos</Link>
              <Link to="/ministerios" className="nav-link">Ministérios</Link>
              <Link to="/estudos" className="nav-link">Estudos</Link>
              <Link to="/oracao" className="nav-link">Orações</Link>
              <Link to="/testemunhos" className="nav-link">Testemunhos</Link>
              <Link to="/contribuicoes" className="nav-link">Contribuições</Link>
              <Link to="/contato" className="nav-link">Contato</Link>
              {hasAdminAccess && (
                <Link to="/admin" className="nav-link flex items-center gap-1">
                  <Settings size={16} />
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-4 pr-2">
            {isLoggedIn ? (
                  <>
                    <Link to="/minha-conta" className="w-full">
                      <Button className="btn-primary w-full">Minha Conta</Button>
                    </Link>
                    <Button onClick={handleLogout} className="btn-danger">Sair</Button>
                  </>
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

        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="nav-link py-2">Início</Link>
              <Link to="/sobre" className="nav-link py-2">Sobre</Link>
              <Link to="/eventos" className="nav-link py-2">Eventos</Link>
              <details className="group">
                <summary className="nav-link py-2 flex cursor-pointer items-center justify-between">
                  Ministérios <ChevronDown className="h-4 w-4" />
                </summary>
              </details>
              <Link to="/estudos" className="nav-link py-2">Estudos</Link>
              <Link to="/oracao" className="nav-link py-2">Orações</Link>
              <Link to="/testemunhos" className="nav-link py-2">Testemunhos</Link>
              <Link to="/contribuicoes" className="nav-link py-2">Contribuições</Link>
              <Link to="/contato" className="nav-link py-2">Contato</Link>
              {hasAdminAccess && (
                <Link to="/admin" className="nav-link py-2 flex items-center gap-1">
                  <Settings size={16} />
                  Painel de Administração
                </Link>
              )}
              <div className="flex flex-col space-y-2 pt-2">
                {isLoggedIn ? (
                  <>
                    <Link to="/minha-conta" className="w-full">
                      <Button className="btn-primary w-full">Minha Conta</Button>
                    </Link>
                    <Button onClick={handleLogout} className="btn-danger">Sair</Button>
                  </>
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

      <div className="bg-church-900 text-white py-3">
        <div className="container-church flex flex-wrap justify-center sm:justify-between items-center gap-3">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            <Link to="/por-que-se-registrar">
              <Button
                variant="ghost"
                className="text-white hover:bg-gray-600 hover:text-black flex items-center gap-2"
              >
                Por que se cadastrar?
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
