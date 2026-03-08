import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, MapPin, Mail, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-church-800 text-white pt-14 pb-8">
      <div className="container-church">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {/* About */}
          <div>
            <img
              src="/lovable-uploads/logo_branco.png"
              alt="ICB 610"
              className="h-16 w-auto mb-4"
            />
            <p className="text-warm-300 text-sm leading-relaxed mb-5">
              Igreja comprometida com a propagação do evangelho de Jesus Cristo e o desenvolvimento espiritual de cada membro.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/icb_610/" target="_blank" rel="noopener noreferrer" className="text-warm-400 hover:text-church-gold transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://www.facebook.com/icbsamambaianorte610" target="_blank" rel="noopener noreferrer" className="text-warm-400 hover:text-church-gold transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://www.youtube.com/@icbsamambaianorte610" target="_blank" rel="noopener noreferrer" className="text-warm-400 hover:text-church-gold transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm uppercase tracking-wider font-semibold text-warm-300 mb-4">Navegação</h4>
            <ul className="space-y-2.5">
              {[
                { to: "/sobre", label: "Sobre Nós" },
                { to: "/cultos", label: "Horários de Culto" },
                { to: "/primeira-visita", label: "Primeira Visita" },
                { to: "/no-que-cremos", label: "No que Cremos" },
                { to: "/lideranca", label: "Liderança" },
                { to: "/ministerios", label: "Ministérios" },
                { to: "/contato", label: "Contato" },
                { to: "/como-chegar", label: "Como Chegar" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-warm-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm uppercase tracking-wider font-semibold text-warm-300 mb-4">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-church-gold flex-shrink-0 mt-0.5" />
                <span className="text-warm-400 text-sm">QS 610 — Samambaia Norte, Brasília - DF</span>
              </div>
              <div className="flex items-start gap-3">
                <Instagram className="w-4 h-4 text-church-gold flex-shrink-0 mt-0.5" />
                <a href="https://www.instagram.com/icb_610/" target="_blank" rel="noopener noreferrer" className="text-warm-400 hover:text-white text-sm transition-colors">
                  @icb_610
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-church-gold flex-shrink-0 mt-0.5" />
                <a href="mailto:icbcasadabencao610@gmail.com" className="text-warm-400 hover:text-white text-sm transition-colors break-all">
                  icbcasadabencao610@gmail.com
                </a>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm uppercase tracking-wider font-semibold text-warm-300 mb-3">Cultos</h4>
              <div className="text-warm-400 text-sm space-y-1">
                <p>Domingo — 18h30</p>
                <p>Terça — 20h</p>
                <p>Quarta — 20h</p>
                <p>Sexta — 20h</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-warm-500">
          <p>&copy; {currentYear} ICB 610. Todos os direitos reservados.</p>
          <div className="flex items-center gap-3">
            <Link to="/politica-de-privacidade" className="hover:text-white transition-colors">Privacidade</Link>
            <span>•</span>
            <Link to="/termos-de-uso" className="hover:text-white transition-colors">Termos</Link>
            <span>•</span>
            <Link to="/apoiar-desenvolvedor" className="hover:text-white transition-colors inline-flex items-center gap-1">
              <Heart size={12} /> Apoiar
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
