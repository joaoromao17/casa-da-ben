
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
import { Bug, Mail, AlertTriangle, Lightbulb } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const feedbackSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  tipo: z.enum(["bug", "sugestao"], { required_error: "Selecione o tipo do feedback" }),
  pagina: z.string().min(1, "Informe em qual página"),
  descricao: z.string().min(10, "Descreva com pelo menos 10 caracteres"),
});

type FeedbackForm = z.infer<typeof feedbackSchema>;

const RelatarBug = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      nome: "",
      email: "",
      tipo: undefined,
      pagina: "",
      descricao: "",
    },
  });

  const onSubmit = async (data: FeedbackForm) => {
    setIsSubmitting(true);
    
    try {
      const tipoTexto = data.tipo === "bug" ? "Bug Report" : "Sugestão de Melhoria";
      const descricaoLabel = data.tipo === "bug" ? "Descrição do problema:" : "Descrição da sugestão:";
      const paginaLabel = data.tipo === "bug" ? "Página onde ocorreu:" : "Página relacionada:";
      
      // Criar o corpo do email
      const emailBody = `
Tipo: ${tipoTexto}
Nome: ${data.nome}
Email: ${data.email}
${paginaLabel} ${data.pagina}

${descricaoLabel}
${data.descricao}

---
Enviado através do sistema de feedback - ICB 610 Beta
      `.trim();

      // Criar link mailto
      const subject = encodeURIComponent(`${tipoTexto} - ICB 610 Beta`);
      const body = encodeURIComponent(emailBody);
      const mailtoLink = `mailto:icbcasadabencao610@gmail.com?subject=${subject}&body=${body}`;

      // Abrir cliente de email
      window.location.href = mailtoLink;

      toast({
        title: data.tipo === "bug" ? "Bug relatado!" : "Sugestão enviada!",
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
                <div className="flex gap-2">
                  <Bug className="h-8 w-8 text-red-600" />
                  <Lightbulb className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-church-900 mb-4">
              Feedback & Sugestões
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Encontrou um bug ou tem uma ideia para melhorar o site?
            </p>
            <p className="text-gray-600">
              Envie seu feedback para nos ajudar a melhorar a experiência de todos!
            </p>
          </div>

          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Versão Beta
              </CardTitle>
              <CardDescription>
                Este sistema está em versão beta. Reportes de bugs e sugestões de melhorias são muito importantes para melhorarmos a experiência de todos os usuários.
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
                    name="tipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Feedback *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo de feedback" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="bug">🐛 Reportar Bug/Erro</SelectItem>
                            <SelectItem value="sugestao">💡 Sugestão de Melhoria</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pagina"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Página relacionada *</FormLabel>
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
                        <FormLabel>
                          {form.watch("tipo") === "bug" ? "Descrição do problema *" : "Descrição da sugestão *"}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={
                              form.watch("tipo") === "bug" 
                                ? "Descreva detalhadamente o que aconteceu. Inclua os passos que você seguiu antes do erro ocorrer, qual mensagem apareceu, etc."
                                : "Descreva sua ideia de melhoria. Como isso poderia melhorar a experiência dos usuários? Seja específico!"
                            }
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
                    {isSubmitting ? "Abrindo email..." : 
                     form.watch("tipo") === "bug" ? "Enviar Relatório de Bug" : "Enviar Sugestão"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Agradecemos seu feedback e colaboração para melhorar nosso sistema!
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RelatarBug;
