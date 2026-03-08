import Layout from "@/components/layout/Layout";
import PageHero from "@/components/ui/PageHero";
import { Button } from "@/components/ui/button";
import { MapPin, Car, Bus, ArrowRight, Navigation } from "lucide-react";
import { motion } from "framer-motion";

const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/Igreja+Casa+Da+Bencao/@-15.8712465,-48.0704318,15z/data=!4m6!3m5!1s0x935a32ad2f29b613:0x1adc8d6dfc71e5df!8m2!3d-15.8563574!4d-48.0797843!16s%2Fg%2F11cs01rnj5";

const infoCards = [
  { icon: MapPin, title: "Endereço", items: ["QS 610 — Samambaia Norte", "Brasília - DF, 72320-500", "Na avenida do HRSAM"] },
  { icon: Car, title: "Estacionamento", items: ["Estacionamento próprio", "Capacidade para 20 veículos", "Acesso fácil"] },
  { icon: Bus, title: "Transporte Público", items: ["Ponto de ônibus próximo à igreja", "Fácil acesso por transporte público"] },
];

const ComoChegar = () => {
  return (
    <Layout>
      <PageHero
        title="Como Chegar"
        subtitle="Todas as informações para você nos encontrar facilmente"
        image="/lovable-uploads/contato.jpg"
        imageAlt="Como chegar na ICB 610"
      />

      <section className="section-padding bg-background">
        <div className="container-church max-w-4xl">
          {/* Map */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl overflow-hidden shadow-md mb-6">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15350.884606274025!2d-48.0704318!3d-15.8712465!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a32ad2f29b613:0x1adc8d6dfc71e5df!2sIgreja%20Casa%20Da%20Bencao!5e0!3m2!1spt-BR!2sbr!4v1745341351430!5m2!1spt-BR!2sbr"
              width="100%"
              height="400"
              loading="lazy"
              className="w-full"
            />
          </motion.div>

          <div className="text-center mb-12">
            <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
              <Button className="btn-primary-warm text-base py-5 px-8 group">
                <Navigation className="mr-2 h-5 w-5" />
                Abrir no Google Maps
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </div>

          {/* Info Cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            {infoCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card-warm p-6">
                  <div className="w-10 h-10 rounded-xl bg-warm-100 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-church-gold" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-3">{card.title}</h3>
                  <ul className="space-y-1.5">
                    {card.items.map((item, j) => (
                      <li key={j} className="text-muted-foreground text-sm flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-church-gold flex-shrink-0 mt-1.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA with image overlay */}
      <section className="cta-section-overlay">
        <img src="/lovable-uploads/sobre_nos.png" alt="" className="cta-bg" />
        <div className="cta-overlay" />
        <div className="relative z-10 section-padding">
          <div className="container-church text-center max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="heading-display text-2xl md:text-3xl text-white mb-4">Nos vemos em breve!</h2>
              <p className="text-white/70 mb-8">
                Nosso culto principal é aos domingos às 18h30. Venha como está — estamos esperando por você.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ComoChegar;
