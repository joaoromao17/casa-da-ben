
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2, Eye, EyeOff, Check } from "lucide-react";
import api from "@/services/api";

// Schema para validação da nova senha
const newPasswordSchema = z.object({
  novaSenha: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  confirmarNovaSenha: z.string()
}).refine((data) => data.novaSenha === data.confirmarNovaSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarNovaSenha"]
});

type NewPasswordValues = z.infer<typeof newPasswordSchema>;

const NewPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const form = useForm<NewPasswordValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      novaSenha: "",
      confirmarNovaSenha: ""
    }
  });

  // Verificar se o token está presente na URL
  useEffect(() => {
    if (!token) {
      toast({
        title: "Erro de validação",
        description: "Link de redefinição de senha inválido ou expirado.",
        variant: "destructive"
      });
       // Redireciona para a página de solicitação após um tempo
    setTimeout(() => {
      navigate("/reset-password");
    }, 4000);
    }
  }, [token, navigate]);

  // Função para lidar com o envio do formulário
  const onSubmit = async (data: NewPasswordValues) => {
    if (!token) {
      toast({
        title: "Erro de validação",
        description: "Token de redefinição não encontrado.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Enviando requisição para API
      await api.post("/users/reset-password", {
        token,
        newPassword: data.novaSenha
      });
      
      toast({
        title: "Senha alterada com sucesso!",
        description: "Sua senha foi redefinida. Agora você pode fazer login com sua nova senha.",
      });

      setResetSuccess(true);
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      toast({
        title: "Erro ao redefinir senha",
        description: "Não foi possível redefinir sua senha. O link pode ter expirado ou ser inválido.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container-church py-12 max-w-md">
        <div className="text-center mb-10">
          <h1 className="section-title">Criar Nova Senha</h1>
          <p className="text-lg text-gray-600">
            {!resetSuccess 
              ? "Defina sua nova senha para acesso" 
              : "Senha alterada com sucesso!"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {!resetSuccess ? "Nova senha" : "Senha redefinida!"}
            </CardTitle>
            <CardDescription>
              {!resetSuccess 
                ? "Escolha uma nova senha forte para sua conta" 
                : "Sua senha foi alterada com sucesso"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {!resetSuccess ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {!token && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                      <p className="text-red-700">
                        Token inválido ou expirado. Solicite um novo link de redefinição.
                      </p>
                    </div>
                  )}
                  
                  <FormField
                    control={form.control}
                    name="novaSenha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nova senha</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Digite sua nova senha" 
                              {...field} 
                            />
                            <button 
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                              tabIndex={-1}
                            >
                              {showPassword ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmarNovaSenha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar nova senha</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showConfirmPassword ? "text" : "password"} 
                              placeholder="Confirme sua nova senha" 
                              {...field} 
                            />
                            <button 
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                              tabIndex={-1}
                            >
                              {showConfirmPassword ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full btn-primary"
                    disabled={isSubmitting || !token}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Redefinindo...
                      </>
                    ) : (
                      "Redefinir Senha"
                    )}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-gray-600">
                  Sua senha foi redefinida com sucesso!
                </p>
                <p className="text-sm text-gray-500">
                  Agora você pode fazer login usando sua nova senha.
                </p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <Link to="/login" className="flex items-center text-church-600 hover:text-church-800">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default NewPassword;
