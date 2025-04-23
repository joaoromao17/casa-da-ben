
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { User, UserCheck, Mail, Phone, MessageSquareText, Loader2 } from "lucide-react";

// Schema para validação dos dados do formulário
const cadastroSchema = z.object({
  nome: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  telefone: z.string().optional(),
  membro: z.enum(["sim", "nao"]),
  cargo: z.string().optional(),
  endereço: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  dataNascimento: z.string().optional(),
  estadoCivil: z.string().optional(),
  batizado: z.boolean().optional(),
  tempoIgreja: z.string().optional(),
  aceitarTermos: z.boolean().refine(val => val === true, {
    message: "Você precisa aceitar os termos para continuar."
  })
});

type CadastroValues = z.infer<typeof cadastroSchema>;

const Cadastro = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  
  const form = useForm<CadastroValues>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      membro: "nao",
      aceitarTermos: false
    }
  });

  const isMembro = form.watch("membro") === "sim";

  // Função para lidar com o envio do formulário
  const onSubmit = async (data: CadastroValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulando uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Dados enviados:", data);
      
      // Redirecionar ou mostrar mensagem de sucesso
      toast({
        title: "Cadastro realizado com sucesso!",
        description: isMembro 
          ? "Sua conta foi criada. Você agora tem acesso às áreas restritas." 
          : "Agradecemos seu cadastro! Entraremos em contato em breve.",
      });

      // Redirecionar para página apropriada
      if (isMembro) {
        // Redirecionar para login ou dashboard
        window.location.href = "/login";
      } else {
        // Abrir WhatsApp ou mostrar informações de contato
        openWhatsApp();
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro ao processar seu cadastro. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para abrir WhatsApp
  const openWhatsApp = () => {
    const nome = form.getValues("nome");
    const message = `Olá! Meu nome é ${nome}. Acabei de me cadastrar no site da Igreja Casa da Benção e gostaria de receber mais informações.`;
    window.open(`https://wa.me/5500000000000?text=${encodeURIComponent(message)}`, "_blank");
  };

  // Avançar para o próximo passo
  const nextStep = () => {
    const fieldsToValidate = ["nome", "email", "membro"];
    const isValid = fieldsToValidate.every(field => {
      const result = form.trigger(field as keyof CadastroValues);
      return result;
    });

    if (isValid) {
      setStep(2);
    }
  };

  // Voltar para o passo anterior
  const previousStep = () => {
    setStep(1);
  };

  return (
    <Layout>
      <div className="container-church py-12 max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="section-title">Cadastre-se</h1>
          <p className="text-lg text-gray-600">
            Faça parte da nossa comunidade e receba informações sobre eventos e atividades
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Formulário de Cadastro</CardTitle>
            <CardDescription>
              Preencha seus dados para se cadastrar na Igreja Casa da Benção
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {step === 1 && (
                  <>
                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo</FormLabel>
                          <FormControl>
                            <div className="flex items-center relative">
                              <User className="absolute left-3 text-gray-500" size={18} />
                              <Input placeholder="Digite seu nome completo" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <div className="flex items-center relative">
                              <Mail className="absolute left-3 text-gray-500" size={18} />
                              <Input placeholder="Digite seu e-mail" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="telefone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone (opcional)</FormLabel>
                          <FormControl>
                            <div className="flex items-center relative">
                              <Phone className="absolute left-3 text-gray-500" size={18} />
                              <Input placeholder="(XX) XXXXX-XXXX" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="membro"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Você já é membro da Igreja Casa da Benção?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="sim" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Sim, sou membro
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="nao" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Não, ainda não sou membro
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end">
                      <Button 
                        type="button" 
                        onClick={nextStep}
                        className="btn-primary"
                      >
                        Próximo
                      </Button>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    {isMembro && (
                      <>
                        <FormField
                          control={form.control}
                          name="cargo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Qual seu cargo na igreja?</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione seu cargo" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="membro">Membro</SelectItem>
                                  <SelectItem value="obreiro">Obreiro</SelectItem>
                                  <SelectItem value="musico">Músico</SelectItem>
                                  <SelectItem value="diacono">Diácono</SelectItem>
                                  <SelectItem value="presbitero">Presbítero</SelectItem>
                                  <SelectItem value="pastor">Pastor</SelectItem>
                                  <SelectItem value="outro">Outro</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="dataNascimento"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Data de Nascimento</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="estadoCivil"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Estado Civil</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                                    <SelectItem value="casado">Casado(a)</SelectItem>
                                    <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                                    <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="batizado"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  Já sou batizado(a) nas águas
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    {!isMembro && (
                      <div className="bg-church-50 p-6 rounded-lg border border-church-100 mb-4">
                        <div className="flex items-center mb-4">
                          <MessageSquareText className="h-6 w-6 text-church-600 mr-2" />
                          <h3 className="text-lg font-medium text-church-800">Conversar com Alguém da Igreja</h3>
                        </div>
                        <p className="text-gray-600 mb-4">
                          Obrigado pelo seu interesse! Após o cadastro, você será redirecionado para o nosso grupo de WhatsApp
                          onde poderá conversar com um dos nossos ministros e receber mais informações sobre nossas atividades.
                        </p>
                      </div>
                    )}

                    <FormField
                      control={form.control}
                      name="aceitarTermos"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Aceito os termos de uso e política de privacidade
                            </FormLabel>
                            <FormDescription>
                              Concordo em receber informações da Igreja Casa da Benção.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={previousStep}
                      >
                        Voltar
                      </Button>
                      <Button 
                        type="submit" 
                        className="btn-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processando
                          </>
                        ) : (
                          <>
                            {isMembro ? "Finalizar Cadastro" : "Cadastrar e Conversar"}
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-2">Já possui cadastro?</p>
          <Button variant="link" className="text-church-600 hover:text-church-800" onClick={() => window.location.href = "/login"}>
            Faça login aqui
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Cadastro;
