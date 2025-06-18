
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Bug, Mail, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const bugReportSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  pagina: z.string().min(1, "Informe em qual página ocorreu o erro"),
  descricao: z.string().min(10, "Descreva o problema com pelo menos 10 caracteres"),
});

type BugReportForm = z.infer<typeof bugReportSchema>;

const RelatarBug = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<BugReportForm>({
    resolver: zodResolver(bugReportSchema),
    defaultValues: {
      nome: "",
      email: "",
      pagina: "",
      descricao: "",
    },
  });

  const onSubmit = async (data: BugReportForm) => {
    setIsSubmitting(true);
    
    try {
      // Criar o corpo do email
      const emailBody = `
Nome: ${data.nome}
Email: ${data.email}
Página onde ocorreu: ${data.pagina}

Descrição do problema:
${data.descricao}

---
Enviado através do sistema de relatório de bugs - ICB 610 Beta
      `.trim();

      // Criar link mailto
      const subject = encodeURIComponent("Bug Report - ICB 610 Beta");
      const body = encodeURIComponent(emailBody);
      const mailtoLink = `mailto:icbcasadabencao610@gmail.com?subject=${subject}&body=${body}`;

      // Abrir cliente de email
      window.location.href = mailtoLink;

      toast({
        title: "Relatório enviado!",
        description: "Seu cliente de email foi aberto. Obrigado pelo feedback!",
      });

      // Limpar formulário
      form.reset();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao abrir o email. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container-church py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <Bug className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-church-900 mb-4">
              Relatório de Bug
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Está enfrentando algum bug ou erro?
            </p>
            <p className="text-gray-600">
              Envie uma mensagem para a gente explicando o que aconteceu para resolvermos o mais rápido possível!
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Versão Beta
              </CardTitle>
              <CardDescription>
                Este sistema está em versão beta. Seu feedback é muito importante para melhorarmos a experiência de todos os usuários.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome *</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome" {...field} />
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
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="seu.email@exemplo.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="pagina"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Página onde ocorreu o erro *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Página de membros, login, eventos..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="descricao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição do problema *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva detalhadamente o que aconteceu. Inclua os passos que você seguiu antes do erro ocorrer, qual mensagem apareceu, etc."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Como funciona:</p>
                        <p>
                          Ao clicar em "Enviar Relatório", seu cliente de email padrão será aberto 
                          com uma mensagem pré-formatada para <strong>icbcasadabencao610@gmail.com</strong>. 
                          Você poderá revisar e enviar a mensagem.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-church-700 hover:bg-church-800"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Abrindo email..." : "Enviar Relatório"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Agradecemos sua paciência e colaboração para melhorar nosso sistema!
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RelatarBug;
