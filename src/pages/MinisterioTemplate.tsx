
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Phone, Mail, Clock, ChevronRight, Edit, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/services/api";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import MinistryEditModal from "@/components/ministry/MinistryEditModal";
import { AvisoCard } from "@/components/avisos/AvisoCard";
import { AvisoModal } from "@/components/avisos/AvisoModal";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import UserCard from "@/components/ui/UserCard";

interface Usuario {
  id: number;
  name: string;
  email: string;
  phone: string;
  profileImageUrl?: string;
}

interface UsuarioComRoles extends Usuario {
  roles: string[];
}

interface Aviso {
  id: number;
  titulo: string;
  mensagem: string;
  arquivoUrl?: string;
  dataCriacao: string;
  tipo: 'GERAL' | 'MINISTERIAL';
  nomeMinisterio?: string;
  nomeAutor: string;
}

interface MinisterioTemplateProps {
  title: string;
  description: string;
  imageUrl: string;
  activities: string[];
  schedule: string;
  leaders: Usuario[];
  viceLeaders: Usuario[];
  wall: string;
  members: UsuarioComRoles[];
  ministryId?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const MinisterioTemplate = ({
  title,
  description,
  imageUrl,
  activities,
  schedule,
  leaders,
  viceLeaders,
  wall,
  members: _,
  ministryId
}: MinisterioTemplateProps) => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<UsuarioComRoles[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAvisoModalOpen, setIsAvisoModalOpen] = useState(false);
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const { currentUser, isLoading } = useCurrentUser();
  const { toast } = useToast();

  const fullImageUrl = imageUrl.startsWith("http")
    ? imageUrl
    : `${API_BASE_URL}${imageUrl}`;

  // Fetch users for the edit modal
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users');
      return response.data;
    },
    enabled: isEditModalOpen
  });

  // Check if current user is a leader or vice-leader of this ministry using email
  const isCurrentUserLeader = currentUser && currentUser.email && (
    leaders.some(leader => leader.email === currentUser.email) ||
    viceLeaders.some(viceLeader => viceLeader.email === currentUser.email)
  );

  useEffect(() => {
    if (ministryId) {
      api
        .get(`/users/ministerios/${ministryId}/membros`)
        .then((res) => setMembers(res.data))
        .catch((err) => console.error("Erro ao buscar membros:", err));
    }
  }, [ministryId]);

  useEffect(() => {
    const fetchAvisos = async () => {
      if (ministryId) {
        try {
          const response = await api.get('/avisos/ativos');
          const avisosMinisteriais = response.data.filter(
            (aviso: Aviso) => aviso.tipo === 'MINISTERIAL' && aviso.nomeMinisterio === title
          );
          setAvisos(
            avisosMinisteriais.sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime())
          );
        } catch (error) {
          console.error("Erro ao buscar avisos:", error);
        }
      }
    };

    fetchAvisos();
  }, [ministryId, title]);

  /**
   * Navega para o perfil público do usuário
   */
  const handleUserClick = (userId: number) => {
    navigate(`/profile-public/${userId}`);
  };

  const handleEditSuccess = () => {
    // Refresh the page to show updated data
    window.location.reload();
  };

  const handleAvisoSuccess = () => {
    // Refresh avisos
    if (ministryId) {
      api.get('/avisos/ativos')
        .then(response => {
          const avisosMinisteriais = response.data.filter(
            (aviso: Aviso) => aviso.tipo === 'MINISTERIAL' && aviso.nomeMinisterio === title
          );
          setAvisos(
            avisosMinisteriais.sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime())
          );
        })
        .catch(error => console.error("Erro ao buscar avisos:", error));
    }
  };

  const handleDeleteAviso = async (avisoId: number) => {
    if (confirm("Tem certeza que deseja excluir este aviso?")) {
      try {
        await api.delete(`/avisos/${avisoId}`);
        setAvisos(avisos.filter(aviso => aviso.id !== avisoId));
        toast({
          title: "Sucesso",
          description: "Aviso excluído com sucesso"
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao excluir aviso",
          variant: "destructive"
        });
      }
    }
  };

  const handleWhatsAppContact = () => {
    if (leaders.length > 0) {
      const leader = leaders[0];
      const phone = leader.phone?.replace(/\D/g, ''); // Remove non-digits
      const message = `Olá, eu gostaria de participar do ministério ${title}. Como eu faço?`;
      const whatsappUrl = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  // Ordenar membros alfabeticamente
  const sortedMembers = [...members].sort((a, b) => a.name.localeCompare(b.name));

  // Função para verificar se é líder ou vice-líder
  const getUserLeadershipType = (userId: number) => {
    if (leaders.some(leader => leader.id === userId)) return 'Líder';
    if (viceLeaders.some(viceLeader => viceLeader.id === userId)) return 'Vice-Líder';
    return null;
  };

  const ministryData = {
    id: ministryId,
    name: title,
    description,
    imageUrl,
    activities,
    meetingDay: schedule,
    leaders,
    viceLeaders,
    wall
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative h-[300px] overflow-hidden">
        <img
          src={fullImageUrl}
          alt={`Imagem do ${title}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="container-church relative h-full flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
          </div>
        </div>
      </div>

      {/* Tabs de Conteúdo */}
      <section className="py-12 bg-white">
        <div className="container-church">
          <Tabs defaultValue="sobre" className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-6">
              <TabsTrigger value="sobre">Sobre o Ministério</TabsTrigger>
              <TabsTrigger value="avisos">Avisos</TabsTrigger>
              <TabsTrigger value="membros">Membros do Ministério</TabsTrigger>
            </TabsList>

            <TabsContent value="sobre">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-church-900 mb-4">Sobre nós</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Aqui está detalhes sobre o nosso ministério
                </p>
              </div>
              <div className="container-church py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <section>
                      <h2 className="text-2xl font-bold text-church-900 mb-4">Descrição</h2>
                      <p className="text-lg text-gray-700">{description}</p>
                    </section>
                    <section>
                      <h2 className="text-2xl font-bold text-church-900 mb-4">Nossas Atividades</h2>
                      <ul className="space-y-2">
                        {(activities ?? []).map((activity, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block w-2 h-2 mt-2 mr-2 bg-church-700 rounded-full" />
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section>
                      <h2 className="text-2xl font-bold text-church-900 mb-4">Horário de Reunião</h2>
                      <p className="text-lg text-gray-700">{schedule}</p>
                    </section>
                  </div>

                  {/* Liderança */}
                  <div className="lg:col-span-1">
                    <div className="bg-church-50 rounded-xl p-6 space-y-6">
                      <div>
                        <h2 className="text-xl font-bold text-church-900 mb-2">Liderança</h2>
                        <div className="space-y-3">
                          {leaders.map((leader) => (
                            <div
                              key={leader.id}
                              className="text-sm border-b pb-2 cursor-pointer hover:bg-church-100 p-2 rounded transition-colors"
                              onClick={() => handleUserClick(leader.id)}
                            >
                              <img
                                src={`${API_BASE_URL}${leader.profileImageUrl || '/uploads/profiles/default.jpg'}`}
                                alt={leader.name}
                                className="w-55 h-20 rounded-full object-cover mb-2"
                              />
                              <p className="font-semibold text-church-800">{leader.name}</p>
                              {leader.email && <p className="text-gray-500">{leader.email}</p>}
                              {leader.phone && <p className="text-gray-500">{leader.phone}</p>}
                            </div>
                          ))}
                        </div>
                      </div>

                      {viceLeaders.length > 0 && (
                        <div>
                          <h2 className="text-xl font-bold text-church-900 mb-2">Vice-liderança</h2>
                          <div className="space-y-3">
                            {viceLeaders.map((vice) => (
                              <div
                                key={vice.id}
                                className="text-sm border-b pb-2 cursor-pointer hover:bg-church-100 p-2 rounded transition-colors"
                                onClick={() => handleUserClick(vice.id)}
                              >
                                <img
                                  src={`${API_BASE_URL}${vice.profileImageUrl || '/uploads/profiles/default.jpg'}`}
                                  alt={vice.name}
                                  className="w-12 h-12 rounded-full object-cover mb-2"
                                />
                                <p className="font-semibold text-church-800">{vice.name}</p>
                                {vice.email && <p className="text-gray-500">{vice.email}</p>}
                                {vice.phone && <p className="text-gray-500">{vice.phone}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Botão de edição para líderes - posicionado após as lideranças */}
                      {!isLoading && isCurrentUserLeader && (
                        <div className="pt-4">
                          <Button
                            onClick={() => setIsEditModalOpen(true)}
                            className="w-full bg-green-700 hover:bg-green-800 text-white mb-4"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Editar Ministério
                          </Button>
                        </div>
                      )}

                      <div className="mt-6">
                        <Button 
                          className="w-full bg-church-700 hover:bg-church-800"
                          onClick={handleWhatsAppContact}
                          disabled={leaders.length === 0 || !leaders[0].phone}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Faça Parte
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Aba Avisos */}
            <TabsContent value="avisos">
              <div className="text-center mb-12">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-left">
                    <h2 className="text-3xl font-bold text-church-900 mb-4">📌 Mural de Avisos</h2>
                    <p className="text-xl text-gray-600">
                      Avisos e informações importantes do ministério
                    </p>
                  </div>
                  {!isLoading && isCurrentUserLeader && (
                    <Button
                      onClick={() => setIsAvisoModalOpen(true)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Aviso
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {avisos.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Nenhum aviso disponível no momento.</p>
                  </div>
                ) : (
                  avisos.map((aviso) => (
                    <AvisoCard
                      key={aviso.id}
                      aviso={aviso}
                      showDelete={isCurrentUserLeader}
                      onDelete={handleDeleteAviso}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            {/* Aba Membros */}
            <TabsContent value="membros">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-church-900 mb-4">Membros</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Aqui estão os membros deste ministério
                </p>
              </div>
              
              {sortedMembers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">Nenhum membro encontrado</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {sortedMembers.map((member) => {
                    const leadershipType = getUserLeadershipType(member.id);
                    return (
                      <div key={member.id} className="relative">
                        <UserCard usuario={member} />
                        {leadershipType && (
                          <Badge 
                            className="absolute -top-2 -right-2 bg-church-700 text-white text-xs px-2 py-1"
                            variant="default"
                          >
                            {leadershipType}
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

          </Tabs>
        </div>
      </section>

      {/* Edit Modal */}
      <MinistryEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        ministry={ministryData}
        users={users}
        onSuccess={handleEditSuccess}
      />

      {/* Aviso Modal */}
      <AvisoModal
        isOpen={isAvisoModalOpen}
        onClose={() => setIsAvisoModalOpen(false)}
        onSuccess={handleAvisoSuccess}
        ministryId={ministryId}
      />
    </Layout>
  );
};

export default MinisterioTemplate;
