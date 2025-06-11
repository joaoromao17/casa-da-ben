
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
import { Mail, Phone, MapPin, Clock, Send, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

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
          <div className="bg-white p-8 rounded-xl shadow-md text-gray-700 space-y-4">
            <h2 className="text-2xl font-bold text-church-800">Venha nos visitar!</h2>
            <p className="text-lg">
              Não há nada como estar na presença de Deus junto com irmãos. Nossa igreja está de portas abertas para receber você e sua família.
            </p>
            <p className="text-lg">
              Esperamos por você em um de nossos cultos presenciais!
            </p>
            <img
              src="/lovable-uploads/contato.jpg"
              alt="Igreja Casa da Benção"
              className="rounded-xl shadow-md border border-gray-200"
            />
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

              {/*
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
              */}

              <div className="flex items-start gap-4">
                <div className="bg-church-100 p-3 rounded-full text-church-700">
                  <Instagram size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-church-900">Instagram</h3>
                  <a href="https://www.instagram.com/icb_610/" target="_blank" rel="noopener noreferrer" className="text-church-700 hover:underline mt-1 inline-block">@icb_610</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-church-100 p-3 rounded-full text-church-700">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-church-900">Email</h3>
                  <a href="mailto:icbcasadabencao610@gmail.com" className="ttext-church-700 hover:underline mt-1 inline-block">icbcasadabencao610@gmail.com</a>
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
              <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15350.884606274025!2d-48.0704318!3d-15.8712465!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a32ad2f29b613%3A0x1adc8d6dfc71e5df!2sIgreja%20Casa%20Da%20Bencao!5e0!3m2!1spt-BR!2sbr!4v1745341351430!5m2!1spt-BR!2sbr" width="1170" height="660" loading="lazy"></iframe>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-church-50 p-8 rounded-xl mb-12">
          <h2 className="text-2xl font-bold text-church-900 mb-6 text-center">Perguntas Frequentes</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg text-church-900 mb-2">Quais são os horários dos cultos?</h3>
              <p className="text-gray-600">Nossos cultos acontecem aos domingos às 18h:30 e as sextas às 20h.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg text-church-900 mb-2">Como posso me tornar membro da igreja?</h3>
              <p className="text-gray-600">Para se tornar membro, basta enviar-nos uma mensagem ou ir a nossa igreja.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg text-church-900 mb-2">A igreja possui estacionamento?</h3>
              <p className="text-gray-600">Sim, possuímos estacionamento próprio com capacidade para 30 veículos.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg text-church-900 mb-2">Como posso agendar um aconselhamento pastoral?</h3>
              <p className="text-gray-600">Os aconselhamentos são agendados diretamente com os pastores.</p>
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
            <Link to="/Cultos">
              <Button className="bg-white text-church-900 hover:bg-gray-100">
                Ver Horários dos Cultos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contato;
