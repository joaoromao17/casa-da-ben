
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Key, LogOut } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import api from "@/services/api";

interface UserData {
  name: string;
  email: string;
  phone: string;
  member: boolean;
  roles: string[];
  address: string;
  birthDate: string;
  maritalStatus: string;
  baptized: boolean;
  acceptedTerms: boolean;
  ministries: string[];
  profilePicture?: string;
}

const MinhaConta = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para acessar esta página.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    // Carregar dados do usuário
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Em um cenário real, você buscaria os dados do usuário da API
        // const response = await api.get("/user/profile");
        // setUserData(response.data);

        // Mock de dados para demonstração
        setTimeout(() => {
          setUserData({
            name: "Maria da Silva",
            email: "maria@exemplo.com",
            phone: "(11) 98765-4321",
            member: true,
            roles: ["MEMBRO", "LIDER_LOUVOR"],
            address: "Av. Principal, 123 - São Paulo, SP",
            birthDate: "1985-05-20",
            maritalStatus: "Casado(a)",
            baptized: true,
            acceptedTerms: true,
            ministries: ["Louvor", "Acolhimento", "Escola Bíblica"],
            profilePicture: "https://i.pravatar.cc/150?img=32"
          });
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar seus dados. Tente novamente.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    // Remover o token de autenticação
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
    
    navigate("/login");
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('pt-BR').format(date);
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Layout>
      <div className="container-church py-12 max-w-4xl">
        <h1 className="section-title mb-8">Minha Conta</h1>

        {loading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-600"></div>
          </div>
        ) : userData ? (
          <div className="space-y-8">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 md:gap-8">
                <Avatar className="h-24 w-24 border-2 border-church-500">
                  <AvatarImage src={userData.profilePicture} alt={userData.name} />
                  <AvatarFallback className="text-2xl bg-church-100 text-church-700">
                    {userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl mb-2">{userData.name}</CardTitle>
                  <div className="text-muted-foreground">
                    <p>{userData.email}</p>
                    <p className="mt-1">{userData.phone}</p>
                  </div>
                  <div className="mt-3">
                    <Button variant="outline" size="sm" className="mr-2">
                      Alterar Foto
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium w-1/3">Nome Completo</TableCell>
                      <TableCell>{userData.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">E-mail</TableCell>
                      <TableCell>{userData.email}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Telefone</TableCell>
                      <TableCell>{userData.phone}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Membro da Igreja</TableCell>
                      <TableCell>
                        <span className={userData.member ? "text-green-600" : "text-gray-500"}>
                          {userData.member ? "Sim" : "Não"}
                        </span>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Funções</TableCell>
                      <TableCell>
                        {userData.roles.map((role, index) => (
                          <span key={index} className="inline-block bg-church-100 text-church-800 rounded-full px-3 py-1 text-xs mr-2 mb-2">
                            {role.replace("_", " ")}
                          </span>
                        ))}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Endereço</TableCell>
                      <TableCell>{userData.address}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Data de Nascimento</TableCell>
                      <TableCell>{formatDate(userData.birthDate)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Estado Civil</TableCell>
                      <TableCell>{userData.maritalStatus}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Batizado</TableCell>
                      <TableCell>
                        <span className={userData.baptized ? "text-green-600" : "text-gray-500"}>
                          {userData.baptized ? "Sim" : "Não"}
                        </span>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Aceitou os Termos</TableCell>
                      <TableCell>
                        <span className={userData.acceptedTerms ? "text-green-600" : "text-gray-500"}>
                          {userData.acceptedTerms ? "Sim" : "Não"}
                        </span>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Ministérios</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {userData.ministries.map((ministry, index) => (
                            <span key={index} className="bg-church-100 text-church-800 rounded-full px-3 py-1 text-xs">
                              {ministry}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="flex items-center gap-2">
                <Pencil size={18} />
                Editar Informações
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Key size={18} />
                Alterar Senha
              </Button>
              <Button 
                variant="destructive" 
                className="flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                Sair
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg text-gray-500">Nenhuma informação de usuário encontrada</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MinhaConta;
