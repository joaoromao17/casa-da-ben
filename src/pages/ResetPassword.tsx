
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
import { Mail, ArrowLeft, Loader2, Check } from "lucide-react";

// Schema para validação do email
const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Email inválido" })
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: ""
    }
  });

  // Função para lidar com o envio do formulário
  const onSubmit = async (data: ResetPasswordValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulando uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Solicitação de redefinição para:", data.email);
      
      toast({
        title: "Email enviado!",
        description: "Instruções de redefinição de senha foram enviadas para seu email.",
      });

      setEmailSent(true);
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      toast({
        title: "Erro ao enviar email",
        description: "Não foi possível enviar o email de redefinição. Tente novamente.",
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
          <h1 className="section-title">Redefinir Senha</h1>
          <p className="text-lg text-gray-600">
            Receba um link para criar uma nova senha
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Esqueceu sua senha?</CardTitle>
            <CardDescription>
              {!emailSent 
                ? "Informe seu email e enviaremos instruções para redefinir sua senha" 
                : "Email enviado com sucesso!"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!emailSent ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail cadastrado</FormLabel>
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
                      "Enviar instruções"
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
                  Enviamos um email para <span className="font-medium">{form.getValues().email}</span> com instruções para redefinir sua senha.
                </p>
                <p className="text-sm text-gray-500">
                  Verifique sua caixa de entrada e a pasta de spam. O link de redefinição é válido por 24 horas.
                </p>
                <Button 
                  onClick={() => {
                    form.reset();
                    setEmailSent(false);
                  }}
                  variant="outline"
                  className="mt-2"
                >
                  Tentar com outro email
                </Button>
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

export default ResetPassword;
