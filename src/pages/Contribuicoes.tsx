
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import ContribuicaoCard from "@/components/ui/ContribuicaoCard";
import { Loading } from "@/components/ui/loading";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import api from "@/services/api";
import { 
  CheckCircle2,
  Settings,
  Copy,
  Smartphone,
  CreditCard,
  ArrowRight
} from "lucide-react";

const Contribuicoes = () => {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  
  const [activeTab, setActiveTab] = useState("geral");
  const [campanhas, setCampanhas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  
  // Check if user has permission to manage contributions
  const canManageContributions = currentUser?.roles?.some(role => 
    ['ROLE_ADMIN', 'ROLE_PASTOR', 'ROLE_PASTORAUXILIAR', 'ROLE_LIDER'].includes(role)
  );

  // Carregar as campanhas de contribuição do API
  useEffect(() => {
    if (activeTab === "campanhas") {
      const carregarCampanhas = async () => {
        setLoading(true);
        try {
          const response = await api.get("/contribuicoes");
          setCampanhas(response.data);
        } catch (err) {
          console.error("Erro ao carregar campanhas:", err);
          setError("Não foi possível carregar as campanhas de contribuição.");
        } finally {
          setLoading(false);
        }
      };

      carregarCampanhas();
    }
  }, [activeTab]);

  const copyPixKey = () => {
    navigator.clipboard.writeText("icbcasadabencao610@gmail.com");
    toast({
      title: "Chave PIX copiada!",
      description: "A chave PIX foi copiada para sua área de transferência.",
    });
  };

  const renderCaixinhasContent = () => {
    if (loading) {
      return <Loading />;
    }

    if (error) {
      return (
        <Alert variant="destructive" className="my-8">
          <AlertTitle>Erro ao carregar campanhas</AlertTitle>
          <AlertDescription>
            {error}
            <div className="mt-4">
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Tentar novamente
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      );
    }

    if (campanhas.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">Nenhuma campanha encontrada</h3>
          <p className="text-gray-600">
            Não há campanhas de contribuição ativas no momento.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {campanhas.map((campanha) => (
          <ContribuicaoCard key={campanha.id} contribuicao={campanha} />
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="py-12 bg-gray-50">
        <div className="container-church max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-church-900 mb-3">Contribuições</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sua oferta é semear para o crescimento do Reino de Deus. Contribua com o trabalho da ICB 610 
              e faça parte dessa obra.
            </p>
          </div>

          <Tabs defaultValue="geral" className="mb-8" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="geral">Contribuição Geral</TabsTrigger>
              <TabsTrigger value="campanhas">Caixinhas de Contribuição</TabsTrigger>
            </TabsList>
            
            <TabsContent value="geral">
              <div className="grid md:grid-cols-12 gap-8 items-start">
                {/* Coluna de informações */}
                <div className="md:col-span-5 bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-bold mb-4 text-church-900">Por que contribuir?</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-church-700 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">Manutenção da igreja</h3>
                        <p className="text-gray-600 text-sm">Ajude a manter nossa estrutura física e funcionamento.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-church-700 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">Ação social</h3>
                        <p className="text-gray-600 text-sm">Contribua com nossos projetos sociais na comunidade.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-church-700 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">Evangelismo</h3>
                        <p className="text-gray-600 text-sm">Ajude a espalhar a palavra de Deus para mais pessoas.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-church-700 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">Projetos missionários</h3>
                        <p className="text-gray-600 text-sm">Apoie nossos missionários em diferentes regiões.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-church-50 p-4 rounded-md border border-church-100">
                    <h3 className="flex items-center gap-2 font-medium text-church-900">
                      <Smartphone className="h-5 w-5 text-church-700" />
                      Precisa de ajuda?
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Se tiver dúvidas sobre como contribuir, entre em contato pelo telefone 
                      (61) 99649-9589 ou envie um email para icbcasadabencao610@gmail.com
                    </p>
                  </div>
                </div>
                
                {/* Seção PIX */}
                <div className="md:col-span-7">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-church-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <img src="https://logospng.org/download/pix/logo-pix-icone-1024.png" alt="Pix" className="h-10 w-10" />
                      </div>
                      <h2 className="text-2xl font-bold text-church-900">Contribua via PIX</h2>
                      <p className="text-gray-600 mt-2">
                        Forma rápida, segura e sem taxas para fazer sua contribuição
                      </p>
                    </div>
                    
                    {/* Chave PIX */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700 mb-1">Chave PIX da Igreja:</p>
                          <p className="text-lg font-mono text-church-800 break-all">
                            icbcasadabencao610@gmail.com
                          </p>
                        </div>
                        <Button
                          onClick={copyPixKey}
                          variant="outline"
                          size="sm"
                          className="ml-3 flex-shrink-0"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copiar
                        </Button>
                      </div>
                    </div>
                    
                    {/* Tutorial */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-church-900">Como transferir:</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-church-700 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                            1
                          </div>
                          <div>
                            <p className="font-medium">Abra o aplicativo do seu banco</p>
                            <p className="text-sm text-gray-600">Acesse a área PIX do seu aplicativo bancário</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-church-700 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                            2
                          </div>
                          <div>
                            <p className="font-medium">Escolha "Transferir" ou "Enviar PIX"</p>
                            <p className="text-sm text-gray-600">Selecione a opção de fazer uma transferência PIX</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-church-700 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                            3
                          </div>
                          <div>
                            <p className="font-medium">Cole a chave PIX</p>
                            <p className="text-sm text-gray-600">Use a chave copiada: icbcasadabencao610@gmail.com</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-church-700 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                            4
                          </div>
                          <div>
                            <p className="font-medium">Confirme os dados</p>
                            <p className="text-sm text-gray-600">Verifique se aparece "Igreja Casa da Benção" como destinatário</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-church-700 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                            5
                          </div>
                          <div>
                            <p className="font-medium">Insira o valor e confirme</p>
                            <p className="text-sm text-gray-600">Digite o valor da sua contribuição e finalize a transferência</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-6">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-blue-900">Transferência instantânea</h4>
                            <p className="text-sm text-blue-700">
                              O PIX é processado imediatamente e sua contribuição chegará na hora para a igreja. 
                              Guarde o comprovante para seus registros.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="campanhas">
              <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-church-900">Caixinhas de Contribuição</h2>
                    <p className="text-gray-600">Campanhas específicas para necessidades da igreja e projetos especiais</p>
                  </div>
                  
                  {canManageContributions && (
                    <div className="mt-4 md:mt-0">
                      <Button 
                        onClick={() => navigate('/contribuicoes/gerenciar')}
                        className="bg-church-700 hover:bg-church-800"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Ações Contribuições
                      </Button>
                    </div>
                  )}
                </div>
                
                {renderCaixinhasContent()}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Contribuicoes;
