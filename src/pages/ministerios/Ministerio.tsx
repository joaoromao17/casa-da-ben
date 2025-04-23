import Layout from "@/components/layout/Layout";
import MinistryCard from "@/components/ui/MinistryCard";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { ministeriosData } from "@/data/ministeriosData";

const Ministerios = () => {
  const ministerios = Object.entries(ministeriosData).map(([slug, data]) => ({
    slug,
    ...data,
  }));

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
