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
import InputMask from "react-input-mask";
import { toast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { User, UserCheck, Mail, Phone, MessageSquareText, Loader2, Lock } from "lucide-react";
import api from "@/services/api";
import { verificarEmailReal } from "@/utils/verificarEmailReal";

// Schema para validação dos dados do formulário
const cadastroSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Digite um e-mail válido" }),
  phone: z.string().min(14, { message: "Telefone deve estar no formato (XX) XXXXX-XXXX" }),
  password: z.string().min(8, { message: "Senha deve ter pelo menos 8 caracteres" }),
  confirmPassword: z.string(),
  member: z.boolean({ required_error: "Informe se é membro ou não" }),
  address: z.string().optional(),
  birthDate: z.string().optional(),
  maritalStatus: z.string().optional(),
  baptized: z.boolean().optional(),
  ministries: z.array(z.number()).optional(),
  acceptedTerms: z.boolean().refine(val => val === true, {
    message: "Você precisa aceitar os termos para continuar.",
  }),
})
  .refine((data) => {
    if (data.member === true && (!data.ministries || data.ministries.length === 0)) {
      return false;
    }
    return true;
  }, {
    message: "Selecione pelo menos um ministério",
    path: ["ministries"],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type CadastroValues = z.infer<typeof cadastroSchema>;

const Cadastro = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [ministerios, setMinisterios] = useState<{ id: number; name: string }[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<CadastroValues>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      member: false,
      address: "",
      birthDate: "",
      maritalStatus: "",
      baptized: false,
      ministries: [],
      acceptedTerms: false
    }
  });


  const isMembro = form.watch("member") === true;


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

  // Função para abrir Instagram
  const openInstagram = () => {
    const name = form.getValues("name");
    window.open("https://www.instagram.com/icb_610/", "_blank");
  };

  // Avançar para o próximo passo
  const nextStep = async () => {
    const isValid = await form.trigger(["name", "email", "member"]);
    if (isValid) setStep(2);
  };

  const previousStep = () => setStep(1);

  const navigate = useNavigate();


  // Função para lidar com o envio do formulário
  const handleSubmit = async (data: CadastroValues) => {
    setIsSubmitting(true);
    console.log("Dados enviados:", data);

    // Validação real do e-mail usando Mailboxlayer
    const emailValido = await verificarEmailReal(data.email);
    if (!emailValido) {
      toast({
        title: "E-mail inválido",
        description: "O e-mail informado parece inválido ou é de domínio descartável. Por favor, use outro.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const roles = data.member === true ? ["ROLE_MEMBRO"] : ["ROLE_VISITANTE"];
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        password: data.password,
        member: data.member,
        roles,
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
          : "Agradecemos seu cadastro! Você será direcionado para nosso Instagram.",
      });

      navigate("/login");

      if (!isMembro) {
        openInstagram();
      }
    } catch (error) {
      const errMsg = error?.response?.data;

      if (error?.response?.status === 409) {
        toast({
          title: "E-mail já cadastrado",
          description: "Este e-mail já está em uso. Faça login ou recupere sua senha.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro no cadastro",
          description: errMsg || "Ocorreu um erro ao processar seu cadastro. Por favor, tente novamente.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }

  }

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

                    {/* Campo de Senha */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <div className="flex items-center relative">
                              <Lock className="absolute left-3 text-gray-500" size={18} />
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Digite uma senha"
                                className="pl-10 pr-10"
                                {...field}
                              />
                              <button
                                type="button"
                                className="absolute right-3 text-gray-500"
                                onClick={() => setShowPassword((prev) => !prev)}
                                tabIndex={-1}
                              >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />


                    {/* Campo de Confirmação de Senha */}
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar Senha</FormLabel>
                          <FormControl>
                            <div className="flex items-center relative">
                              <Lock className="absolute left-3 text-gray-500" size={18} />
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirme sua senha"
                                className="pl-10 pr-10"
                                {...field}
                              />
                              <button
                                type="button"
                                className="absolute right-3 text-gray-500"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                tabIndex={-1}
                              >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
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
                              <InputMask
                                mask="(99) 99999-9999"
                                value={field.value}
                                onChange={field.onChange}
                              >
                                {(inputProps) => (
                                  <Input
                                    {...inputProps}
                                    placeholder="(XX) XXXXX-XXXX"
                                    className="pl-10"
                                  />
                                )}
                              </InputMask>
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
                              onValueChange={(val) => field.onChange(val === "sim")}
                              value={field.value ? "sim" : "nao"} // controla o valor visual
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
                                <Select value={field.value} onValueChange={field.onChange}>
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
                          <h3 className="text-lg font-medium text-church-800">Fale Conosco no Instagram</h3>
                        </div>
                        <p className="text-gray-600 mb-4">
                          Obrigado pelo seu interesse! Após o cadastro, você será direcionado para o Instagram da igreja. 
                          Clique no botão "Enviar Mensagem" ou "Mensagem" para entrar em contato conosco e receber mais 
                          informações sobre nossas atividades. Não esqueça de nos seguir por lá!
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
