import Layout from "@/components/layout/Layout";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Mail, Clock, Target, Eye, Gem, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const galeria = [
  "/lovable-uploads/galeria1.jpg",
  "/lovable-uploads/galeria2.jpg",
  "/lovable-uploads/galeria3.jpg",
  "/lovable-uploads/galeria4.jpg",
  "/lovable-uploads/galeria5.jpg",
  "/lovable-uploads/galeria6.jpg",
];

const timeline = [
  { year: "1992", title: "Fundação", text: "A irmã Luzete, vinda de Paracatu (MG), iniciou cultos na casa da irmã Maria (Tia Quinha) em Samambaia Norte." },
  { year: "1990s", title: "Crescimento", text: "Com o crescimento das reuniões, o grupo alugou espaços maiores — lojas nas quadras 608 e 408, e um pequeno templo no lote da irmã Fátima." },
  { year: "2000s", title: "Construção do Templo", text: "A igreja se estabeleceu definitivamente na QS 610 com a construção do templo atual sob a liderança da pastora Luzete e Pastor Joaquim." },
  { year: "2006", title: "Nova Liderança", text: "O Pastor Marcial assumiu a liderança da igreja e permanece no cargo até os dias de hoje, conduzindo a comunidade com dedicação." },
];

const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/Igreja+Casa+Da+Bencao/@-15.8712465,-48.0704318,15z/data=!4m6!3m5!1s0x935a32ad2f29b613:0x1adc8d6dfc71e5df!8m2!3d-15.8563574!4d-48.0797843!16s%2Fg%2F11cs01rnj5";

const Sobre = () => {
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  return (
    <Layout>
      <PageHero
        title="Sobre Nós"
        subtitle="Conheça a história, valores e missão da Igreja Casa da Benção"
        image="/lovable-uploads/sobre_nos.png"
        imageAlt="Igreja Casa da Benção"
      />

      <section className="section-padding bg-background">
        <div className="container-church">
          <Tabs defaultValue="historia" className="w-full">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-10 h-14 bg-warm-100 rounded-xl p-1.5">
              <TabsTrigger value="historia" className="rounded-lg text-base font-medium data-[state=active]:bg-card data-[state=active]:border-b-2 data-[state=active]:border-church-gold data-[state=active]:text-foreground data-[state=active]:font-semibold transition-all">
                História
              </TabsTrigger>
              <TabsTrigger value="localizacao" className="rounded-lg text-base font-medium data-[state=active]:bg-card data-[state=active]:border-b-2 data-[state=active]:border-church-gold data-[state=active]:text-foreground data-[state=active]:font-semibold transition-all">
                Localização
              </TabsTrigger>
              <TabsTrigger value="galeria" className="rounded-lg text-base font-medium data-[state=active]:bg-card data-[state=active]:border-b-2 data-[state=active]:border-church-gold data-[state=active]:text-foreground data-[state=active]:font-semibold transition-all">
                Galeria
              </TabsTrigger>
            </TabsList>

            {/* History Tab */}
            <TabsContent value="historia">
              <div className="max-w-3xl mx-auto">
                <SectionHeading title="Nossa História" subtitle="Uma jornada de fé desde 1992" />

                {/* Timeline */}
                <div className="relative">
                  <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-warm-200 md:-translate-x-px" />
                  {timeline.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className={`relative flex items-start gap-6 mb-10 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                    >
                      <div className="hidden md:block md:w-1/2" />
                      <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-church-gold border-2 border-card -translate-x-1/2 mt-1.5 z-10" />
                      <div className="ml-10 md:ml-0 md:w-1/2 bg-card border border-warm-200 rounded-2xl p-5 md:p-6">
                        <span className="text-church-gold font-display text-2xl font-bold">{item.year}</span>
                        <h3 className="text-lg font-semibold text-foreground mt-1">{item.title}</h3>
                        <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{item.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Mission / Vision / Values */}
                <div className="grid sm:grid-cols-3 gap-4 mt-16">
                  {[
                    { icon: Target, title: "Missão", text: "Glorificar a Deus através da adoração, evangelização, discipulado, comunhão e serviço." },
                    { icon: Eye, title: "Visão", text: "Ser uma igreja que impacta vidas e transforma a comunidade através do evangelho de Cristo." },
                    { icon: Gem, title: "Valores", text: "Fidelidade à Palavra, compromisso com a oração, excelência no serviço, amor e comunhão." },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="card-warm p-6 text-center"
                    >
                      <div className="w-12 h-12 rounded-xl bg-warm-100 flex items-center justify-center mx-auto mb-4">
                        <item.icon className="w-6 h-6 text-church-gold" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Location Tab */}
            <TabsContent value="localizacao">
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h2 className="heading-display text-2xl text-foreground mb-6">Onde Estamos</h2>
                      <div className="space-y-5">
                        {[
                          { icon: MapPin, title: "Endereço", lines: ["QS 610 — Samambaia Norte", "Brasília - DF, 72320-500"] },
                          { icon: Mail, title: "E-mail", lines: ["icbcasadabencao610@gmail.com"] },
                        ].map((info, i) => (
                          <div key={i} className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-warm-100 flex items-center justify-center flex-shrink-0">
                              <info.icon className="w-5 h-5 text-church-gold" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{info.title}</h3>
                              {info.lines.map((l, j) => (
                                <p key={j} className="text-muted-foreground text-sm break-all">{l}</p>
                              ))}
                            </div>
                          </div>
                        ))}
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-warm-100 flex items-center justify-center flex-shrink-0">
                            <Clock className="w-5 h-5 text-church-gold" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground mb-2">Horários de Culto</h3>
                            <div className="space-y-1.5 text-sm text-muted-foreground">
                              <div className="flex justify-between gap-4"><span>Domingo — Culto da Família</span><span className="font-medium text-foreground">18h30</span></div>
                              <div className="flex justify-between gap-4"><span>Terça — Reunião de Oração</span><span className="font-medium text-foreground">20h</span></div>
                              <div className="flex justify-between gap-4"><span>Quarta — Escola Bíblica</span><span className="font-medium text-foreground">20h</span></div>
                              <div className="flex justify-between gap-4"><span>Sexta — Culto de Libertação</span><span className="font-medium text-foreground">20h</span></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl overflow-hidden shadow-md h-56 md:h-72">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15350.884606274025!2d-48.0704318!3d-15.8712465!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a32ad2f29b613:0x1adc8d6dfc71e5df!2sIgreja%20Casa%20Da%20Bencao!5e0!3m2!1spt-BR!2sbr!4v1745341351430!5m2!1spt-BR!2sbr"
                        width="100%"
                        height="100%"
                        loading="lazy"
                        className="w-full h-full"
                      />
                    </div>
                    <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
                      <Button className="btn-primary-warm w-full">
                        Abrir no Google Maps
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="galeria">
              <SectionHeading title="Nossa Galeria" subtitle="Momentos especiais da nossa igreja ao longo dos anos" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {galeria.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="aspect-[4/3] overflow-hidden rounded-2xl cursor-pointer group ring-1 ring-warm-100 shadow-sm hover:shadow-lg transition-shadow duration-300"
                    onClick={() => setLightboxImg(img)}
                  >
                    <img
                      src={img}
                      alt={`Foto da Igreja ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA with image overlay */}
      <section className="cta-section-overlay">
        <img src="/lovable-uploads/banner.png" alt="" className="cta-bg" />
        <div className="cta-overlay" />
        <div className="relative z-10 section-padding">
          <div className="container-church text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto">
              <h2 className="heading-display text-3xl md:text-4xl text-white mb-4">Venha nos Visitar</h2>
              <p className="text-white/70 mb-8">
                Estamos esperando por você! Venha participar dos nossos cultos e conhecer nossa comunidade.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/cultos">
                  <Button className="btn-primary-warm">Horários de Culto</Button>
                </Link>
                <Link to="/contato">
                  <Button className="btn-outline-warm">Fale Conosco</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <Dialog open={!!lightboxImg} onOpenChange={() => setLightboxImg(null)}>
        <DialogContent className="max-w-3xl p-1 bg-transparent border-none shadow-none">
          {lightboxImg && (
            <img src={lightboxImg} alt="Galeria" className="w-full h-auto rounded-xl" />
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Sobre;
