
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Phone, Mail, Clock, ChevronRight, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/services/api";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import MinistryEditModal from "@/components/ministry/MinistryEditModal";
import { useQuery } from "@tanstack/react-query";

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
  const [members, setMembers] = useState<UsuarioComRoles[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { currentUser } = useCurrentUser();
  
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
    enabled: isEditModalOpen // Only fetch when modal is open
  });

  // Check if current user is a leader of this ministry
  const isCurrentUserLeader = currentUser && leaders.some(leader => leader.id === currentUser.id);

  useEffect(() => {
    if (ministryId) {
      api
        .get(`/users/ministerios/${ministryId}/membros`)
        .then((res) => setMembers(res.data))
        .catch((err) => console.error("Erro ao buscar membros:", err));
    }
  }, [ministryId]);

  const handleEditSuccess = () => {
    // Refresh the page to show updated data
    window.location.reload();
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
            {isCurrentUserLeader && (
              <Button
                onClick={() => setIsEditModalOpen(true)}
                className="bg-church-700 hover:bg-church-800 text-white"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar Ministério
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs de Conteúdo */}
      <section className="py-12 bg-white">
        <div className="container-church">
          <Tabs defaultValue="sobre" className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-6">
              <TabsTrigger value="sobre">Sobre o Ministério</TabsTrigger>
              <TabsTrigger value="mural">Mural</TabsTrigger>
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
                            <div key={leader.id} className="text-sm border-b pb-2">
                              <img
                                src={`${API_BASE_URL}${leader.profileImageUrl || '/uploads/profiles/default.jpg'}`}
                                alt={leader.name}
                                className="w-12 h-12 rounded-full object-cover"
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
                              <div key={vice.id} className="text-sm border-b pb-2">
                                <img
                                  src={`${API_BASE_URL}${vice.profileImageUrl || '/uploads/profiles/default.jpg'}`}
                                  alt={vice.name}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                                <p className="font-semibold text-church-800">{vice.name}</p>
                                {vice.email && <p className="text-gray-500">{vice.email}</p>}
                                {vice.phone && <p className="text-gray-500">{vice.phone}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-6">
                        <Link to="/contato">
                          <Button className="w-full bg-church-700 hover:bg-church-800">
                            <Users className="w-4 h-4 mr-2" />
                            Faça Parte
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Aba Mural */}
            <TabsContent value="mural">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-church-900 mb-4">Mural</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto whitespace-pre-line">
                  {wall || "Nenhum aviso postado ainda."}
                </p>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {members.map((member) => {
                  const imageUrl = member.profileImageUrl?.startsWith("http")
                    ? member.profileImageUrl
                    : `${API_BASE_URL}${member.profileImageUrl || "/uploads/profiles/default.jpg"}`;
                  return (
                    <div
                      key={member.id}
                      className="bg-white rounded-lg shadow p-4 flex flex-col items-center"
                    >
                      <img
                        src={imageUrl}
                        alt={member.name}
                        className="w-32 h-32 object-cover rounded-lg mx-auto shadow"
                      />
                      <h3 className="text-lg font-semibold text-church-800">{member.name}</h3>
                      <p className="text-sm text-gray-500">{member.email}</p>
                      <p className="text-sm text-gray-500">{member.phone}</p>
                      <p className="text-sm text-gray-500">
                        {member.roles.join(", ")}
                      </p>
                    </div>
                  );
                })}
              </div>
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
    </Layout>
  );
};

export default MinisterioTemplate;
