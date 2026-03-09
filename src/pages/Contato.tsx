import Layout from "@/components/layout/Layout";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Clock, Instagram, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/Igreja+Casa+Da+Bencao/@-15.8712465,-48.0704318,15z/data=!4m6!3m5!1s0x935a32ad2f29b613:0x1adc8d6dfc71e5df!8m2!3d-15.8563574!4d-48.0797843!16s%2Fg%2F11cs01rnj5";

const contactItems = [
  { icon: MapPin, title: "Endereço", content: "QS 610 — Samambaia Norte, Brasília - DF", action: { label: "Ver no mapa", href: GOOGLE_MAPS_URL } },
  { icon: Instagram, title: "Instagram", content: "@icb_610", action: { label: "Seguir", href: "https://www.instagram.com/icb_610/" } },
  { icon: Mail, title: "E-mail", content: "icbcasadabencao610@gmail.com", action: { label: "Enviar e-mail", href: "mailto:icbcasadabencao610@gmail.com" } },
  { icon: Clock, title: "Horários de Culto", content: "Dom 20h · Ter 20h · Qui 20h", action: { label: "Ver detalhes", to: "/cultos" } },
];

const faqItems = [
  { q: "Quais são os horários dos cultos?", a: "Nossos cultos acontecem aos domingos às 18h30 e às terças, quartas e sextas às 20h." },
  { q: "A igreja possui estacionamento?", a: "Sim, possuímos estacionamento próprio com capacidade para 20 veículos." },
];

const Contato = () => {
  return (
    <Layout>
      <PageHero
        title="Entre em Contato"
        subtitle="Estamos aqui para responder suas perguntas. Não hesite em nos procurar."
        image="/lovable-uploads/contato.jpg"
        imageAlt="Contato ICB 610"
      />

      <section className="section-padding bg-background">
        <div className="container-church">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Contact Cards */}
            <div className="space-y-4">
              {contactItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="card-warm p-6 flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-warm-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-church-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                      <p className="text-muted-foreground text-sm mt-0.5 break-all">{item.content}</p>
                      {item.action.href ? (
                        <a href={item.action.href} target="_blank" rel="noopener noreferrer" className="text-church-gold text-sm font-medium mt-1.5 inline-flex items-center gap-1 hover:underline">
                          {item.action.label} <ArrowRight className="w-3 h-3" />
                        </a>
                      ) : item.action.to ? (
                        <Link to={item.action.to} className="text-church-gold text-sm font-medium mt-1.5 inline-flex items-center gap-1 hover:underline">
                          {item.action.label} <ArrowRight className="w-3 h-3" />
                        </Link>
                      ) : null}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Photo + Message */}
            <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="space-y-6">
              <div className="relative">
                <div className="absolute -inset-2 bg-warm-200/30 rounded-3xl rotate-1" />
                <img src="/lovable-uploads/contato.jpg" alt="Igreja Casa da Benção" className="relative rounded-2xl shadow-lg w-full h-auto object-cover" />
              </div>
              <div className="bg-warm-50 rounded-2xl p-6 border border-warm-200">
                <h3 className="font-semibold text-foreground mb-2">Venha nos visitar!</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Não há nada como estar na presença de Deus junto com irmãos. Nossa igreja está de portas abertas para receber você e sua família.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-warm-50 py-12">
        <div className="container-church max-w-4xl">
          <div className="rounded-2xl overflow-hidden shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15350.884606274025!2d-48.0704318!3d-15.8712465!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a32ad2f29b613:0x1adc8d6dfc71e5df!2sIgreja%20Casa%20Da%20Bencao!5e0!3m2!1spt-BR!2sbr!4v1745341351430!5m2!1spt-BR!2sbr"
              width="100%"
              height="350"
              loading="lazy"
              className="w-full"
            />
          </div>
          <div className="text-center mt-6">
            <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
              <Button className="btn-primary-warm group">
                Abrir no Google Maps <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ — Accordion */}
      <section className="section-padding bg-background">
        <div className="container-church max-w-3xl">
          <SectionHeading title="Perguntas Frequentes" />
          <Accordion type="single" collapsible className="space-y-3">
            {faqItems.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="card-warm px-6 border-none">
                <AccordionTrigger className="text-foreground font-semibold text-sm hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA with image overlay */}
      <section className="cta-section-overlay">
        <img src="/lovable-uploads/sobre_nos.png" alt="" className="cta-bg" />
        <div className="cta-overlay" />
        <div className="relative z-10 section-padding">
          <div className="container-church text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-xl mx-auto">
              <h2 className="heading-display text-3xl text-white mb-4">Venha nos Visitar</h2>
              <p className="text-white/70 mb-8">Será um prazer receber você e sua família em nossa comunidade.</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/cultos">
                  <Button className="btn-primary-warm">Ver Horários dos Cultos</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contato;
