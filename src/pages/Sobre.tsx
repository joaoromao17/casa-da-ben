import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Phone, Mail, Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "@/services/api";
import LeadershipSection from "@/components/ui/LeadershipSection";
import MembersSection from "@/components/ui/MembersSection";
import BirthdaysSection from "@/components/ui/BirthdaysSection";

// Dados simulados da galeria
const galeria = ["/lovable-uploads/galeria1.jpg", "/lovable-uploads/galeria2.jpg", "/lovable-uploads/galeria3.jpg", "/lovable-uploads/galeria4.jpg", "/lovable-uploads/galeria5.jpg", "/lovable-uploads/galeria6.jpg"];

const Sobre = () => {
  const [leadersData, setLeadersData] = useState({
    pastores: [],
    lideres: [],
    professores: [],
    presbiteros: [],
    evangelistas: [],
    missionarios: [],
    diaconos: [],
    obreiros: []
  });

  const [loadingStates, setLoadingStates] = useState({
    pastores: true,
    lideres: true,
    professores: true,
    presbiteros: true,
    evangelistas: true,
    missionarios: true,
    diaconos: true,
    obreiros: true
  });

  useEffect(() => {
    const fetchUsersByRole = async (role: string) => {
      try {
        const response = await api.get(`/users/public/roles/${role}`);
        return response.data;
      } catch (error) {
        console.error(`Erro ao buscar usuários com role ${role}:`, error);
        return [];
      }
    };

    const loadLeadershipData = async () => {
      try {
        // Fetch pastores (combinando ROLE_PASTOR e ROLE_PASTORAUXILIAR)
        const [pastores, pastoresAuxiliares] = await Promise.all([
          fetchUsersByRole('ROLE_PASTOR'),
          fetchUsersByRole('ROLE_PASTORAUXILIAR')
        ]);
        const todosPastores = [...pastores, ...pastoresAuxiliares];
        
        setLeadersData(prev => ({ ...prev, pastores: todosPastores }));
        setLoadingStates(prev => ({ ...prev, pastores: false }));

        // Fetch outros roles
        const roles = [
          { key: 'lideres', role: 'ROLE_LIDER' },
          { key: 'professores', role: 'ROLE_PROFESSOR' },
          { key: 'presbiteros', role: 'ROLE_PRESBITERO' },
          { key: 'evangelistas', role: 'ROLE_EVANGELISTA' },
          { key: 'missionarios', role: 'ROLE_MISSIONARIO' },
          { key: 'diaconos', role: 'ROLE_DIACONO' },
          { key: 'obreiros', role: 'ROLE_OBREIRO' }
        ];

        for (const { key, role } of roles) {
          const users = await fetchUsersByRole(role);
          setLeadersData(prev => ({ ...prev, [key]: users }));
          setLoadingStates(prev => ({ ...prev, [key]: false }));
        }
      } catch (error) {
        console.error('Erro ao carregar dados de liderança:', error);
        // Marcar tudo como não carregando em caso de erro
        setLoadingStates({
          pastores: false,
          lideres: false,
          professores: false,
          presbiteros: false,
          evangelistas: false,
          missionarios: false,
          diaconos: false,
          obreiros: false
        });
      }
    };

    loadLeadershipData();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-church-900/70 to-church-800/70 z-10"></div>
        <div className="relative h-[40vh] min-h-[300px]">
          <img src="/lovable-uploads/sobre_nos.JPG" alt="Igreja Casa da Benção" className="w-full h-full object-cover" />
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
            <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-6 mb-6">
              <TabsTrigger value="historia">História</TabsTrigger>
              <TabsTrigger value="lideranca">Liderança</TabsTrigger>
              <TabsTrigger value="membros">Membros</TabsTrigger>
              <TabsTrigger value="aniversariantes">Aniversariantes</TabsTrigger>
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
              
              <div className="space-y-12">
                <LeadershipSection
                  title="Pastores"
                  usuarios={leadersData.pastores}
                  isLoading={loadingStates.pastores}
                />
                
                <LeadershipSection
                  title="Líderes"
                  usuarios={leadersData.lideres}
                  isLoading={loadingStates.lideres}
                />
                
                <LeadershipSection
                  title="Professores"
                  usuarios={leadersData.professores}
                  isLoading={loadingStates.professores}
                />
                
                <LeadershipSection
                  title="Presbíteros"
                  usuarios={leadersData.presbiteros}
                  isLoading={loadingStates.presbiteros}
                />
                
                <LeadershipSection
                  title="Evangelistas"
                  usuarios={leadersData.evangelistas}
                  isLoading={loadingStates.evangelistas}
                />
                
                <LeadershipSection
                  title="Missionários"
                  usuarios={leadersData.missionarios}
                  isLoading={loadingStates.missionarios}
                />
                
                <LeadershipSection
                  title="Diáconos"
                  usuarios={leadersData.diaconos}
                  isLoading={loadingStates.diaconos}
                />
                
                <LeadershipSection
                  title="Obreiros"
                  usuarios={leadersData.obreiros}
                  isLoading={loadingStates.obreiros}
                />
              </div>
              
              <div className="text-center mt-16">
                <Link to="/ministerios">
                  <Button className="btn-primary">
                    Conhecer Todos os Ministérios <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </TabsContent>

            {/* Nova Aba: Membros */}
            <TabsContent value="membros">
              <MembersSection />
            </TabsContent>

            {/* Nova Aba: Aniversariantes */}
            <TabsContent value="aniversariantes">
              <BirthdaysSection />
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
                        <p className="text-gray-700">(61) 99649-9589</p>
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
                  <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15350.884606274025!2d-48.0704318!3d-15.8712465!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a32ad2f29b613%3A0x1adc8d6dfc71e5df!2sIgreja%20Casa%20Da%20Bencao!5e0!3m2!1spt-BR!2sbr!4v1745341351430!5m2!1spt-BR!2sbr" width="600" height="320" loading="lazy"></iframe>
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
                    <a href="https://www.google.com/maps/place/Igreja+Casa+Da+Bencao/@-15.8712465,-48.0704318,15z/data=!4m6!3m5!1s0x935a32ad2f29b613:0x1adc8d6dfc71e5df!8m2!3d-15.8563574!4d-48.0797843!16s%2Fg%2F11cs01rnj5?entry=ttu&g_ep=EgoyMDI1MDQxNi4xIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D" target="_blank">
                    <Button className="w-full">
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
                {galeria.map((imagem, index) => <div key={index} className="overflow-hidden rounded-lg shadow-md group">
                    <img src={imagem} alt={`Foto da Igreja ${index + 1}`} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>)}
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
