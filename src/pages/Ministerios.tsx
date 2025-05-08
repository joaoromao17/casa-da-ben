
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import MinistryCard from "@/components/ui/MinistryCard";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import api from "@/services/api";

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
        <div className="container-church py-16">
          <Loading />
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
          <p className="text-gray-600 max-w-2xl mx-auto text-center mb-10">
            Confira nossos ministérios abaixo. 
            Todos são bem-vindos para crescer na fé e em comunhão.
          </p>

          {error ? (
            <Alert variant="destructive" className="my-8">
              <AlertTitle>Erro ao carregar ministérios</AlertTitle>
              <AlertDescription>
                {error}
                <div className="mt-4">
                  <Button 
                    onClick={() => window.location.reload()}
                    variant="outline"
                  >
                    Tentar novamente
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          ) : ministries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-church-700 mb-4">
                Nenhum ministério cadastrado ainda.
              </p>
            </div>
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
