import Layout from "@/components/layout/Layout";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/button";
import { Music, Baby, Flame, Heart, HandHelping, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ministerios = [
  { icon: Music, name: "Louvor e Adoração", desc: "Nosso ministério de louvor conduz a igreja na adoração ao Senhor através da música e dos cânticos espirituais." },
  { icon: Baby, name: "Crianças", desc: "Um espaço especial dedicado ao ensino bíblico e ao cuidado das crianças durante os cultos." },
  { icon: Flame, name: "Jovens", desc: "Atividades e encontros voltados para o crescimento espiritual e a comunhão entre os jovens da igreja." },
  { icon: Heart, name: "Mulheres", desc: "Reuniões e momentos de edificação, oração e comunhão entre as mulheres da comunidade." },
  { icon: HandHelping, name: "Intercessão", desc: "Dedicado à oração e intercessão pela igreja, famílias e pela comunidade." },
];

const MinisteriosPage = () => {
  return (
    <Layout>
      <PageHero
        title="Ministérios"
        subtitle="Cada membro é parte essencial do corpo de Cristo"
        image="/lovable-uploads/galeria3.jpg"
        imageAlt="Ministérios ICB 610"
      />

      <section className="section-padding bg-background">
        <div className="container-church max-w-4xl">
          <SectionHeading title="Nossos Ministérios" subtitle="Conheça as áreas de atuação da nossa igreja" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {ministerios.map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="card-warm p-6">
                  <div className="w-12 h-12 rounded-xl bg-warm-100 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-church-gold" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{m.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{m.desc}</p>
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
              <h2 className="heading-display text-2xl md:text-3xl text-white mb-4">Quer fazer parte?</h2>
              <p className="text-white/70 mb-8">
                Se você deseja servir e contribuir com a obra de Deus, venha conversar conosco. Há um lugar para você!
              </p>
              <Link to="/contato">
                <Button className="btn-primary-warm group">
                  Fale Conosco <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MinisteriosPage;
