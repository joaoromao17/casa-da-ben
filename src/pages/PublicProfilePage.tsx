
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Phone } from "lucide-react";
import { Loading } from "@/components/ui/loading";
import api from "@/services/api";

interface PublicUserData {
  id: number;
  name: string;
  profileImageUrl?: string;
  biography?: string;
  roles: string[];
  ministries: Array<{
    id: number;
    name: string;
  }>;
  phone?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

/**
 * Página pública de perfil do usuário
 * Exibe informações públicas como nome, foto, biografia, roles e ministérios
 */
const PublicProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<PublicUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) {
        setError("ID do usuário não fornecido");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/users/${id}/public`);
        setUserData(response.data);
      } catch (error: any) {
        console.error("Erro ao buscar dados do usuário:", error);
        if (error.response?.status === 404) {
          setError("Usuário não encontrado");
        } else {
          setError("Erro ao carregar dados do usuário");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  /**
   * Formata o nome das roles removendo o prefixo ROLE_ e deixando em formato legível
   */
  const formatRoleName = (role: string) => {
    return role.replace('ROLE_', '').toLowerCase().replace('_', ' ');
  };

  /**
   * Gera URL completa para imagem de perfil
   */
  const getProfileImageUrl = (url: string | null | undefined) => {
    if (!url) return "/default-profile.jpg";
    return url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="container-church py-12">
          <Loading />
        </div>
      </Layout>
    );
  }

  if (error || !userData) {
    return (
      <Layout>
        <div className="container-church py-12 text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {error || "Usuário não encontrado"}
              </h2>
              <p className="text-gray-600 mb-4">
                O perfil que você está procurando não existe ou não está mais disponível.
              </p>
              <Button onClick={() => navigate(-1)} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-church py-12 max-w-4xl">
        {/* Botão Voltar */}
        <Button 
          onClick={() => navigate(-1)} 
          variant="outline" 
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card Principal com Foto e Informações Básicas */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6 text-center">
                <Avatar className="h-32 w-32 mx-auto mb-4 border-4 border-church-200">
                  <AvatarImage
                    src={getProfileImageUrl(userData.profileImageUrl)}
                    alt={userData.name}
                  />
                  <AvatarFallback className="text-2xl bg-church-100 text-church-700">
                    {userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <h1 className="text-2xl font-bold text-church-900 mb-2">
                  {userData.name}
                </h1>

                {/* Telefone */}
                {userData.phone && (
                  <div className="flex items-center justify-center text-gray-600 mb-4">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{userData.phone}</span>
                  </div>
                )}

                {/* Roles */}
                {userData.roles && userData.roles.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Funções</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {userData.roles.map((role, index) => (
                        <span
                          key={index}
                          className="inline-block bg-church-100 text-church-800 rounded-full px-3 py-1 text-xs"
                        >
                          {formatRoleName(role)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Informações Detalhadas */}
          <div className="lg:col-span-2 space-y-6">
            {/* Biografia */}
            {userData.biography && (
              <Card>
                <CardHeader>
                  <CardTitle>Sobre</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {userData.biography}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Ministérios */}
            {userData.ministries && userData.ministries.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Ministérios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {userData.ministries.map((ministry) => (
                      <div
                        key={ministry.id}
                        className="bg-church-50 rounded-lg p-4 border border-church-200"
                      >
                        <h4 className="font-semibold text-church-800">
                          {ministry.name}
                        </h4>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Caso não tenha biografia nem ministérios */}
            {(!userData.biography && (!userData.ministries || userData.ministries.length === 0)) && (
              <Card>
                <CardContent className="pt-6 text-center text-gray-500">
                  <p>Este usuário ainda não adicionou informações adicionais ao perfil.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PublicProfilePage;
