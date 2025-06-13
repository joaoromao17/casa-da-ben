import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import ContribuicaoCard from "@/components/ui/ContribuicaoCard";
import { Loading } from "@/components/ui/loading";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import api from "@/services/api";
import { 
  CreditCard, 
  BanknoteIcon, 
  Landmark, 
  HelpCircle, 
  ChevronDown,
  CheckCircle2,
  ArrowRight,
  Settings
} from "lucide-react";

const schema = z.object({
  nome: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  valor: z.string().min(1, { message: "Por favor informe um valor" }),
  mensagem: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const Contribuicoes = () => {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  
  const [metodo, setMetodo] = useState<string>("pix");
  const [showInstructions, setShowInstructions] = useState(false);
  const [activeTab, setActiveTab] = useState("geral");
  const [campanhas, setCampanhas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      email: "",
      valor: "",
      mensagem: "",
    },
  });

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

  const onSubmit = (data: FormValues) => {
    // Aqui seria implementada a integração com gateway de pagamento
    console.log("Dados enviados:", { ...data, metodo });
    
    toast({
      title: "Contribuição registrada",
      description: "Obrigado por sua contribuição! Siga as instruções para finalizar.",
    });
    
    setShowInstructions(true);
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
                      <HelpCircle className="h-5 w-5 text-church-700" />
                      Precisa de ajuda?
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Se tiver dúvidas sobre como contribuir, entre em contato pelo telefone 
                      (61) 99649-9589 ou envie um email para icbcasadabencao610@gmail.com
                    </p>
                  </div>
                </div>
                
                {/* Formulário de contribuição */}
                <div className="md:col-span-7">
                  {!showInstructions ? (
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <h2 className="text-xl font-bold mb-6 text-church-900">Faça sua contribuição</h2>
                      
                      <div className="mb-6">
                        <Label className="text-base font-medium mb-3 block">Escolha o método de pagamento</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <Button
                            type="button"
                            variant={metodo === "pix" ? "default" : "outline"}
                            className={`flex flex-col items-center justify-center h-24 gap-2 ${
                              metodo === "pix" ? "bg-church-700 hover:bg-church-800" : ""
                            }`}
                            onClick={() => setMetodo("pix")}
                          >
                            <div className="h-8 w-8 flex items-center justify-center">
                              <img src="https://logospng.org/download/pix/logo-pix-icone-1024.png" alt="Pix" className="h-8" />
                            </div>
                            <span>PIX</span>
                          </Button>
                        </div>
                      </div>
                      
                    </div>
                  ) : (
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 className="h-8 w-8 text-green-500" />
                        </div>
                        <h2 className="text-xl font-bold text-church-900">Contribuição registrada!</h2>
                        <p className="text-gray-600 mt-2">
                          Obrigado por sua generosidade. Siga as instruções abaixo para finalizar.
                        </p>
                      </div>
                      
                      <div className="border rounded-lg overflow-hidden mb-6">
                        <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                          <h3 className="font-medium">Informações de pagamento</h3>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-gray-500"
                            onClick={() => {
                              // Função para copiar informações
                              toast({
                                title: "Informações copiadas",
                                description: "As informações de pagamento foram copiadas para a área de transferência."
                              });
                            }}
                          >
                            Copiar
                          </Button>
                        </div>
                        
                        <div className="p-4">
                          {metodo === "pix" && (
                            <div className="space-y-4">
                              <p className="text-sm text-gray-600">
                                Escaneie o QR Code abaixo ou use a chave PIX para realizar sua contribuição:
                              </p>
                              
                              <div className="flex justify-center my-4">
                                <div className="bg-white p-4 border rounded-md inline-block">
                                  <img 
                                    src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" 
                                    alt="QR Code PIX" 
                                    className="w-48 h-48"
                                  />
                                </div>
                              </div>
                              
                              <div className="bg-gray-50 p-3 rounded-md">
                                <p className="text-sm font-medium mb-1">Chave PIX:</p>
                                <p className="text-sm font-mono bg-white p-2 rounded border select-all">
                                  12345678901
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {metodo === "cartao" && (
                            <div className="space-y-4">
                              <p className="text-sm text-gray-600">
                                Você será redirecionado para a página de pagamento seguro. Clique no botão abaixo:
                              </p>
                              
                              <Button className="w-full bg-church-700 hover:bg-church-800">
                                Pagar com Cartão <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          )}
                          
                          {metodo === "boleto" && (
                            <div className="space-y-4">
                              <p className="text-sm text-gray-600">
                                Seu boleto foi gerado. Você pode imprimi-lo ou copiar o código de barras:
                              </p>
                              
                              <div className="bg-gray-50 p-3 rounded-md">
                                <p className="text-sm font-medium mb-1">Código de barras:</p>
                                <p className="text-sm font-mono bg-white p-2 rounded border break-all select-all">
                                  23790000123456789012345678901234567890123456789
                                </p>
                              </div>
                              
                              <Button className="w-full">
                                Imprimir Boleto
                              </Button>
                            </div>
                          )}
                          
                          {metodo === "transferencia" && (
                            <div className="space-y-3">
                              <p className="text-sm text-gray-600 mb-3">
                                Utilize os dados bancários abaixo para realizar sua transferência:
                              </p>
                              
                              <div className="space-y-2">
                                <div className="grid grid-cols-3 text-sm">
                                  <span className="font-medium">Banco:</span>
                                  <span className="col-span-2">123 - Banco ICB</span>
                                </div>
                                
                                <div className="grid grid-cols-3 text-sm">
                                  <span className="font-medium">Agência:</span>
                                  <span className="col-span-2">1234</span>
                                </div>
                                
                                <div className="grid grid-cols-3 text-sm">
                                  <span className="font-medium">Conta:</span>
                                  <span className="col-span-2">12345-6</span>
                                </div>
                                
                                <div className="grid grid-cols-3 text-sm">
                                  <span className="font-medium">CNPJ:</span>
                                  <span className="col-span-2">12.345.678/0001-90</span>
                                </div>
                                
                                <div className="grid grid-cols-3 text-sm">
                                  <span className="font-medium">Favorecido:</span>
                                  <span className="col-span-2">Igreja ICB 610</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <details className="group">
                          <summary className="flex justify-between items-center text-sm font-medium cursor-pointer">
                            Não recebemos sua contribuição? 
                            <ChevronDown className="h-4 w-4 text-gray-500 group-open:rotate-180 transition-transform" />
                          </summary>
                          
                          <div className="mt-3 text-sm text-gray-600">
                            <p>
                              Se você já realizou o pagamento e ele ainda não foi confirmado, entre em contato 
                              com nossa equipe financeira pelo e-mail financeiro@icb610.org ou pelo telefone 
                              (XX) XXXX-XXXX.
                            </p>
                          </div>
                        </details>
                      </div>
                      
                      <div className="border-t mt-6 pt-6">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            form.reset();
                            setShowInstructions(false);
                          }}
                        >
                          Fazer outra contribuição
                        </Button>
                      </div>
                    </div>
                  )}
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
