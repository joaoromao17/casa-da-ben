
import Layout from "@/components/layout/Layout";
import MinistryCard from "@/components/ui/MinistryCard";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

const Ministerios = () => {
  const ministerios = [
    {
      title: "Ministério de Louvor",
      description: "Adoração e música para glorificar a Deus em nossos cultos.",
      imageUrl: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?q=80&w=1470&auto=format&fit=crop",
      slug: "louvor"
    },
    {
      title: "Ministério de Jovens",
      description: "Comunhão, discipulado e atividades voltadas para juventude.",
      imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1470&auto=format&fit=crop",
      slug: "jovens"
    },
    {
      title: "Ministério de Casais",
      description: "Fortalecendo famílias através do amor de Cristo.",
      imageUrl: "https://images.unsplash.com/photo-1516401266446-6432a8a07d41?q=80&w=1470&auto=format&fit=crop",
      slug: "casais"
    },
    {
      title: "Ministério Infantil",
      description: "Ensinando as crianças no caminho do Senhor.",
      imageUrl: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1472&auto=format&fit=crop",
      slug: "infantil"
    },
    {
      title: "Ministério de Intercessão",
      description: "Unidos em oração pelo Reino de Deus.",
      imageUrl: "https://images.unsplash.com/photo-1544374722-0fa59730eeb3?q=80&w=1470&auto=format&fit=crop",
      slug: "intercessao"
    },
    {
      title: "Ministério de Mídia",
      description: "Alcançando vidas através da tecnologia.",
      imageUrl: "https://images.unsplash.com/photo-1533727937480-da3a97967e95?q=80&w=1471&auto=format&fit=crop",
      slug: "midia"
    }
  ];

  return (
    <Layout>
      <div className="container-church py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-church-900 mb-4">
            Nossos Ministérios
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubra como você pode servir e crescer em nossa igreja através dos nossos ministérios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {ministerios.map((ministerio, index) => (
            <MinistryCard
              key={index}
              title={ministerio.title}
              description={ministerio.description}
              imageUrl={ministerio.imageUrl}
              slug={ministerio.slug}
            />
          ))}
        </div>

        <div className="bg-church-50 rounded-xl p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-church-900 mb-4">
              Faça Parte de um Ministério
            </h2>
            <p className="text-gray-600 mb-6">
              Você é chamado para servir! Descubra seu dom e junte-se a um de nossos ministérios.
            </p>
            <Button className="bg-church-700 hover:bg-church-800">
              <Users className="w-4 h-4 mr-2" />
              Entre em Contato
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Ministerios;
