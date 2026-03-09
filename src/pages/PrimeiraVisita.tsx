import Layout from "@/components/layout/Layout";
import PageHero from "@/components/ui/PageHero";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Shirt, Baby, Car, HandHeart, Users, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const faqs = [
  { icon: Clock, q: "Quanto tempo dura um culto?", a: "Nossos cultos duram em média 1h30. O culto de domingo começa às 20h." },
  { icon: Shirt, q: "O que vestir?", a: "Venha como está! Não há código de vestimenta. O importante é você se sentir confortável." },
  { icon: Baby, q: "Posso ir com crianças?", a: "Sim! Crianças são muito bem-vindas. Temos um espaço dedicado para os pequenos." },
  { icon: Car, q: "Tem estacionamento?", a: "Sim, possuímos estacionamento próprio com capacidade para 20 veículos." },
  { icon: HandHeart, q: "Precisa agendar?", a: "Não é necessário agendar. Basta chegar e você será recebido com carinho." },
  { icon: Users, q: "Onde sentar?", a: "Fique à vontade para escolher qualquer lugar. Se precisar de ajuda, alguém estará disponível para orientar." },
  { icon: MapPin, q: "Como chegar?", a: "Estamos na QS 610, Samambaia Norte, DF. Há ponto de ônibus próximo à igreja." },
  { icon: HandHeart, q: "Todos são bem-vindos?", a: "Absolutamente! Independente de quem você seja ou de onde venha, há um lugar para você aqui." },
];

const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/Igreja+Casa+Da+Bencao/@-15.8712465,-48.0704318,15z/data=!4m6!3m5!1s0x935a32ad2f29b613:0x1adc8d6dfc71e5df!8m2!3d-15.8563574!4d-48.0797843!16s%2Fg%2F11cs01rnj5";

const PrimeiraVisita = () => {
  return (
    <Layout>
      <PageHero
        title="Sua Primeira Visita"
        subtitle="Tudo o que você precisa saber para se sentir em casa"
        image="/lovable-uploads/bem_vindo.jpg"
        imageAlt="Primeira visita na ICB 610"
      />

      <section className="section-padding bg-background">
        <div className="container-church max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="heading-display text-3xl text-foreground mb-4">
              O que esperar na sua primeira visita
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Sabemos que visitar uma igreja pela primeira vez pode gerar dúvidas. Queremos que você se sinta acolhido desde o primeiro momento.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {faqs.map((faq, i) => {
              const Icon = faq.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="card-warm p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-warm-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-church-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{faq.q}</h3>
                      <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA with image overlay */}
      <section className="cta-section-overlay">
        <img src="/lovable-uploads/banner.png" alt="" className="cta-bg" />
        <div className="cta-overlay" />
        <div className="relative z-10 section-padding">
          <div className="container-church text-center max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="heading-display text-2xl md:text-3xl text-white mb-4">
                Estamos esperando por você
              </h2>
              <p className="text-white/70 mb-8">
                Venha nos conhecer neste domingo às 18h30. Não precisa agendar — basta chegar!
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
                  <Button className="btn-primary-warm group">
                    Como Chegar <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
                <Link to="/cultos">
                  <Button className="btn-outline-warm">Ver Horários</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PrimeiraVisita;
