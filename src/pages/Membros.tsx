
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/services/api";
import LeadershipSection from "@/components/ui/LeadershipSection";
import MembersSection from "@/components/ui/MembersSection";
import BirthdaysSection from "@/components/ui/BirthdaysSection";

const Membros = () => {
  const navigate = useNavigate();
  const [leadersData, setLeadersData] = useState({
    pastores: [],
    pastoresAuxiliares: [],
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
    pastoresAuxiliares: true,
    lideres: true,
    professores: true,
    presbiteros: true,
    evangelistas: true,
    missionarios: true,
    diaconos: true,
    obreiros: true
  });

  useEffect(() => {
    // Verificar se o usuário está logado
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

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
        // Buscar pastores e auxiliares separadamente
        const [pastores, pastoresAuxiliares] = await Promise.all([
          fetchUsersByRole('ROLE_PASTOR'),
          fetchUsersByRole('ROLE_PASTORAUXILIAR')
        ]);

        setLeadersData(prev => ({ ...prev, pastores }));
        setLeadersData(prev => ({ ...prev, pastoresAuxiliares }));
        setLoadingStates(prev => ({ ...prev, pastores: false, pastoresAuxiliares: false }));

        // Outros cargos
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
        setLoadingStates({
          pastores: false,
          pastoresAuxiliares: false,
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
  }, [navigate]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-church-900/70 to-church-800/70 z-10"></div>
        <div className="relative h-[40vh] min-h-[300px]">
          <img src="/lovable-uploads/sobre_nos.png" alt="Membros da Igreja" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center z-20">
            <div className="container-church text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Nossos Membros
              </h1>
              <p className="text-xl md:text-2xl max-w-2xl">
                Conheça a liderança e os membros da nossa comunidade
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs de Conteúdo */}
      <section className="py-12 bg-white">
        <div className="container-church">
          <Tabs defaultValue="lideranca" className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-6 h-auto">
              <TabsTrigger value="lideranca" className="text-xs sm:text-sm px-2 py-2 break-words">Liderança</TabsTrigger>
              <TabsTrigger value="membros" className="text-xs sm:text-sm px-2 py-2 break-words">Membros</TabsTrigger>
              <TabsTrigger value="aniversariantes" className="text-xs sm:text-sm px-1 sm:px-2 py-2 break-words leading-tight">Aniversariantes</TabsTrigger>
            </TabsList>

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
                  title="Pastores Auxiliares"
                  usuarios={leadersData.pastoresAuxiliares}
                  isLoading={loadingStates.pastoresAuxiliares}
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
            </TabsContent>

            {/* Aba: Membros */}
            <TabsContent value="membros">
              <MembersSection />
            </TabsContent>

            {/* Aba: Aniversariantes */}
            <TabsContent value="aniversariantes">
              <BirthdaysSection />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout >
  );
};

export default Membros;