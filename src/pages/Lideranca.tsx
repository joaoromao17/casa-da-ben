import Layout from "@/components/layout/Layout";
import PageHero from "@/components/ui/PageHero";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Lideranca = () => {
  return (
    <Layout>
      <PageHero
        title="Liderança"
        subtitle="Conheça quem guia a nossa comunidade"
        image="/lovable-uploads/membros.JPG"
        imageAlt="Liderança ICB 610"
      />

      <section className="section-padding bg-background">
        <div className="container-church max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-warm-100 mx-auto mb-6 flex items-center justify-center overflow-hidden border-4 border-warm-200">
              <img
                src="/lovable-uploads/membros.JPG"
                alt="Pastor Marcial"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="heading-display text-2xl md:text-3xl text-foreground mb-1">Pastor Marcial</h2>
            <p className="text-church-gold font-medium text-sm uppercase tracking-wider mb-6">Pastor Titular</p>
            <div className="max-w-xl mx-auto text-left">
              <p className="text-muted-foreground leading-relaxed mb-4">
                O Pastor Marcial lidera a Igreja Casa da Benção 610 desde 2006, dando continuidade a uma história de fé que começou em 1992. Com dedicação e amor pela comunidade, ele conduz a igreja na missão de propagar o evangelho de Jesus Cristo.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Sob sua liderança, a ICB 610 continua comprometida com a adoração, o discipulado e o acolhimento de todos que buscam uma comunidade de fé verdadeira.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-warm-50 border border-warm-200 rounded-2xl p-6 md:p-8 text-center"
          >
            <blockquote className="font-display text-xl md:text-2xl italic text-foreground leading-relaxed mb-4">
              "Nossa missão é glorificar a Deus e formar discípulos comprometidos com Cristo."
            </blockquote>
            <p className="text-muted-foreground text-sm">— Missão da ICB 610</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-warm-50">
        <div className="container-church text-center max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="heading-display text-2xl md:text-3xl text-foreground mb-4">Venha nos Conhecer</h2>
            <p className="text-muted-foreground mb-8">Será um prazer receber você em nossa comunidade.</p>
            <Link to="/primeira-visita">
              <Button className="btn-primary-warm group">
                Planeje sua Visita <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Lideranca;
