
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, Loader2 } from "lucide-react";
import api from "@/services/api";

// Schema para validação do login
const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  senha: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  lembrar: z.boolean().optional()
});

type LoginValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formulário de login por email/senha
  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      senha: "",
      lembrar: false
    }
  });

  // Função para lidar com o envio do formulário de login
  const onLoginSubmit = async (data: LoginValues) => {
    setIsSubmitting(true);

    try {
      const response = await api.post("/auth/login", {
        email: data.email,
        password: data.senha, // o backend espera "password"
      });

      const token = response.data.token;

      // Salva o token localmente
      if (data.lembrar) {
        localStorage.setItem("authToken", token);
      } else {
        sessionStorage.setItem("authToken", token);
      }

      toast({
        title: "Login realizado com sucesso!",
        description: "Você será redirecionado para a área de membros.",
      });

      window.location.href = "/area-membro";
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      toast({
        title: "Erro no login",
        description:
          error.response?.data?.message || "Email ou senha incorretos. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
              <Link to="/redefinir-senha" className="text-church-600 hover:text-church-800">
                Esqueceu a senha? Redefina agora
              </Link>
            </div>
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
