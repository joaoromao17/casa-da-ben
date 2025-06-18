import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loading } from "@/components/ui/loading";
import ErrorAlert from "@/components/ui/ErrorAlert";
import LoginRequiredNotice from "@/components/ui/LoginRequiredNotice";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import api from "@/services/api";
import {
  ArrowLeft,
  Calendar,
  Check,
  Copy,
  DollarSign,
  Percent,
  User,
  X,
  MessageSquare,
  Share2,
  ShareIcon,
  AlertTriangle
} from "lucide-react";

const ContribuicaoDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [contribuicao, setContribuicao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [formData, setFormData] = useState({
    valor: ''
  });

  useEffect(() => {
    // Verificar se o usuário está logado
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    setIsLoggedIn(!!token);
    
    if (!token) {
      setLoading(false);
      return;
    }

    carregarContribuicao();
  }, [id]);

  const carregarContribuicao = async () => {
    try {
      const response = await api.get(`/contribuicoes/${id}`);
      setContribuicao(response.data);
      console.log("Dados recebidos da API:", response.data);
    } catch (error) {
      console.error("Erro ao carregar contribuição:", error);
      setError("Não foi possível carregar os detalhes desta campanha.");
    } finally {
      setLoading(false);
    }
  };

  // Se não estiver logado, mostrar aviso de login necessário
  if (!loading && !isLoggedIn) {
    return (
      <Layout>
        <div className="container-church py-12">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => navigate('/contribuicoes')}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Contribuições
            </Button>
          </div>
          <LoginRequiredNotice 
            message="Para acessar os detalhes de uma campanha de contribuição, você precisa estar logado."
          />
        </div>
      </Layout>
    );
  }

  // Função para exibir o status da campanha
  const getStatusBadge = () => {
    if (!contribuicao) return null;

    const now = new Date();
    const startDate = contribuicao.startDate ? new Date(contribuicao.startDate) : null;
    const endDate = contribuicao.endDate ? new Date(contribuicao.endDate) : null;

    if (startDate && now < startDate) {
      return <Badge variant="secondary">Em breve</Badge>;
    } else if (endDate && now > endDate) {
      return <Badge variant="destructive">Encerrada</Badge>;
    } else {
      return <Badge variant="default">Ativa</Badge>;
    }
  };

  // Formatar valores para exibição em reais
  const formatarValor = (valor) => {
    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCopyPixKey = () => {
    if (contribuicao?.pixKey) {
      navigator.clipboard.writeText(contribuicao.pixKey);
      toast({
        title: "Chave PIX copiada!",
        description: "A chave PIX foi copiada para a área de transferência."
      });
    }
  };

  // Sharing functions using available icons
  const handleShare = (platform) => {
    const url = window.location.href;
    const title = `Contribua para: ${contribuicao?.title}`;
    let shareUrl;

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      default:
        shareUrl = null;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.valor || parseFloat(formData.valor.replace(',', '.')) <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, informe um valor válido para sua contribuição.",
        variant: "destructive"
      });
      return;
    }

    setShowConfirmDialog(true);
  };

  const confirmarContribuicao = async () => {
    try {
      const valor = parseFloat(formData.valor.replace(',', '.'));

      await api.post(`/contribuicoes/${id}/adicionar-valor`, null, {
        params: { valor }
      });

      toast({
        title: "Contribuição registrada!",
        description: "Agradecemos sua generosidade. Sua doação foi registrada com sucesso."
      });

      setFormData({
        valor: ''
      });

      await carregarContribuicao();

    } catch (error) {
      console.error("Erro ao processar doação:", error);
      toast({
        title: "Erro ao processar",
        description: "Não foi possível processar sua contribuição. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setShowConfirmDialog(false);
    }
  };

  // Formatar data corrigindo o dia (o problema de fuso horário)
  const formatarData = (dataString) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    // Corrigindo o problema do fuso horário adicionando um dia
    data.setDate(data.getDate() + 1);
    return data.toLocaleDateString('pt-BR');
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <Layout>
        <div className="container-church py-12">
          <div className="text-center">
            <ErrorAlert
              title="Erro"
              message={error}
              onRetry={() => navigate('/contribuicoes')}
            />
          </div>
        </div>
      </Layout>
    );
  }

  // Garante que os valores são tratados como números
  const targetValue = contribuicao?.targetValue ? Number(contribuicao.targetValue) : 0;
  const collectedValue = contribuicao?.collectedValue ? Number(contribuicao.collectedValue) : 0;

  // Calcula a porcentagem de progresso
  const progressPercentage = contribuicao?.isGoalVisible !== false && targetValue > 0
    ? Math.min(Math.round((collectedValue / targetValue) * 100), 100)
    : null;

  // Obter URL completa da imagem
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  const imageUrl = contribuicao?.imageUrl
    ? (contribuicao.imageUrl.startsWith('http')
      ? contribuicao.imageUrl
      : `${API_BASE_URL}${contribuicao.imageUrl}`)
    : '/placeholder.svg';

  return (
    <Layout>
      <div className="py-10">
        <div className="container-church">
          {/* Navegação de volta */}
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => navigate('/contribuicoes')}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Contribuições
            </Button>
          </div>

          {/* Cabeçalho da campanha */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="aspect-video overflow-hidden rounded-lg">
              <img
                src={imageUrl}
                alt={contribuicao?.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error("Erro ao carregar imagem:", imageUrl);
                  e.target.src = '/placeholder.svg';
                }}
              />
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2">
                {getStatusBadge()}

                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-1 h-4 w-4" />
                  {contribuicao?.startDate && (
                    <>
                      {formatarData(contribuicao.startDate)}
                      {contribuicao.endDate && (
                        <> até {formatarData(contribuicao.endDate)}</>
                      )}
                    </>
                  )}
                </div>
              </div>

              <h1 className="text-3xl font-bold text-church-900 mb-2">{contribuicao?.title}</h1>

              {contribuicao?.createdBy && (
                <p className="flex items-center text-gray-500 mb-4">
                  <User className="mr-1 h-4 w-4" /> Responsável: {contribuicao.createdBy}
                </p>
              )}

              {contribuicao?.isGoalVisible !== false && progressPercentage !== null && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-lg font-medium mb-1">
                    <DollarSign className="h-5 w-5 text-church-700" />
                    <span>{formatarValor(collectedValue)}</span>
                    <span className="text-gray-500">de {formatarValor(targetValue)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Progress value={progressPercentage} className="h-3" />
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Percent className="h-4 w-4 text-church-700" />
                      <span className="font-medium">{progressPercentage}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Compartilhar */}
              <div className="flex flex-wrap gap-2 mt-4">
                <div className="text-sm text-gray-500 flex items-center mr-2">
                  <ShareIcon className="h-4 w-4 mr-1" /> Compartilhar:
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => handleShare('whatsapp')}
                >
                  <MessageSquare className="h-4 w-4 mr-1" /> WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => handleShare('facebook')}
                >
                  <Share2 className="h-4 w-4 mr-1" /> Facebook
                </Button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {/* Área de doação */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Contribuir</CardTitle>
                  <CardDescription>Faça sua doação para esta campanha</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Chave PIX */}
                  <div className="mb-6">
                    <p className="text-sm mb-3">Use a chave PIX abaixo para fazer sua transferência:</p>

                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm font-medium mb-1">Chave PIX:</p>
                      <div className="flex">
                        <p className="text-sm font-mono bg-white p-2 rounded-l border flex-1 truncate">
                          {contribuicao?.pixKey || '12345678901'}
                        </p>
                        <Button
                          variant="outline"
                          className="rounded-l-none"
                          onClick={handleCopyPixKey}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Formulário de contribuição */}
                  <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="valor">Valor da contribuição</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">R$</span>
                        <Input
                          id="valor"
                          name="valor"
                          placeholder="0,00"
                          className="pl-10"
                          value={formData.valor}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-church-700 hover:bg-church-800"
                    >
                      Confirmar contribuição
                    </Button>
                  </form>

                  {/* ⚠️ Alerta de confirmação fora do form */}
                  <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="text-red-600 w-5 h-5" />
                          <AlertDialogTitle className="text-red-700">
                            Atenção!
                          </AlertDialogTitle>
                        </div>

                        <AlertDialogDescription className="text-red-600 mt-2">
                          Já transferiu para a conta? <br />
                          <strong>Para não atrapalhar a nossa contagem de progresso</strong>,
                          clique em <span className="font-semibold">"Confirmar"</span> apenas quando a transferência for <u>concluída</u>.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={confirmarContribuicao}
                          className="bg-church-700 hover:bg-church-800"
                        >
                          Confirmar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                </CardContent>
              </Card>
            </div>

            {/* Descrição e detalhes */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Sobre esta campanha</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    {contribuicao?.fullDescription && contribuicao.fullDescription.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">{paragraph}</p>
                    ))}
                    {!contribuicao?.fullDescription && contribuicao?.description && (
                      <p className="mb-4">{contribuicao.description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContribuicaoDetalhe;
