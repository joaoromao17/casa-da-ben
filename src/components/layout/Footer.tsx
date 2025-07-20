
import { Link } from "react-router-dom";
import {
  Instagram,
  Facebook,
  Youtube,
  MapPin,
  Mail,
  Bug,
  Heart,
  Smartphone,
  Lightbulb
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-church-800 text-white pt-12 pb-6">
      <div className="container-church">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">ICB 610</h3>
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
                href="https://www.facebook.com/icbsamambaianorte610"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-church-gold transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.youtube.com/@icbsamambaianorte610"
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
              <li>
                <Link to="/instalar" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <Smartphone className="h-4 w-4 mr-1" />
                  Instalar App
                </Link>
              </li>
            </ul>
          </div>

          {/* Horários de culto */}
          <div>
            <h3 className="text-xl font-bold mb-4">Cultos</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-300">Domingo: 18:30h</span>
              </li>
              <li>
                <span className="text-gray-300">Terça: 20h</span>
              </li>
              <li>
                <span className="text-gray-300">Quarta: 20h</span>
              </li>
              <li>
                <span className="text-gray-300">Sexta: 20h</span>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-church-gold flex-shrink-0" />
                <span className="text-gray-300">Qs 610 Samambaia Norte</span>
              </li>
              
              <li className="flex items-center">
                <Instagram className="mr-2 h-5 w-5 text-church-gold flex-shrink-0" />
                <a href="https://www.instagram.com/icb_610/" target="_blank" rel="noopener noreferrer">@icb_610</a>
              </li>
              
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-church-gold flex-shrink-0" />
                <a href="mailto:icbcasadabencao610@gmail.com" className="text-gray-300 hover:underline">icbcasadabencao610@gmail.com</a>
              </li>
            </ul>
          </div>
          <div className="col-span-full flex justify-center mt-4">
            <img
              src="/lovable-uploads/logo_branco.png"
              alt="Logo da Casa da Benção"
              width="250px"
            />
          </div>
        </div>

        <hr className="border-gray-700 my-8" />

      {/* Bottom Footer */}
      <div className="text-center text-gray-400">
        <p>&copy; {currentYear} ICB 610. Todos os direitos reservados.</p>
        
        {/* Primeira linha de links */}
        <p className="mt-2">
          <Link to="/politica-de-privacidade" className="hover:text-white transition-colors">
            Política de Privacidade
          </Link>
          {" • "}
          <Link to="/termos-de-uso" className="hover:text-white transition-colors">
            Termos de Uso
          </Link>
        </p>
      
        {/* Segunda linha de links */}
        <p className="mt-1">
          <Link to="/relatar-bug" className="hover:text-white transition-colors inline-flex items-center gap-1">
            <Bug size={16} />
            <Lightbulb size={16} />
            Sugestão/Bug
          </Link>
          {" • "}
          <Link to="/apoiar-desenvolvedor" className="hover:text-white transition-colors inline-flex items-center gap-1">
            <Heart size={16} />
            Apoiar Desenvolvedor
          </Link>
        </p>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
