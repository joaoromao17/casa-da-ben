import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Phone, Mail, Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

// Dados simulados dos líderes
const lideranca = [{
  nome: "Pr. João Silva",
  cargo: "Pastor Presidente",
  descricao: "Servo de Deus há mais de 20 anos, dedicado à obra e ao crescimento espiritual da igreja.",
  foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&h=300"
}, {
  nome: "Pr. Carlos Oliveira",
  cargo: "Pastor Auxiliar",
  descricao: "Responsável pelo ministério de famílias e aconselhamento pastoral.",
  foto: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=300&h=300"
}, {
  nome: "Débora Santos",
  cargo: "Líder de Louvor",
  descricao: "Coordena toda a equipe de músicos e ministração nos cultos.",
  foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300"
}, {
  nome: "Marcos Pereira",
  cargo: "Líder de Jovens",
  descricao: "Trabalha com juventude há 8 anos, focado no discipulado da nova geração.",
  foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300"
}];

// Dados simulados da galeria
const galeria = ["https://images.unsplash.com/photo-1511649475669-e288648b2d1e?auto=format&fit=crop&w=600&h=400", "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&h=400", "https://images.unsplash.com/photo-1541911087797-f13abca6b2ad?auto=format&fit=crop&w=600&h=400", "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=600&h=400", "https://images.unsplash.com/photo-1470225620780-dba8ba36b2ad?auto=format&fit=crop&w=600&h=400", "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&h=400"];
const Sobre = () => {
  return <Layout>
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-church-900/70 to-church-800/70 z-10"></div>
        <div className="relative h-[40vh] min-h-[300px]">
          <img src="https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1920&h=600" alt="Igreja Casa da Benção" className="w-full h-full object-cover" />
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
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-6">
              <TabsTrigger value="historia">História</TabsTrigger>
              <TabsTrigger value="lideranca">Liderança</TabsTrigger>
              <TabsTrigger value="localizacao">Localização</TabsTrigger>
              <TabsTrigger value="galeria">Galeria</TabsTrigger>
            </TabsList>
            
            {/* Aba de História */}
            <TabsContent value="historia">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-church-900 mb-6">Nossa História</h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      A Igreja Casa da Benção teve início em 1995, quando um pequeno grupo de fiéis começou a se reunir nas casas para estudos bíblicos e momentos de oração.
                    </p>
                    <p>
                      Com o crescimento desse grupo inicial, em 1997 foi alugado o primeiro espaço para os cultos regulares. Sob a liderança do Pastor João Silva, a igreja começou a desenvolver seus ministérios e alcançar mais vidas para Cristo.
                    </p>
                    <p>
                      Em 2005, através de muita oração e contribuições dos membros, foi adquirido o terreno onde está localizado o templo atual, inaugurado em 2008.
                    </p>
                    <p>
                      Ao longo desses anos, temos testemunhado o poder de Deus transformando vidas, restaurando famílias e capacitando pessoas para servirem no Reino.
                    </p>
                    <p>
                      Hoje, a Igreja Casa da Benção conta com diversos ministérios atuantes, uma escola bíblica estruturada e projetos sociais que impactam nossa comunidade.
                    </p>
                  </div>
                </div>
                <div className="space-y-8">
                  <img alt="História da Igreja" className="rounded-lg shadow-lg w-full" src="/lovable-uploads/76ba9a4a-3cc5-402d-9493-a1b9432cd42c.jpg" />
                  
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
            
            {/* Aba de Liderança */}
            <TabsContent value="lideranca">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-church-900 mb-4">Nossa Liderança</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Conheça os líderes que Deus levantou para servir e conduzir nossa igreja
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {lideranca.map((lider, index) => <Card key={index} className="overflow-hidden">
                    <div className="aspect-square overflow-hidden">
                      <img src={lider.foto} alt={lider.nome} className="w-full h-full object-cover" />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-church-800">{lider.nome}</h3>
                      <p className="text-church-600 font-medium mb-2">{lider.cargo}</p>
                      <p className="text-gray-600 text-sm">{lider.descricao}</p>
                    </CardContent>
                  </Card>)}
              </div>
              
              <div className="mt-16 bg-church-50 p-8 rounded-lg border border-church-100">
                <h3 className="text-2xl font-semibold text-church-800 mb-6 text-center">Estrutura Ministerial</h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-5 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold text-church-700 mb-3">Ministério Pastoral</h4>
                    <ul className="text-gray-700 space-y-1">
                      <li>Pregação e Ensino</li>
                      <li>Aconselhamento</li>
                      <li>Visitação</li>
                      <li>Treinamento de Líderes</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-5 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold text-church-700 mb-3">Ministério de Louvor</h4>
                    <ul className="text-gray-700 space-y-1">
                      <li>Equipe de Músicos</li>
                      <li>Coral</li>
                      <li>Audiovisual</li>
                      <li>Treinamento Musical</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-5 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold text-church-700 mb-3">Ministério de Educação</h4>
                    <ul className="text-gray-700 space-y-1">
                      <li>Escola Bíblica Dominical</li>
                      <li>Cursos Teológicos</li>
                      <li>Treinamento de Professores</li>
                      <li>Biblioteca</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-5 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold text-church-700 mb-3">Ministério de Jovens</h4>
                    <ul className="text-gray-700 space-y-1">
                      <li>Cultos da Juventude</li>
                      <li>Discipulado</li>
                      <li>Acampamentos</li>
                      <li>Eventos Especiais</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-5 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold text-church-700 mb-3">Ministério Infantil</h4>
                    <ul className="text-gray-700 space-y-1">
                      <li>Culto Infantil</li>
                      <li>Berçário</li>
                      <li>Eventos para Crianças</li>
                      <li>Capacitação de Professores</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-5 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold text-church-700 mb-3">Ministério de Ação Social</h4>
                    <ul className="text-gray-700 space-y-1">
                      <li>Cestas Básicas</li>
                      <li>Visitas Hospitalares</li>
                      <li>Auxílio às Famílias</li>
                      <li>Projetos Comunitários</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-12">
                <Link to="/ministerios">
                  <Button className="btn-primary">
                    Conhecer Todos os Ministérios <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </TabsContent>
            
            {/* Aba de Localização */}
            <TabsContent value="localizacao">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
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
                      <Phone className="h-6 w-6 text-church-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg text-church-800">Telefone</h3>
                        <p className="text-gray-700">(XX) XXXX-XXXX</p>
                        <p className="text-gray-700">(XX) XXXXX-XXXX (WhatsApp)</p>
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
                      <ul className="space-y-3 text-gray-700">
                        <li className="flex justify-between border-b pb-2">
                          <span className="font-medium">Domingo - Culto da Família:</span>
                          <span>18:30</span>
                        </li>
                        <li className="flex justify-between border-b pb-2">
                          <span className="font-medium">Terça-feira - Oração:</span>
                          <span>20:00</span>
                        </li>
                        <li className="flex justify-between border-b pb-2">
                          <span className="font-medium">Quarta-feira - Escola Bíblica:</span>
                          <span>20:00</span>
                        </li>
                        <li className="flex justify-between border-b pb-2">
                          <span className="font-medium">Sexta-feira - Culto de Libertação:</span>
                          <span>20:00</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-8">
                  <div className="rounded-lg overflow-hidden shadow-lg h-80">
                    {/* Aqui seria inserido o iframe do Google Maps */}
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-600 text-lg">Mapa do Google seria carregado aqui</p>
                    </div>
                  </div>
                  
                  <div className="bg-church-50 p-6 rounded-lg border border-church-100">
                    <h3 className="text-xl font-semibold text-church-800 mb-3">Como Chegar</h3>
                    <p className="text-gray-700 mb-4">Nossa igreja está localizada perto do HRSAM e em frente ao um campo de futebol</p>
                    
                    <h4 className="font-medium text-church-700 mb-2">Transporte Público:</h4>
                    <ul className="list-disc pl-5 text-gray-700 mb-4">
                      <li>Ônibus: Linhas 0.373, 0.366 e 0.391</li>
                      <li>Ponto de ônibus a 30m da igreja</li>
                    </ul>
                    
                    <h4 className="font-medium text-church-700 mb-2">De Carro:</h4>
                    <ul className="list-disc pl-5 text-gray-700 mb-4">
                      <li>Estacionamento próprio com 30 vagas</li>
                      
                    </ul>
                    
                    <Button className="w-full">
                      Abrir no Google Maps
                    </Button>
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
                {galeria.map((imagem, index) => <div key={index} className="overflow-hidden rounded-lg shadow-md group">
                    <img src={imagem} alt={`Foto da Igreja ${index + 1}`} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>)}
              </div>
              
              <div className="text-center mt-12">
                <Button className="btn-primary">
                  Ver Mais Fotos
                </Button>
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
    </Layout>;
};
export default Sobre;