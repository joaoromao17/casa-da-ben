import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { MapPin, Phone, Mail, Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

// Dados simulados da galeria
const galeria = ["/lovable-uploads/galeria1.jpg", "/lovable-uploads/galeria2.jpg", "/lovable-uploads/galeria3.jpg", "/lovable-uploads/galeria4.jpg", "/lovable-uploads/galeria5.jpg", "/lovable-uploads/galeria6.jpg"];

// Imagens para o carrossel da história
const historicoImagens = [
  "/lovable-uploads/carrossel1.jpg",
  "/lovable-uploads/carrossel2.jpg",
  "/lovable-uploads/carrossel3.jpg",
  "/lovable-uploads/carrossel4.jpg",
  "/lovable-uploads/carrossel5.jpg"
];

const Sobre = () => {
  const isMobile = useIsMobile();
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-church-900/70 to-church-800/70 z-10"></div>
        <div className="relative h-[40vh] min-h-[300px]">
          <img src="/lovable-uploads/sobre_nos.png" alt="Igreja Casa da Benção" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center z-20">
            <div className="container-church text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Sobre Nós
              </h1>
              <p className="text-xl md:text-2xl max-w-2xl">
                Conheça a história, valores e missão da Igreja Casa da Benção
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs de Conteúdo */}
      <section className="py-12 bg-white">
        <div className="container-church">
          <Tabs defaultValue="historia" className="w-full">
            <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3' : 'max-w-2xl mx-auto grid-cols-3'} mb-6`}>
              <TabsTrigger value="historia" className={isMobile ? 'text-xs px-2' : ''}>História</TabsTrigger>
              <TabsTrigger value="localizacao" className={isMobile ? 'text-xs px-2' : ''}>Localização</TabsTrigger>
              <TabsTrigger value="galeria" className={isMobile ? 'text-xs px-2' : ''}>Galeria</TabsTrigger>
            </TabsList>

            {/* Aba de História */}
            <TabsContent value="historia">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-church-900 mb-6">Nossa História</h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      A história da Igreja Casa da Bênção 610 começou no ano de 1992 com a irmã Luzete, vinda de Paracatu (MG), que iniciou cultos na casa da irmã Maria (Tia Quinha) em Samambaia Norte. Com o crescimento das reuniões, surgiu a necessidade de alugar um espaço maior para acomodar os fiéis.
                    </p>
                    <p>
                      O grupo passou por diferentes locais: lojas nas quadras 608 e 408, e até mesmo um pequeno templo no lote da irmã Fátima. Sob a liderança da evangelista Luzete e do obreiro Joaquim, a igreja cresceu rapidamente através de cultos de cura e libertação.
                    </p>
                    <p>
                      O ministério foi se fortalecendo com a chegada de novos membros e com isso surgiu a necessidade de consagrar novos obreiros como os irmãos Ari, João e a evangelista Zumira.                   </p>
                    <p>
                      Após um período no prédio da 408, a igreja se estabeleceu definitivamente na QS 610 Norte, com a construção do templo atual sob a liderança da pastora Luzete.
                    </p>
                    <p>
                      Posteriormente o pastor Nogueira assumiu e realizou melhorias na estrutura. Em seguida, o pastor Marcial assumiu a liderança e ampliou a igreja. Em 2025, o ministério do Pr. Marcial completou 19 anos à frente da igreja.
                    </p>
                  </div>
                </div>
                <div className="space-y-8">
                  {/* Carrossel de imagens históricas */}
                  <div className="relative">
                    <Carousel className="w-full max-w-xl mx-auto" showDots={true}>
                      <CarouselContent>
                        {historicoImagens.map((imagem, index) => (
                          <CarouselItem key={index}>
                            <div className="p-1">
                              <Card>
                                <CardContent className="flex aspect-video items-center justify-center p-0">
                                  <img
                                    src={imagem}
                                    alt={`História da Igreja ${index + 1}`}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                </CardContent>
                              </Card>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      {!isMobile && (
                        <>
                          <CarouselPrevious />
                          <CarouselNext />
                        </>
                      )}
                    </Carousel>
                  </div>

                  <div className="bg-church-50 p-6 rounded-lg border border-church-100">
                    <h3 className="text-xl font-semibold text-church-800 mb-3">Nossa Missão</h3>
                    <p className="text-gray-700 mb-4">
                      Glorificar a Deus através da adoração, evangelização, discipulado, comunhão e serviço, formando discípulos comprometidos com Cristo.
                    </p>

                    <h3 className="text-xl font-semibold text-church-800 mb-3">Nossa Visão</h3>
                    <p className="text-gray-700 mb-4">
                      Ser uma igreja que impacta vidas e transforma a comunidade através do evangelho de Cristo, formando líderes e multiplicando discípulos.
                    </p>

                    <h3 className="text-xl font-semibold text-church-800 mb-3">Nossos Valores</h3>
                    <ul className="list-disc pl-5 text-gray-700">
                      <li>Fidelidade à Palavra de Deus</li>
                      <li>Compromisso com a oração</li>
                      <li>Excelência no serviço ao Senhor</li>
                      <li>Relacionamentos de amor e comunhão</li>
                      <li>Mordomia dos recursos e talentos</li>
                      <li>Evangelismo e missões</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Aba de Localização */}
            <TabsContent value="localizacao">
              <div className={`${isMobile ? 'space-y-6' : 'grid md:grid-cols-2 gap-12'}`}>
                <div className={isMobile ? 'order-2' : ''}>
                  <h2 className="text-3xl font-bold text-church-900 mb-6">Onde Estamos</h2>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-6 w-6 text-church-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg text-church-800">Endereço</h3>
                        <p className="text-gray-700">QS 610 - Samambaia Norte</p>
                        <p className="text-gray-700">Brasília - DF, 72320-500</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Mail className="h-6 w-6 text-church-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg text-church-800">E-mail</h3>
                        <p className="text-gray-700">icbcasadabencao610@gmail.com</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Clock className="h-6 w-6 text-church-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg text-church-800">Horário de Atendimento</h3>
                        <p className="text-gray-700">Segunda a Sexta: 9h às 17h</p>
                        <p className="text-gray-700">Sábado: 9h às 12h</p>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="font-semibold text-lg text-church-800 mb-3">Horários de Culto</h3>
                      <div className={`${isMobile ? 'space-y-2' : 'space-y-3'} text-gray-700`}>
                        <div className={`flex justify-between ${isMobile ? 'border-b pb-1 text-sm' : 'border-b pb-2'}`}>
                          <span className="font-medium">Domingo - Culto da Família:</span>
                          <span>18:30</span>
                        </div>
                        <div className={`flex justify-between ${isMobile ? 'border-b pb-1 text-sm' : 'border-b pb-2'}`}>
                          <span className="font-medium">Terça-feira - Oração:</span>
                          <span>20:00</span>
                        </div>
                        <div className={`flex justify-between ${isMobile ? 'border-b pb-1 text-sm' : 'border-b pb-2'}`}>
                          <span className="font-medium">Quarta-feira - Escola Bíblica:</span>
                          <span>20:00</span>
                        </div>
                        <div className={`flex justify-between ${isMobile ? 'border-b pb-1 text-sm' : 'border-b pb-2'}`}>
                          <span className="font-medium">Sexta-feira - Culto de Libertação:</span>
                          <span>20:00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`space-y-8 ${isMobile ? 'order-1' : ''}`}>
                  <div className={`rounded-lg overflow-hidden shadow-lg ${isMobile ? 'h-48' : 'h-80'}`}>
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15350.884606274025!2d-48.0704318!3d-15.8712465!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a32ad2f29b613:0x1adc8d6dfc71e5df!2sIgreja%20Casa%20Da%20Bencao!5e0!3m2!1spt-BR!2sbr!4v1745341351430!5m2!1spt-BR!2sbr" 
                      width="100%" 
                      height="100%" 
                      loading="lazy"
                      className="w-full h-full"
                    />
                  </div>

                  <div className={`bg-church-50 ${isMobile ? 'p-4' : 'p-6'} rounded-lg border border-church-100`}>
                    <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-church-800 mb-3`}>Como Chegar</h3>
                    <p className={`text-gray-700 ${isMobile ? 'text-sm mb-3' : 'mb-4'}`}>Nossa igreja está localizada na avenida do HRSAM</p>

                    <h4 className={`font-medium text-church-700 ${isMobile ? 'text-sm mb-1' : 'mb-2'}`}>Transporte Público:</h4>
                    <ul className={`list-disc pl-5 text-gray-700 ${isMobile ? 'text-xs mb-3' : 'mb-4'}`}>
                      <li>Ônibus: Linhas 0.373, 0.366 e 0.391</li>
                      <li>Ponto de ônibus a 30m da igreja</li>
                    </ul>

                    <h4 className={`font-medium text-church-700 ${isMobile ? 'text-sm mb-1' : 'mb-2'}`}>De Carro:</h4>
                    <ul className={`list-disc pl-5 text-gray-700 ${isMobile ? 'text-xs mb-3' : 'mb-4'}`}>
                      <li>Estacionamento próprio com 30 vagas</li>
                    </ul>
                    <a href="https://www.google.com/maps/place/Igreja+Casa+Da+Bencao/@-15.8712465,-48.0704318,15z/data=!4m6!3m5!1s0x935a32ad2f29b613:0x1adc8d6dfc71e5df!8m2!3d-15.8563574!4d-48.0797843!16s%2Fg%2F11cs01rnj5?entry=ttu&g_ep=EgoyMDI1MDQxNi4xIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D" target="_blank">
                      <Button className={`w-full ${isMobile ? 'text-sm py-2' : ''}`}>
                        Abrir no Google Maps
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Aba de Galeria */}
            <TabsContent value="galeria">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-church-900 mb-4">Nossa Galeria</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Momentos especiais da nossa igreja ao longo dos anos
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {galeria.map((imagem, index) => (
                  <div key={index} className="overflow-hidden rounded-lg shadow-md group">
                    <img src={imagem} alt={`Foto da Igreja ${index + 1}`} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <a href="https://drive.google.com/drive/folders/1-7c8j9A9urrFsOtD_8tBx3e5AOD-9ybY?usp=sharing" target="_blank">
                  <Button className="btn-primary">
                    Ver Mais Fotos
                  </Button>
                </a>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-church-600 text-white">
        <div className="container-church text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Venha nos Visitar</h2>
          <p className="text-xl text-church-100 max-w-3xl mx-auto mb-10">
            Estamos esperando por você! Venha participar dos nossos cultos e conhecer nossa comunidade.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/cultos">
              <Button className="bg-white text-black hover:bg-black hover:text-white transition-colors text-lg py-6 px-8">
                Horários de Culto
              </Button>
            </Link>
            <Link to="/contato">
              <Button variant="outline" className="bg-white text-black hover:bg-black hover:text-white border-white transition-colors text-lg py-6 px-8">
                Fale Conosco
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Sobre;
