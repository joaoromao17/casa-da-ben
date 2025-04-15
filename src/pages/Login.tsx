
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, Loader2, Send } from "lucide-react";

// Schema para validação do login por email/senha
const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  senha: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  lembrar: z.boolean().optional()
});

// Schema para validação do login por código
const codeLoginSchema = z.object({
  emailOrPhone: z.string().min(5, { message: "Email ou telefone inválido" })
});

type LoginValues = z.infer<typeof loginSchema>;
type CodeLoginValues = z.infer<typeof codeLoginSchema>;

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  
  // Formulário de login por email/senha
  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      senha: "",
      lembrar: false
    }
  });

  // Formulário de login por código
  const codeForm = useForm<CodeLoginValues>({
    resolver: zodResolver(codeLoginSchema),
    defaultValues: {
      emailOrPhone: ""
    }
  });

  // Função para lidar com o envio do formulário de login por email/senha
  const onLoginSubmit = async (data: LoginValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulando uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Login com:", data);
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Você será redirecionado para a área de membros.",
      });

      // Redirecionar para a área de membros
      window.location.href = "/area-membro";
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para lidar com o envio do código de acesso
  const onCodeSubmit = async (data: CodeLoginValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulando uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Enviando código para:", data.emailOrPhone);
      
      toast({
        title: "Código enviado!",
        description: `Enviamos um código de acesso para ${data.emailOrPhone}. Por favor, verifique sua caixa de entrada.`,
      });

      setCodeSent(true);
    } catch (error) {
      console.error("Erro ao enviar código:", error);
      toast({
        title: "Erro ao enviar código",
        description: "Não foi possível enviar o código. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para verificar o código inserido
  const verifyCode = (code: string) => {
    if (code.length === 6) {
      setIsSubmitting(true);
      
      // Simulando verificação do código
      setTimeout(() => {
        console.log("Verificando código:", code);
        
        toast({
          title: "Código verificado!",
          description: "Login realizado com sucesso. Você será redirecionado para a área de membros.",
        });
        
        // Redirecionar para a área de membros
        window.location.href = "/area-membro";
        
        setIsSubmitting(false);
      }, 1500);
    }
  };

  return (
    <Layout>
      <div className="container-church py-12 max-w-md">
        <div className="text-center mb-10">
          <h1 className="section-title">Área do Membro</h1>
          <p className="text-lg text-gray-600">
            Acesse conteúdos exclusivos para membros da igreja
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar a área restrita
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="email">E-mail e Senha</TabsTrigger>
                <TabsTrigger value="code">Código por E-mail/WhatsApp</TabsTrigger>
              </TabsList>
              
              <TabsContent value="email">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                    <FormField
                      control={loginForm.control}
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
                      control={loginForm.control}
                      name="senha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <div className="flex items-center relative">
                              <Lock className="absolute left-3 text-gray-500" size={18} />
                              <Input 
                                type="password" 
                                placeholder="Digite sua senha" 
                                className="pl-10" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="lembrar"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="leading-none">
                            <FormLabel>
                              Lembrar de mim
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Entrando...
                        </>
                      ) : (
                        "Entrar"
                      )}
                    </Button>
                  </form>
                </Form>
                
                <div className="text-center mt-4">
                  <Button variant="link" className="text-church-600 hover:text-church-800">
                    Esqueci minha senha
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="code">
                {!codeSent ? (
                  <Form {...codeForm}>
                    <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="space-y-6">
                      <FormField
                        control={codeForm.control}
                        name="emailOrPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail ou WhatsApp</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Digite seu e-mail ou WhatsApp" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Enviaremos um código de acesso para este contato.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full btn-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Enviar Código
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="mb-4">Insira o código de 6 dígitos enviado para seu contato:</p>
                      
                      <div className="flex justify-center gap-2">
                        {Array(6).fill(0).map((_, i) => (
                          <Input 
                            key={i}
                            type="text" 
                            className="w-12 h-12 text-center text-lg font-bold"
                            maxLength={1}
                            onChange={(e) => {
                              // Move para o próximo input
                              if (e.target.value && e.target.nextElementSibling instanceof HTMLInputElement) {
                                e.target.nextElementSibling.focus();
                              }
                              
                              // Verificar se todos os inputs foram preenchidos
                              const inputs = Array.from(document.querySelectorAll('input[type="text"]')) as HTMLInputElement[];
                              const code = inputs.map(input => input.value).join('');
                              if (code.length === 6) {
                                verifyCode(code);
                              }
                            }}
                            onKeyDown={(e) => {
                              // Move para o input anterior ao apagar
                              if (e.key === 'Backspace' && !e.currentTarget.value && e.currentTarget.previousElementSibling instanceof HTMLInputElement) {
                                e.currentTarget.previousElementSibling.focus();
                              }
                            }}
                          />
                        ))}
                      </div>
                      
                      <p className="mt-4 text-sm text-gray-500">
                        Não recebeu o código? <Button variant="link" className="p-0 h-auto text-church-600 hover:text-church-800" onClick={() => setCodeSent(false)}>Tentar novamente</Button>
                      </p>
                    </div>
                    
                    {isSubmitting && (
                      <div className="flex justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-church-600" />
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              Ainda não tem cadastro? <Link to="/cadastro" className="text-church-600 hover:text-church-800 font-medium">Cadastre-se aqui</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
