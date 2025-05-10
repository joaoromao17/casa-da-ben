
import { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { User, UserCheck, Mail, Phone, MessageSquareText, Loader2, Lock } from "lucide-react";
import api from "@/services/api";

// Schema para validação dos dados do formulário
const cadastroSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Digite um e-mail válido" }),
  phone: z.string().optional(),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  member: z.enum(["sim", "nao"]),
  roles: z.string().optional(),
  address: z.string().optional(),
  birthDate: z.string().optional(),
  maritalStatus: z.string().optional(),
  baptized: z.boolean().optional(),
  ministries: z.array(z.number()).optional(), // <-- alterado aqui
  acceptedTerms: z.boolean().refine(val => val === true, {
    message: "Você precisa aceitar os termos para continuar.",
  }),
}).refine((data) => {
  if (data.member === "sim" && (!data.ministries || data.ministries.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "Selecione pelo menos um ministério",
  path: ["ministries"],
});

type CadastroValues = z.infer<typeof cadastroSchema>;

const Cadastro = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [ministerios, setMinisterios] = useState<{ id: number; name: string }[]>([]);

  const form = useForm<CadastroValues>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      member: "nao",
      acceptedTerms: false
    }
  });

  const isMembro = form.watch("member") === "sim";

  const verificarEmailReal = async (email: string): Promise<boolean> => {
    try {
      const res = await fetch(`http://apilayer.net/api/check?access_key=ee5c6e9beae86c9c83973b84176b5d88&email=${email}&smtp=1&format=1`);
      const data = await res.json();

      // Verifica se o email é válido e entregável
      return data.format_valid && data.smtp_check;
    } catch (err) {
      console.error("Erro ao verificar email:", err);
      return false;
    }
  };


  useEffect(() => {
    const fetchMinisterios = async () => {
      try {
        const response = await api.get("/ministerios");
        setMinisterios(response.data);
      } catch (error) {
        console.error("Erro ao carregar ministérios:", error);
      }
    };
    fetchMinisterios();
  }, []);


  // Função para lidar com o envio do formulário
  const handleSubmit = async (data: CadastroValues) => {
    setIsSubmitting(true);
    console.log("Dados enviados:", data);

    // Validação real do e-mail usando Mailboxlayer
    const emailValido = await verificarEmailReal(data.email);
    if (!emailValido) {
      toast({
        title: "E-mail inválido",
        description: "O e-mail informado não parece ser válido ou está inativo. Por favor, verifique.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        password: data.password,
        member: data.member === "sim" ? "sim" : "nao",
        roles: data.member === "sim" ? "membro" : "visitante",
        address: data.address || null,
        birthDate: data.birthDate ? `${data.birthDate}T00:00:00` : null,
        maritalStatus: data.maritalStatus || null,
        baptized: data.baptized === true,
        ministries: data.ministries?.map(id => ({ id })) || [],
        acceptedTerms: data.acceptedTerms
      };

      await api.post("/users", payload);

      toast({
        title: "Cadastro realizado com sucesso!",
        description: isMembro
          ? "Sua conta foi criada. Você agora tem acesso às áreas restritas."
          : "Agradecemos seu cadastro! Entraremos em contato em breve.",
      });

      navigate("/login");

      if (!isMembro) {
        openWhatsApp();
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro ao processar seu cadastro. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };



  // Função para abrir WhatsApp
  const openWhatsApp = () => {
    const name = form.getValues("name");
    const message = `Olá! Meu nome é ${name}. Acabei de me cadastrar no site da Igreja Casa da Benção e gostaria de receber mais informações.`;
    window.open(`https://wa.me/5561986149855?text=${encodeURIComponent(message)}`, "_blank");
  };

  // Avançar para o próximo passo
  const nextStep = async () => {
    const isValid = await form.trigger(["name", "email", "member"]);
    if (isValid) setStep(2);
  };

  const previousStep = () => setStep(1);

  const navigate = useNavigate();

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
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {step === 1 && (
                  <>
                    <FormField
                      control={form.control}
                      name="name"
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
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <div className="flex items-center relative">
                              <Lock className="absolute left-3 text-gray-500" size={18} />
                              <Input placeholder="Digite uma senha" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
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
                      name="member"
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
                          name="roles"
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
                                  <SelectItem value="pastor">Pastor(a)</SelectItem>
                                  <SelectItem value="presbitero">Presbítero(a)</SelectItem>
                                  <SelectItem value="obreiro">Obreiro(a)</SelectItem>
                                  <SelectItem value="evangelista">Evangelista</SelectItem>
                                  <SelectItem value="diacono">Diácono</SelectItem>
                                  <SelectItem value="missionario">Missionário(a)</SelectItem>
                                  <SelectItem value="professor">Professor(a)</SelectItem>
                                  <SelectItem value="lider">Líder</SelectItem>
                                  <SelectItem value="membro">Membro(a)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="ministries"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ministérios</FormLabel>
                              <div className="space-y-2">
                                {ministerios.map((min) => (
                                  <div key={min.id} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`min-${min.id}`}
                                      checked={field.value?.includes(min.id) || false}
                                      onCheckedChange={(checked) => {
                                        const current = field.value || [];
                                        if (checked) {
                                          field.onChange([...current, min.id]);
                                        } else {
                                          field.onChange(current.filter((id) => id !== min.id));
                                        }
                                      }}
                                    />
                                    <label htmlFor={`min-${min.id}`} className="text-sm">
                                      {min.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />


                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Endereço</FormLabel>
                              <FormControl>
                                <div className="flex items-center relative">
                                  <User className="absolute left-3 text-gray-500" size={18} />
                                  <Input placeholder="Digite o seu endereço" className="pl-10" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="birthDate"
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
                            name="maritalStatus"
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
                          name="baptized"
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
                      name="acceptedTerms"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Concordo com os termos e condições de uso
                          </FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between">
                      <Button type="button" onClick={previousStep} variant="secondary">
                        Voltar
                      </Button>
                      <Button type="submit" className="btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="animate-spin mr-2" size={18} /> : "Cadastrar"}
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
          <Button variant="link" className="text-church-600 hover:text-church-800" onClick={() => {
            if (isMembro) {
              navigate("/login");
            }
          }}>
            Faça login aqui
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Cadastro;
