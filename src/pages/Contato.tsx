
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

// Define form validation schema
const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  subject: z.string().min(5, "Assunto deve ter pelo menos 5 caracteres"),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres")
});

type ContactFormValues = z.infer<typeof formSchema>;

const Contato = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    }
  });

  const onSubmit = (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Form data:", data);
      
      toast({
        title: "Mensagem enviada",
        description: "Recebemos sua mensagem e entraremos em contato em breve.",
      });
      
      form.reset();
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Layout>
      <div className="container-church py-12">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-4xl font-bold text-church-900 mb-4">Entre em Contato</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Estamos aqui para responder suas perguntas e auxiliar em sua jornada espiritual.
            Não hesite em entrar em contato.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-church-900 mb-6">Envie-nos uma mensagem</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome completo" {...field} />
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="seu.email@exemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="(XX) XXXXX-XXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assunto</FormLabel>
                        <FormControl>
                          <Input placeholder="Motivo do contato" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensagem</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Digite sua mensagem aqui..." 
                          className="min-h-[150px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-church-700 hover:bg-church-800"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Enviando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send size={18} />
                      Enviar Mensagem
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          </div>

          {/* Contact Information */}
          <div className="bg-church-50 p-8 rounded-xl">
            <h2 className="text-2xl font-bold text-church-900 mb-6">Informações de Contato</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-church-100 p-3 rounded-full text-church-700">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-church-900">Endereço</h3>
                  <p className="text-gray-600">QS 610 - Samambaia, Brasília - DF, 72320-500</p>
                  <a 
                    href="https://www.google.com/maps/place/Igreja+Casa+Da+Bencao/@-15.8712465,-48.0704318,15z/data=!4m6!3m5!1s0x935a32ad2f29b613:0x1adc8d6dfc71e5df!8m2!3d-15.8563574!4d-48.0797843!16s%2Fg%2F11cs01rnj5?entry=ttu&g_ep=EgoyMDI1MDQxNi4xIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-church-700 hover:underline mt-1 inline-block"
                  >
                    Ver no mapa
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-church-100 p-3 rounded-full text-church-700">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-church-900">Telefone</h3>
                  <p className="text-gray-600">(61) 99649-9589</p>
                  <p className="text-gray-600">(61) 99649-9589 (WhatsApp)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-church-100 p-3 rounded-full text-church-700">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-church-900">Email</h3>
                  <p className="text-gray-600">icbcasadabencao610@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-church-100 p-3 rounded-full text-church-700">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-church-900">Horários</h3>
                  <p className="text-gray-600 font-medium">Cultos:</p>
                  <p className="text-gray-600">Domingo: 18:30h</p>
                  <p className="text-gray-600">Terça: 20h</p>
                  <p className="text-gray-600">Quarta: 20h</p>
                  <p className="text-gray-600">Sexta: 20h</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-16">
          <h2 className="text-2xl font-bold text-church-900 mb-6 text-center">Como Chegar</h2>
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
            <div className="text-gray-500 p-8 text-center">
              {/* Placeholder for Google Maps iframe */}
              <p className="text-lg mb-2">Mapa da Igreja</p>
              <p className="text-sm">Aqui será inserido o mapa do Google Maps com a localização da igreja.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-church-50 p-8 rounded-xl mb-12">
          <h2 className="text-2xl font-bold text-church-900 mb-6 text-center">Perguntas Frequentes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg text-church-900 mb-2">Quais são os horários dos cultos?</h3>
              <p className="text-gray-600">Nossos cultos acontecem aos domingos às 9h e 18h, e às quartas-feiras às 19h30.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg text-church-900 mb-2">Como posso me tornar membro da igreja?</h3>
              <p className="text-gray-600">Para se tornar membro, você pode participar do nosso curso de novos membros que acontece mensalmente. Entre em contato para saber a próxima data.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg text-church-900 mb-2">A igreja possui estacionamento?</h3>
              <p className="text-gray-600">Sim, possuímos estacionamento próprio com capacidade para 50 veículos, disponível durante todos os cultos e eventos.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg text-church-900 mb-2">Como posso agendar um aconselhamento pastoral?</h3>
              <p className="text-gray-600">Os aconselhamentos são agendados através da secretaria da igreja, por telefone ou presencialmente, conforme a disponibilidade dos pastores.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-church-700 text-white p-10 rounded-xl">
          <h2 className="text-3xl font-bold mb-4">Venha nos Visitar</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Será um prazer receber você e sua família em nossa comunidade.
            Venha conhecer nossa igreja e fazer parte desta família.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button className="bg-white text-church-900 hover:bg-gray-100">
              Ver Horários dos Cultos
            </Button>
            <Button className="bg-transparent border-2 border-white hover:bg-white/10">
              Agendar uma Visita
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contato;
