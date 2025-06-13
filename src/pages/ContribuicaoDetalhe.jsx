import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Target, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import LoginRequiredNotice from "@/components/ui/LoginRequiredNotice";
import api from "@/services/api";

const ContribuicaoDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contribuicao, setContribuicao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginNotice, setShowLoginNotice] = useState(false);

  useEffect(() => {
    // Verificar se o usuário está logado
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      setShowLoginNotice(true);
      setLoading(false);
      return;
    }

    const fetchContribuicao = async () => {
      try {
        const response = await api.get(`/contribuicoes/${id}`);
        setContribuicao(response.data);
      } catch (error) {
        console.error("Erro ao buscar contribuição:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchContribuicao();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="container-church py-12 flex justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-church-900"></div>
        </div>
      </Layout>
    );
  }

  if (showLoginNotice) {
    return (
      <Layout>
        <div className="container-church py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Detalhes da Contribuição</h1>
          <p className="text-gray-600">Você precisa estar logado para ver os detalhes das contribuições.</p>
          <Button onClick={() => navigate("/contribuicoes")} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Contribuições
          </Button>
        </div>
        <LoginRequiredNotice
          message="Você precisa estar logado para acessar os detalhes das contribuições."
          onClose={() => setShowLoginNotice(false)}
        />
      </Layout>
    );
  }

  if (!contribuicao) {
    return (
      <Layout>
        <div className="container-church py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Contribuição não encontrada</h1>
          <Button onClick={() => navigate("/contribuicoes")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Contribuições
          </Button>
        </div>
      </Layout>
    );
  }

  const progressPercentage = contribuicao.meta > 0 ? (contribuicao.arrecadado / contribuicao.meta) * 100 : 0;
  const formattedDate = format(new Date(contribuicao.prazo), "dd/MM/yyyy", { locale: ptBR });

  return (
    <Layout>
      <div className="container-church py-8">
        <Button 
          onClick={() => navigate("/contribuicoes")} 
          variant="ghost" 
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Contribuições
        </Button>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl text-church-900 mb-2">
                      {contribuicao.titulo}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {contribuicao.categoria}
                    </CardDescription>
                  </div>
                  <Badge variant={contribuicao.ativa ? "default" : "secondary"}>
                    {contribuicao.ativa ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Descrição</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {contribuicao.descricao}
                    </p>
                  </div>

                  {contribuicao.imagemUrl && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Imagem</h3>
                      <img
                        src={contribuicao.imagemUrl}
                        alt={contribuicao.titulo}
                        className="w-full max-w-md rounded-lg shadow-md"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Progresso da Meta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Arrecadado</span>
                      <span>{progressPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-church-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Meta:</span>
                      <span className="font-semibold">
                        R$ {contribuicao.meta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Arrecadado:</span>
                      <span className="font-semibold text-church-600">
                        R$ {contribuicao.arrecadado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Restante:</span>
                      <span className="font-semibold">
                        R$ {Math.max(0, contribuicao.meta - contribuicao.arrecadado).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Informações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="text-sm text-gray-600">Prazo:</span>
                    <span className="font-medium">{formattedDate}</span>
                  </div>
                  
                  {contribuicao.pix && (
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm text-gray-600">PIX:</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <code className="text-sm break-all">{contribuicao.pix}</code>
                      </div>
                      <Button
                        onClick={() => navigator.clipboard.writeText(contribuicao.pix)}
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full"
                      >
                        Copiar PIX
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Como Contribuir
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <strong>1. PIX:</strong> Use a chave PIX acima para fazer sua doação.
                  </div>
                  <div>
                    <strong>2. Presencial:</strong> Contribua durante os cultos na igreja.
                  </div>
                  <div>
                    <strong>3. Transferência:</strong> Entre em contato para mais informações bancárias.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContribuicaoDetalhe;
