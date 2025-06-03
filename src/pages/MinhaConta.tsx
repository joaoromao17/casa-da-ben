import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Key, LogOut } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/services/api";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";

interface Ministry {
  id: number;
  name: string;
}

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
  ministries: Ministry[];
  profileImageUrl: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";


const MinhaConta = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    birthDate: "",
    maritalStatus: "",
    baptized: false,
    ministries: [] as number[],
    member: false,
    acceptedTerms: true,
    profileImageUrl: "",
    roles: [] as string[]
  });

  const handleSelectPhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const [ministriesOptions, setMinistriesOptions] = useState<Ministry[]>([]);

  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        const response = await api.get("/ministerios");
        setMinistriesOptions(response.data);
      } catch (error) {
        console.error("Erro ao buscar ministérios", error);
      }
    };
    fetchMinistries();
  }, []);

  useEffect(() => {
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

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/users/profile");
        setUserData(response.data);
      } catch (error: any) {
        console.error("Erro ao carregar dados do usuário:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar seus dados. Tente novamente.",
          variant: "destructive",
        });

        if (error.response?.status === 401) {
          localStorage.removeItem("authToken");
          sessionStorage.removeItem("authToken");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
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
      return new Intl.DateTimeFormat("pt-BR").format(date);
    } catch (e) {
      return dateString;
    }
  };

  const getProfileImageUrl = (url: string | null | undefined) => {
    if (!url) return "/default-profile.jpg";
    const baseUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
    return `${baseUrl}?t=${Date.now()}`; // força atualização
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      await api.put("/users/profile/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Imagem atualizada",
        description: "Sua foto de perfil foi atualizada com sucesso!",
      });

      // Recarrega os dados do usuário
      const response = await api.get("/users/profile");
      setUserData(response.data);

    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a imagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const formatRoleName = (role: string) => {
    return role.replace('ROLE_', '').toLowerCase().replace('_', ' ');
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
                <div>
                  <CardTitle className="text-2xl mb-2">{userData.name}</CardTitle>
                  <div className="text-muted-foreground">
                    <p>{userData.email}</p>
                    <p className="mt-1">{userData.phone}</p>
                  </div>
                  <div className="mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={handleSelectPhoto}
                      disabled={uploading}
                    >
                      {uploading ? "Enviando..." : "Alterar Foto"}
                    </Button>

                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleImageUpload}
                    />
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
                        {Array.isArray(userData.roles) ? (
                          userData.roles.map((role, index) => (
                            <span
                              key={index}
                              className="inline-block bg-church-100 text-church-800 rounded-full px-3 py-1 text-xs mr-2 mb-2"
                            >
                              {formatRoleName(role)}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">Nenhuma função atribuída</span>
                        )}
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

                    {/* CAMPOS EXTRAS SE NÃO FOR VISITANTE */}
                    {!userData.roles.includes("ROLE_VISITANTE") && (
                      <>
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
                          <TableCell className="font-medium">Ministérios</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              {userData.ministries.map((ministry) => (
                                <span
                                  key={ministry.id}
                                  className="bg-church-100 text-church-800 rounded-full px-3 py-1 text-xs"
                                >
                                  {ministry.name}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button
                className="flex items-center gap-2"
                onClick={() => {
                  if (userData) {
                    const baseData = {
                      name: userData.name,
                      phone: userData.phone,
                      email: userData.email,
                      member: userData.member,
                    };

                    const fullData = {
                      ...baseData,
                      address: userData.address || "",
                      birthDate: userData.birthDate?.split("T")[0] || "",
                      maritalStatus: userData.maritalStatus || "",
                      baptized: userData.baptized,
                      ministries: userData.ministries?.map((min) => min.id) || [],
                      acceptedTerms: userData.acceptedTerms,
                      profileImageUrl: userData.profileImageUrl || "",
                      roles: userData.roles,
                    };

                    setEditData(
                      userData.member
                        ? fullData
                        : {
                            ...editData,
                            ...baseData,
                            address: "",
                            birthDate: "",
                            maritalStatus: "",
                            baptized: false,
                            ministries: [],
                            acceptedTerms: userData.acceptedTerms ?? true,
                            profileImageUrl: userData.profileImageUrl || "",
                            roles: userData.roles || [],
                          }
                    );
                    setIsEditModalOpen(true);
                  }
                }}
              >
                <Pencil size={18} />
                Editar Informações
              </Button>

              <Button variant="outline" className="flex items-center gap-2" onClick={() => setIsPasswordModalOpen(true)}>
                <Key size={18} />
                Alterar Senha
              </Button>

              <Button variant="destructive" className="flex items-center gap-2" onClick={handleLogout}>
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

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Informações</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <Label>Nome</Label>
              <Input
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              />
            </div>
            <div>
              <Label>Telefone</Label>
              <Input
                value={editData.phone}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
              />
            </div>

            {/* Campos exclusivos para membros */}
            {editData.member && (
              <>
                <div>
                  <Label>Endereço</Label>
                  <Input
                    value={editData.address}
                    onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Data de Nascimento</Label>
                  <Input
                    type="date"
                    value={editData.birthDate}
                    onChange={(e) => setEditData({ ...editData, birthDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Estado Civil</Label>
                  <select
                    className="w-full border rounded px-2 py-1"
                    value={editData.maritalStatus}
                    onChange={(e) => setEditData({ ...editData, maritalStatus: e.target.value })}
                  >
                    <option value="">Selecione...</option>
                    <option value="Solteiro(a)">Solteiro(a)</option>
                    <option value="Casado(a)">Casado(a)</option>
                    <option value="Divorciado(a)">Divorciado(a)</option>
                    <option value="Viúvo(a)">Viúvo(a)</option>
                  </select>
                </div>
                <div>
                  <Label>Batizado</Label>
                  <select
                    className="w-full border rounded px-2 py-1"
                    value={editData.baptized ? "true" : "false"}
                    onChange={(e) => setEditData({ ...editData, baptized: e.target.value === "true" })}
                  >
                    <option value="true">Sim</option>
                    <option value="false">Não</option>
                  </select>
                </div>
                <div>
                  <Label>Ministérios</Label>
                  <div className="space-y-2 border rounded px-3 py-2">
                    {ministriesOptions.map((min) => (
                      <div key={min.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-min-${min.id}`}
                          checked={editData.ministries?.includes(min.id)}
                          onCheckedChange={(checked) => {
                            const current = editData.ministries || [];
                            if (checked) {
                              setEditData({ ...editData, ministries: [...current, min.id] });
                            } else {
                              setEditData({ ...editData, ministries: current.filter((id) => id !== min.id) });
                            }
                          }}
                        />
                        <label htmlFor={`edit-min-${min.id}`} className="text-sm">
                          {min.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button
              onClick={async () => {
                try {
                  const dataToSend = {
                    ...editData,
                    ministries: editData.member
                      ? editData.ministries?.map((id: number) => ({ id }))
                      : [], // visitantes não têm ministérios
                  };

                  console.log("editData enviado:", dataToSend);

                  await api.put("/users/profile", dataToSend);

                  toast({ title: "Sucesso", description: "Dados atualizados com sucesso!" });

                  const response = await api.get("/users/profile");
                  setUserData(response.data);
                  setIsEditModalOpen(false);
                } catch (error) {
                  console.error("Erro ao atualizar:", error.response?.data || error);
                  toast({
                    title: "Erro",
                    description: "Não foi possível atualizar os dados.",
                    variant: "destructive",
                  });
                }
              }}
            >
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Senha</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Senha Atual</Label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-800"
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <Label>Nova Senha</Label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-800"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <Label>Confirme a Nova Senha</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-800"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              onClick={async () => {
                if (newPassword !== confirmPassword) {
                  toast({
                    title: "Erro",
                    description: "As senhas não coincidem.",
                    variant: "destructive",
                  });
                  return;
                }

                try {
                  await api.put("/users/password", {
                    currentPassword,
                    newPassword,
                  });

                  toast({ title: "Sucesso", description: "Senha alterada com sucesso!" });

                  // limpa e fecha o modal
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setIsPasswordModalOpen(false);
                } catch (error: any) {
                  console.error("Erro ao alterar senha:", error);
                  toast({
                    title: "Erro",
                    description: error.response?.data || "Não foi possível alterar a senha.",
                    variant: "destructive",
                  });
                }
              }}
            >
              Alterar Senha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </Layout>
  );
};

export default MinhaConta;
