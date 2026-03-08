import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import InfoBar from "@/components/ui/InfoBar";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceCard from "@/components/ui/ServiceCard";
import FeatureHighlight from "@/components/ui/FeatureHighlight";
import { Instagram, ArrowRight, Heart, Users, Calendar, Church, HandHelping, BookOpen, Link2 } from "lucide-react";
import { motion } from "framer-motion";

const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/Igreja+Casa+Da+Bencao/@-15.8712465,-48.0704318,15z/data=!4m6!3m5!1s0x935a32ad2f29b613:0x1adc8d6dfc71e5df!8m2!3d-15.8563574!4d-48.0797843!16s%2Fg%2F11cs01rnj5";

const Home = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 overlay-warm z-10" />
        <div className="relative h-[85vh] min-h-[540px] md:h-[90vh]">
          <img
            src="/lovable-uploads/banner.png"
            alt="Igreja Casa da Benção 610"
            className="w-full h-full object-cover animate-slow-zoom"
          />
          <div className="absolute inset-0 flex items-center z-20">
            <div className="container-church">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl"
              >
                <h1 className="heading-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] mb-4">
                  Igreja Casa da{" "}
                  <span className="text-church-goldLight">Benção</span> 610
                </h1>
                <p className="text-lg md:text-xl text-white/75 font-light italic mb-8 max-w-lg">
                  "Somos uma família para pertencer"
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
                    <Button className="btn-primary-warm text-base py-6 px-8">
                      Visite-nos
                    </Button>
                  </a>
                  <Link to="/cultos">
                    <Button className="btn-outline-warm text-base py-6 px-8">
                      Ver Horários
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Bar */}
      <InfoBar />

      {/* Welcome Section */}
      <section className="section-padding bg-background">
        <div className="container-church">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="heading-display text-3xl md:text-4xl text-foreground mb-5">
                Bem-vindo à Família <span className="text-church-gold">ICB 610</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Somos uma igreja comprometida com a propagação do evangelho de Jesus Cristo e o
                desenvolvimento espiritual de cada membro. Nossa missão é impactar vidas através
                do amor de Deus e da mensagem transformadora da cruz.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Queremos que você faça parte da nossa família. Aqui, você encontrará um ambiente
                acolhedor para crescer na fé e desenvolver seus dons e talentos para o Reino de Deus.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <FeatureHighlight icon={Heart} text="Ambiente acolhedor" index={0} />
                <FeatureHighlight icon={Calendar} text="Cultos semanais" index={1} />
                <FeatureHighlight icon={Users} text="Família para pertencer" index={2} />
              </div>

              <Link to="/sobre">
                <Button variant="outline" className="border-warm-300 text-foreground hover:bg-warm-50 font-medium group">
                  Conheça Nossa História
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              <div className="absolute -inset-3 bg-warm-200/40 rounded-3xl -rotate-2" />
              <img
                alt="Membros da Igreja Casa da Benção"
                className="relative rounded-2xl shadow-xl w-full h-auto object-cover"
                src="/lovable-uploads/bem_vindo.jpg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Word for You — tighter padding */}
      <section className="py-12 md:py-20 bg-warm-50">
        <div className="container-church max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-church-gold font-semibold mb-4">Uma palavra para você</p>
            <p className="text-muted-foreground text-sm mb-8 max-w-md mx-auto">
              Que esta passagem inspire e fortaleça sua caminhada de fé.
            </p>
            <blockquote className="font-display text-2xl md:text-3xl lg:text-[2rem] leading-relaxed text-foreground italic mb-6">
              "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna."
            </blockquote>
            <p className="text-church-gold font-semibold text-lg">João 3:16</p>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-background">
        <div className="container-church">
          <SectionHeading
            title="Nossos Cultos"
            subtitle="Venha nos visitar e experimentar a presença de Deus em nossos encontros"
          />
          <div className="grid sm:grid-cols-2 gap-4 md:gap-5 max-w-3xl mx-auto">
            <ServiceCard day="Domingo" time="18h30" title="Culto da Família" description="Culto principal da semana. Venha como está." icon={Church} featured index={0} />
            <ServiceCard day="Terça-feira" time="20h" title="Reunião de Oração" description="Momento de oração e intercessão." icon={HandHelping} index={1} />
            <ServiceCard day="Quarta-feira" time="20h" title="Escola Bíblica" description="Estudo bíblico para crescimento espiritual." icon={BookOpen} index={2} />
            <ServiceCard day="Sexta-feira" time="20h" title="Culto de Libertação" description="Todos são bem-vindos. Não precisa agendar." icon={Link2} index={3} />
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-10">
            <Link to="/como-chegar">
              <Button className="btn-primary-warm group">
                Como Chegar
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* First Visit Preview — tighter padding */}
      <section className="py-12 md:py-20 bg-warm-50">
        <div className="container-church">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 className="heading-display text-3xl md:text-4xl text-foreground mb-4">
                Primeira vez na <span className="text-church-gold">ICB 610</span>?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Sabemos que visitar uma igreja pela primeira vez pode gerar dúvidas. Preparamos tudo para você se sentir em casa.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto mb-8">
                {["Venha como está, sem formalidade", "Não precisa agendar", "Crianças são muito bem-vindas", "Estacionamento disponível"].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-2.5 text-sm text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-church-gold flex-shrink-0" />
                    {item}
                  </motion.div>
                ))}
              </div>
              <Link to="/primeira-visita">
                <Button variant="outline" className="border-warm-300 text-foreground hover:bg-warm-100 group">
                  Saiba mais sobre sua primeira visita
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Instagram / Life at Church */}
      <section className="section-padding bg-background">
        <div className="container-church">
          <SectionHeading
            title="A vida na ICB 610"
            subtitle="Acompanhe nosso dia a dia no Instagram"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { src: "/lovable-uploads/galeria1.jpg", aspect: "aspect-[4/5]" },
              { src: "/lovable-uploads/galeria2.jpg", aspect: "aspect-square" },
              { src: "/lovable-uploads/galeria3.jpg", aspect: "aspect-square" },
              { src: "/lovable-uploads/galeria4.jpg", aspect: "aspect-[4/5]" },
            ].map((img, i) => (
              <motion.a
                key={i}
                href="https://www.instagram.com/icb_610/"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`${img.aspect} overflow-hidden rounded-2xl group relative ring-1 ring-warm-200 shadow-md hover:shadow-lg transition-shadow duration-300`}
              >
                <img
                  src={img.src}
                  alt={`Vida na ICB 610 ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <Instagram className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                </div>
              </motion.a>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href="https://www.instagram.com/icb_610/" target="_blank" rel="noopener noreferrer">
              <Button className="bg-foreground text-background hover:bg-foreground/90 font-medium px-6 py-5 rounded-xl group">
                <Instagram className="mr-2 h-5 w-5" />
                Siga @icb_610
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-section-overlay">
        <img src="/lovable-uploads/sobre_nos.png" alt="" className="cta-bg" />
        <div className="cta-overlay" />
        <div className="relative z-20 section-padding-lg">
          <div className="container-church text-center">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="max-w-2xl mx-auto">
              <h2 className="heading-display text-3xl md:text-4xl lg:text-5xl text-white mb-4">
                Sua primeira visita começa aqui
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-lg mx-auto">
                Venha nos conhecer neste domingo. Estamos esperando por você e sua família de braços abertos.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
                  <Button className="btn-primary-warm text-base py-6 px-8">Como Chegar</Button>
                </a>
                <Link to="/contato">
                  <Button className="btn-outline-warm text-base py-6 px-8">Fale Conosco</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
