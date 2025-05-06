import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MinistryCard from "@/components/ui/MinistryCard";
import Layout from "@/components/layout/Layout";
import api from "@/services/api"; // Usando o api.js que já configuramos!

interface Ministry {
  id: number;
  name: string;
  description: string;
  leader: string;
  imageUrl: string;
  meetingDay: string;
}

const Ministerios = () => {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        const response = await api.get("/ministerios");
        setMinistries(response.data);
      } catch (error) {
        console.error("Erro ao buscar ministérios:", error);
        setError("Erro ao carregar ministérios. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchMinistries();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="container-church py-16 text-center text-church-700">
          Carregando ministérios...
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container-church py-16 text-center text-red-500">
          {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16">
        <div className="container-church">
          <h1 className="text-4xl font-bold text-center text-church-800 mb-8">
            Ministérios
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Confira nossos ministérios abaixo. 
            Todos são bem-vindos para crescer na fé e em comunhão.
          </p>
          {ministries.length === 0 ? (
            <p className="text-center text-church-700">
              Nenhum ministério cadastrado ainda.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {ministries.map((ministry) => (
                <MinistryCard
                  key={ministry.id}
                  title={ministry.name}
                  description={ministry.description}
                  imageUrl={ministry.imageUrl}
                  slug={ministry.id.toString()} // Usando o ID como slug por enquanto
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Ministerios;