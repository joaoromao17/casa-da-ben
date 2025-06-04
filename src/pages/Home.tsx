import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import VerseCard from "@/components/ui/VerseCard";
import EventCard from "@/components/ui/EventCard";
import MinistryCard from "@/components/ui/MinistryCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Instagram, User, BookOpen, CalendarDays, ArrowRight, ArrowDown } from "lucide-react";
import InstagramWidget from "@/components/ui/InstagramWidget";
import api from "@/services/api";

interface Ministry {
  name: string;
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
}

type Evento = {
  time: string;
  description: string;
  id: number;
  title: string;
  date: string;
  location: string;
  imageUrl: string;
  category: string;
};

const Home = () => {
  const [verseOfDay, setVerseOfDay] = useState<{ verse: string; reference: string }>({
    verse: "",
    reference: "",
  });

  useEffect(() => {
    const fetchVerse = async () => {
      try {
        const res = await api.get('/versiculos/random'); // nova rota da sua API
        const data = res.data;

        console.log("Versículo recebido:", data);

        setVerseOfDay({
          verse: data.verse.trim(), // 'verse' vem do seu modelo Versiculo
          reference: data.reference,
        });
      } catch (error) {
        console.error("Erro ao buscar versículo:", error);
        setVerseOfDay({
          verse: "Erro ao carregar o versículo.",
          reference: "",
        });
      }
    };

    fetchVerse();
  }, []);

  const [ministries, setMinistries] = useState<Ministry[]>([]);

  useEffect(() => {
    async function fetchMinistries() {
      try {
        const response = await api.get("/ministerios");
        const limited = response.data.slice(0, 3); // limita para 3
        setMinistries(limited);
      } catch (error) {
        console.error("Erro ao buscar ministérios:", error);
      }
    }

    fetchMinistries();
  }, []);

  const [eventos, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    async function fetchEventos() {
      try {
        const response = await api.get("/eventos");

        const eventosComDataCorrigida = response.data.map((evento: any) => {
          const [year, month, day] = evento.date.split("-").map(Number);
          return {
            ...evento,
            date: new Date(year, month - 1, day), // ajusta para data local
          };
        });

        const eventosOrdenados = eventosComDataCorrigida.sort(
          (a: any, b: any) => a.date.getTime() - b.date.getTime()
        );

        setEventos(eventosOrdenados);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      }
    }

    fetchEventos();
  }, []);

  return <Layout>
    {/* Hero Section */}
    <section className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-church-900/70 to-church-800/70 z-10"></div>
      <div className="relative h-[70vh] min-h-[500px]">
        <img src="/lovable-uploads/banner_casa_da_bencao.jpeg" alt="Igreja Casa da Benção" className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center z-20">
          <div className="container-church text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Igreja Casa da Benção 610
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl">
              "Porque Deus não nos deu o espírito de covardia, mas de poder, de amor e de moderação."
              <span className="block mt-2 text-lg italic">2 Timóteo 1:7</span>
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/sobre">
                <Button className="bg-black/80 text-white hover:bg-black/60 text-lg py-6 px-8">
                  Conheça Nossa Igreja
                </Button>
              </Link>
              <Link to="/cultos">
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 text-lg py-6 px-8">
                  Horários de Culto
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Quick Access Buttons (Mobile) */}
    <section className="md:hidden bg-white py-6">
      <div className="container-church">
        <div className="grid grid-cols-2 gap-4">
          <Link to="/cadastro" className="flex flex-col items-center justify-center p-4 rounded-lg bg-church-50 hover:bg-church-100 transition-colors">
            <User className="h-8 w-8 text-church-600 mb-2" />
            <span className="text-center text-church-800 font-medium">Cadastre-se</span>
          </Link>
          <Link to="/estudos" className="flex flex-col items-center justify-center p-4 rounded-lg bg-church-50 hover:bg-church-100 transition-colors">
            <BookOpen className="h-8 w-8 text-church-600 mb-2" />
            <span className="text-center text-church-800 font-medium">Escola Bíblica</span>
          </Link>
          <Link to="/eventos" className="flex flex-col items-center justify-center p-4 rounded-lg bg-church-50 hover:bg-church-100 transition-colors">
            <CalendarDays className="h-8 w-8 text-church-600 mb-2" />
            <span className="text-center text-church-800 font-medium">Eventos</span>
          </Link>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-4 rounded-lg bg-church-50 hover:bg-church-100 transition-colors">
            <Instagram className="h-8 w-8 text-church-600 mb-2" />
            <span className="text-center text-church-800 font-medium">Instagram</span>
          </a>
        </div>
      </div>
    </section>

    {/* Welcome Section */}
    <section className="py-16 bg-gray-50">
      <div className="container-church">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Bem-vindo à Igreja Casa da Benção 610</h2>
            <p className="text-lg text-gray-700 mb-6">
              Somos uma igreja comprometida com a propagação do evangelho de Jesus Cristo e o
              desenvolvimento espiritual de cada membro. Nossa missão é impactar vidas através
              do amor de Deus e da mensagem transformadora da cruz.
            </p>
            <p className="text-lg text-gray-700 mb-8">
              Queremos que você faça parte da nossa família. Aqui você encontrará um ambiente
              acolhedor para crescer na fé e desenvolver seus dons e talentos para o Reino de Deus.
            </p>
            <Link to="/sobre">
              <Button className="btn-primary">
                Conheça Nossa História <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div>
            <img alt="Membros da Igreja Casa da Benção" className="rounded-lg shadow-lg max-w-full h-auto object-fill" src="/lovable-uploads/055ba792-c198-4d19-a42c-971ae55b0e51.jpg" />
          </div>
        </div>
      </div>
    </section>

    {/* Verse of the Day */}
    <section className="py-16 bg-white">
      <div className="container-church max-w-3xl">
        <h2 className="text-4xl font-bold text-center mb-6">Versículo do Dia</h2>
        <VerseCard verse={verseOfDay.verse} reference={verseOfDay.reference} />
        <div className="text-center mt-8">
          <Link to="/estudos">
            <Button variant="outline" className="btn-outline">
              Explorar Mais Estudos Bíblicos <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>

    {/* Featured Events */}
    <section className="py-16 bg-gray-100">
      <div className="container-church">
        <h2 className="text-3xl font-bold text-church-800 text-center mb-8">Próximos Eventos</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {eventos.map((evento) => (
            <EventCard
              key={evento.id}
              id={evento.id.toString()}
              title={evento.title}
              description={evento.description}
              date={new Date(evento.date)}
              time={evento.time}
              location={evento.location}
              imageUrl={evento.imageUrl}
              category={evento.category}
            />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/eventos">
            <Button className="btn-primary">
              Ver todos os eventos <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>

    {/* Services Times */}
    <section className="py-16 bg-church-800 text-white">
      <div className="container-church">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Nossos Cultos</h2>
          <p className="text-xl text-church-100 max-w-2xl mx-auto">
            Venha nos visitar e experimentar a presença de Deus em nossos cultos
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-church-700/50 p-8 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-3">Domingo</h3>
            <p className="text-lg mb-2">Culto da Família</p>
            <p className="text-church-gold font-bold">18:30</p>
          </div>

          <div className="bg-church-700/50 p-8 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-3">Terça-feira</h3>
            <p className="text-lg mb-2">Oração</p>
            <p className="text-church-gold font-bold">20h</p>
          </div>

          <div className="bg-church-700/50 p-8 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-3">Quarta-feira</h3>
            <p className="text-lg mb-2">Escola Bíblica</p>
            <p className="text-church-gold font-bold">20h</p>
          </div>

          <div className="bg-church-700/50 p-8 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-3">Sexta-feira</h3>
            <p className="text-lg mb-2">Culto de Libertação</p>
            <p className="text-church-gold font-bold">20:00</p>
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-xl mb-6">Estamos localizados na Qs 610 Samabaia Norte - DF</p>
          <Link to="/contato">
            <Button className="bg-white text-church-800 hover:bg-church-100 transition-transform hover:scale-105 duration-300">
              Como Chegar <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>

    {/* Our Ministries */}

    <section className="py-16 bg-gray-100">
      <div className="container-church">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-church-800">Nossos Ministérios</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubra como você pode servir e crescer em nossa comunidade através dos diversos ministérios
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {ministries.map((ministry, index) => (
            <MinistryCard
              key={ministry.id}
              title={ministry.name}
              description={ministry.description}
              imageUrl={ministry.imageUrl}
              slug={ministry.id.toString()}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/ministerios">
            <Button className="btn-primary">
              Conhecer Todos os Ministérios <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>


    {/* Testimonies Section 
    <section className="py-16 bg-white">
      <div className="container-church">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-bold text-church-800">Testemunhos</h2>
          <Link to="/testemunhos">
            <Button variant="ghost" className="text-church-600 hover:text-church-800">
              Ver Todos <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="recent">Recentes</TabsTrigger>
            <TabsTrigger value="featured">Destaques</TabsTrigger>
          </TabsList>
          <TabsContent value="recent">
            <div className="grid md:grid-cols-2 gap-8">
              {recentTestimonies.map((testimony, index) => <TestimonyCard key={index} name={testimony.name} date={testimony.date} content={testimony.content} isAnonymous={testimony.isAnonymous} />)}
            </div>
          </TabsContent>
          <TabsContent value="featured">
            <div className="grid md:grid-cols-2 gap-8">
              <TestimonyCard name="João Oliveira" date={new Date(2025, 2, 20)} content="Entrei na igreja quando passava por um momento muito difícil na minha vida. Através das orações e apoio dos irmãos, consegui superar o vício e hoje sou um novo homem. Agradeço a Deus por esta igreja!" isAnonymous={false} />
              <TestimonyCard name="Ana Beatriz" date={new Date(2025, 1, 15)} content="Participei da campanha de oração pela minha filha que estava hospitalizada. Os médicos não davam esperança, mas Deus operou um milagre e hoje ela está completamente curada. Glória a Deus!" isAnonymous={false} />
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-12">
          <Link to="/testemunhos/compartilhar">
            <Button className="btn-primary">
              Compartilhe Seu Testemunho <ArrowDown className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>

    */}

    {/* Instagram Feed */}
    <section className="py-16 bg-gray-50">
      <div className="container-church">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-church-800">Siga-nos no Instagram - @icb_610</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Acompanhe nossas atividades e mantenha-se atualizado com as novidades da igreja
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <InstagramWidget />
        </div>


        <div className="text-center mt-10">
          <a href="https://www.instagram.com/icb_610/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Instagram className="mr-2 h-5 w-5" /> @icb_610
            </Button>
          </a>
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="py-20 bg-church-600 text-white">
      <div className="container-church text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Faça Parte da Nossa Comunidade</h2>
        <p className="text-xl text-church-100 max-w-3xl mx-auto mb-10">
          Estamos de braços abertos para receber você e sua família. Venha crescer na fé conosco!
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/cadastro">
            <Button className="bg-black text-white hover:bg-white hover:text-black text-lg py-6 px-8">
              Cadastre-se
            </Button>
          </Link>
          <Link to="/contato">
            <Button variant="outline" className="border-black text-black bg-white hover:bg-black hover:text-white text-lg py-6 px-8">
              Fale Conosco
            </Button>
          </Link>
        </div>
      </div>
    </section>
  </Layout>;
};
export default Home;
