
import { Link } from "react-router-dom";
import { Instagram, Smartphone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-church-900 text-white py-8">
      <div className="container-church">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <img 
                src="/lovable-uploads/logo_branco.png" 
                alt="Igreja Casa da Benção" 
                className="h-12 w-auto mr-3"
              />
              <div>
                <h3 className="text-xl font-bold">Igreja Casa da Benção</h3>
                <p className="text-gray-300 text-sm">Comunidade 610</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Uma comunidade cristã comprometida em servir a Deus e edificar vidas através da Palavra.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="https://www.instagram.com/icb_610/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5 mr-2" />
                @icb_610
              </a>
            </div>
          </div>

          {/* Links Úteis */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Úteis</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/sobre" className="text-gray-300 hover:text-white transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/eventos" className="text-gray-300 hover:text-white transition-colors">
                  Eventos
                </Link>
              </li>
              <li>
                <Link to="/ministerios" className="text-gray-300 hover:text-white transition-colors">
                  Ministérios
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-gray-300 hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/instalar" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <Smartphone className="h-4 w-4 mr-1" />
                  Instalar App
                </Link>
              </li>
            </ul>
          </div>

          {/* Informações Legais */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Políticas</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/politica-de-privacidade" className="text-gray-300 hover:text-white transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/termos-de-uso" className="text-gray-300 hover:text-white transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/relatar-bug" className="text-gray-300 hover:text-white transition-colors">
                  Relatar Bug
                </Link>
              </li>
              <li>
                <Link to="/apoiar-desenvolvedor" className="text-gray-300 hover:text-white transition-colors">
                  Apoiar Desenvolvedor
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Rodapé */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-300">
            &copy; {new Date().getFullYear()} Igreja Casa da Benção. Todos os direitos reservados.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Desenvolvido com ❤️ para a família ICB 610
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
