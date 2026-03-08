import Layout from "@/components/layout/Layout";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceCard from "@/components/ui/ServiceCard";
import { Button } from "@/components/ui/button";
import { Church, HandHelping, BookOpen, Link2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/Igreja+Casa+Da+Bencao/@-15.8712465,-48.0704318,15z/data=!4m6!3m5!1s0x935a32ad2f29b613:0x1adc8d6dfc71e5df!8m2!3d-15.8563574!4d-48.0797843!16s%2Fg%2F11cs01rnj5";

const Cultos = () => {
  return (
    <Layout>
      <PageHero
        title="Horários de Culto"
        subtitle="Venha adorar e buscar a Deus conosco. Todos são bem-vindos!"
        image="/lovable-uploads/banner.png"
        imageAlt="Cultos ICB 610"
      />

      <section className="section-padding bg-warm-50">
        <div className="container-church">
          <SectionHeading
            title="Nossos Encontros Semanais"
            subtitle="Cada momento é uma oportunidade de crescer na fé e na comunhão"
          />
          <div className="grid sm:grid-cols-2 gap-4 md:gap-5 max-w-3xl mx-auto">
            <ServiceCard day="Domingo" time="18h30" title="Culto da Família" description="Culto principal da semana. Um momento especial de adoração, palavra e comunhão para toda a família." icon={Church} featured index={0} />
            <ServiceCard day="Terça-feira" time="20h" title="Reunião de Oração" description="Momento de intercessão e busca pela presença de Deus." icon={HandHelping} index={1} />
            <ServiceCard day="Quarta-feira" time="20h" title="Escola Bíblica" description="Estudo aprofundado da Palavra de Deus para crescimento espiritual." icon={BookOpen} index={2} />
            <ServiceCard day="Sexta-feira" time="20h" title="Culto de Libertação" description="Todos são bem-vindos. Venha como está. Não precisa agendar." icon={Link2} index={3} />
          </div>
        </div>
      </section>

      {/* CTA with overlay */}
      <section className="cta-section-overlay">
        <img src="/lovable-uploads/sobre_nos.png" alt="" className="cta-bg" />
        <div className="cta-overlay" />
        <div className="relative z-10 section-padding">
          <div className="container-church">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto text-center">
              <h2 className="heading-display text-2xl md:text-3xl text-white mb-4">
                Esperamos você neste domingo
              </h2>
              <p className="text-white/70 mb-8 max-w-lg mx-auto">
                Será um prazer receber você e sua família. Nossa igreja está de portas abertas para todos que desejam conhecer o amor de Deus.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
                  <Button className="btn-primary-warm group">
                    Como Chegar <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
                <Link to="/contato">
                  <Button className="btn-outline-warm">Fale Conosco</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Cultos;
