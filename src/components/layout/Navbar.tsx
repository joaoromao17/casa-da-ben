
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
  Plus,
} from "lucide-react";
import { AvisoModal } from "@/components/avisos/AvisoModal";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isAvisoModalOpen, setIsAvisoModalOpen] = useState(false);

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

  const canCreateGeneralAviso = userRoles.some(role => 
    role === "ROLE_ADMIN" || role === "ROLE_PASTOR" || role === "ROLE_PASTORAUXILIAR"
  );

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    window.location.reload();
  };

  const handleAvisoSuccess = () => {
    // Refresh da página para mostrar o novo aviso
    window.location.reload();
  };

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="container-church py-4">
          <div className="flex justify-between items-center">
            {/* Logo - sempre visível */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center pl-2">
                <img src="/lovable-uploads/logo.png" alt="Logo da Casa da Benção" width="75px" />
              </Link>
            </div>

            {/* Menu Desktop - centralizado */}
            <div className="hidden lg:flex items-center justify-center flex-1 mx-4">
              <div className="flex space-x-6">
                <Link to="/" className="nav-link">Início</Link>
                <Link to="/sobre" className="nav-link">Sobre</Link>
                {isLoggedIn && (
                  <Link to="/membros" className="nav-link">Membros</Link>
                )}
                <Link to="/eventos" className="nav-link">Eventos</Link>
                <Link to="/ministerios" className="nav-link">Ministérios</Link>
                <Link to="/estudos" className="nav-link">Estudos</Link>
                <Link to="/oracao" className="nav-link">Orações</Link>
                <Link to="/testemunhos" className="nav-link">Testemunhos</Link>
                <Link to="/contribuicoes" className="nav-link">Contribuições</Link>
                <Link to="/contato" className="nav-link">Contato</Link>
                {hasAdminAccess && (
                  <Link to="/admin" className="nav-link flex items-center gap-1">
                    <Settings size={14} />
                    Admin
                  </Link>
                )}
              </div>
            </div>

            {/* Botões de ação - sempre à direita */}
            <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
              {isLoggedIn ? (
                <>
                  {canCreateGeneralAviso && (
                    <Button 
                      onClick={() => setIsAvisoModalOpen(true)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Aviso
                    </Button>
                  )}
                  <Link to="/minha-conta">
                    <Button size="sm" className="btn-primary">Minha Conta</Button>
                  </Link>
                  <Button onClick={handleLogout} size="sm" className="btn-danger">Sair</Button>
                </>
              ) : (
                <>
                  <Link to="/cadastro">
                    <Button size="sm" className="bg-black/80 text-white hover:bg-black/70 hover:text-white">Cadastre-se</Button>
                  </Link>
                  <Link to="/login">
                    <Button size="sm" className="bg-black/80 text-white hover:bg-black/70 hover:text-white">Entrar</Button>
                  </Link>
                </>
              )}
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
                <Link to="/" className="nav-link py-2">Início</Link>
                <Link to="/sobre" className="nav-link py-2">Sobre</Link>
                {isLoggedIn && (
                  <Link to="/membros" className="nav-link py-2">Membros</Link>
                )}
                <Link to="/eventos" className="nav-link py-2">Eventos</Link>
                <Link to="/ministerios" className="nav-link py-2">Ministérios</Link>
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
                      {canCreateGeneralAviso && (
                        <Button 
                          onClick={() => setIsAvisoModalOpen(true)}
                          className="bg-green-600 hover:bg-green-700 text-white w-full"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Novo Aviso
                        </Button>
                      )}
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

      {/* Modal para Aviso Geral */}
      <AvisoModal
        isOpen={isAvisoModalOpen}
        onClose={() => setIsAvisoModalOpen(false)}
        onSuccess={handleAvisoSuccess}
      />
    </>
  );
};

export default Navbar;
