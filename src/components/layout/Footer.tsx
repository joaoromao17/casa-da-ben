
import { Link } from "react-router-dom";
import { 
  Instagram, 
  Facebook, 
  Youtube, 
  MapPin, 
  Phone, 
  Mail, 
  Clock 
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-church-800 text-white pt-12 pb-6">
      <div className="container-church">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Casa da Benção 610</h3>
            <p className="mb-4 text-gray-300">
              Igreja comprometida com a propagação do evangelho de Jesus Cristo e o 
              desenvolvimento espiritual de cada membro.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/icb_610/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-church-gold transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-church-gold transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-church-gold transition-colors"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Links Rápidos</h3>
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
                <Link to="/estudos" className="text-gray-300 hover:text-white transition-colors">
                  Escola Bíblica
                </Link>
              </li>
              <li>
                <Link to="/contribuicoes" className="text-gray-300 hover:text-white transition-colors">
                  Contribuições
                </Link>
              </li>
              <li>
                <Link to="/testemunhos" className="text-gray-300 hover:text-white transition-colors">
                  Testemunhos
                </Link>
              </li>
            </ul>
          </div>

          {/* Ministries */}
          <div>
            <h3 className="text-xl font-bold mb-4">Ministérios</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/ministerios/louvor" className="text-gray-300 hover:text-white transition-colors">
                  Louvor
                </Link>
              </li>
              <li>
                <Link to="/ministerios/jovens" className="text-gray-300 hover:text-white transition-colors">
                  Jovens
                </Link>
              </li>
              <li>
                <Link to="/ministerios/casais" className="text-gray-300 hover:text-white transition-colors">
                  Casais
                </Link>
              </li>
              <li>
                <Link to="/ministerios/infantil" className="text-gray-300 hover:text-white transition-colors">
                  Infantil
                </Link>
              </li>
              <li>
                <Link to="/ministerios/intercessao" className="text-gray-300 hover:text-white transition-colors">
                  Intercessão
                </Link>
              </li>
              <li>
                <Link to="/ministerios/midia" className="text-gray-300 hover:text-white transition-colors">
                  Mídia
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-church-gold flex-shrink-0" />
                <span className="text-gray-300">Av. Principal, 1234, Centro - Sua Cidade/UF</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-church-gold flex-shrink-0" />
                <span className="text-gray-300">(XX) XXXX-XXXX</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-church-gold flex-shrink-0" />
                <span className="text-gray-300">contato@casadabencao.org</span>
              </li>
              <li className="flex items-start">
                <Clock className="mr-2 h-5 w-5 text-church-gold flex-shrink-0" />
                <div className="text-gray-300">
                  <p>Cultos:</p>
                  <p>Domingo: 9h e 18h</p>
                  <p>Quarta: 19h30</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-700 my-8" />
        
        {/* Bottom Footer */}
        <div className="text-center text-gray-400">
          <p>&copy; {currentYear} Igreja Casa da Benção 610. Todos os direitos reservados.</p>
          <p className="mt-2">
            <Link to="/politica-de-privacidade" className="hover:text-white transition-colors">
              Política de Privacidade
            </Link>
            {" • "}
            <Link to="/termos-de-uso" className="hover:text-white transition-colors">
              Termos de Uso
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
