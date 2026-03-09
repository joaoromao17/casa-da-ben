import Layout from "@/components/layout/Layout";
import PageHero from "@/components/ui/PageHero";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Heart, Cross, Sparkles, Globe, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const beliefs = [
  { icon: BookOpen, title: "A Bíblia Sagrada", text: "Cremos que a Bíblia é a Palavra de Deus, inspirada pelo Espírito Santo, infalível e suficiente como regra de fé e prática para toda a vida." },
  { icon: Sparkles, title: "A Trindade", text: "Cremos em um só Deus, eternamente existente em três pessoas: Pai, Filho e Espírito Santo, iguais em poder e glória." },
  { icon: Cross, title: "Jesus Cristo", text: "Cremos que Jesus Cristo é o Filho de Deus, nascido de uma virgem, que morreu pelos nossos pecados, ressuscitou e voltará." },
  { icon: Heart, title: "A Salvação", text: "Cremos que a salvação é pela graça, mediante a fé em Jesus Cristo. É um dom de Deus, não resultado de obras humanas." },
  { icon: Users, title: "A Igreja", text: "Cremos que a Igreja é o corpo de Cristo na terra, composta por todos os que creem Nele, chamada a adorar, servir e proclamar o evangelho." },
  { icon: Globe, title: "A Grande Comissão", text: "Cremos no chamado de levar o evangelho a todas as nações, fazendo discípulos e batizando em nome do Pai, do Filho e do Espírito Santo." },
];

const NoQueCremos = () => {
  return (
    <Layout>
      <PageHero
        title="No que Cremos"
        subtitle="Os fundamentos da nossa fé"
        image="/lovable-uploads/banner.png"
        imageAlt="No que cremos"
      />

      <section className="section-padding bg-background">
        <div className="container-church max-w-4xl">
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Nossa fé está firmada na Palavra de Deus. Estes são os pilares que guiam nossa igreja e nossa vida em comunidade.
          </motion.p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {beliefs.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="card-warm p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-warm-100 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-church-gold" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{b.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{b.text}</p>
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
              <h2 className="heading-display text-2xl md:text-3xl text-white mb-4">Quer saber mais?</h2>
              <p className="text-white/70 mb-8">
                Participe do Culto da Palavra às quintas-feiras às 20h ou entre em contato conosco.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/cultos">
                  <Button className="btn-primary-warm group">
                    Ver Horários <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
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

export default NoQueCremos;
