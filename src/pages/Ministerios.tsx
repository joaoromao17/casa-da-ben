
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import MinistryCard from "@/components/ui/MinistryCard";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loading } from "@/components/ui/loading";
import { Search } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
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
  const [myMinistries, setMyMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { currentUser } = useCurrentUser();

  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        const response = await api.get("/ministerios");

        let data = response.data;

        // Se for string, parseia
        if (typeof data === "string") {
          data = JSON.parse(data);
        }

        if (Array.isArray(data)) {
          setMinistries(data);
          
          // Buscar meus ministérios se o usuário estiver logado
          if (currentUser) {
            try {
              const myMinistriesResponse = await api.get(`/users/${currentUser.id}/ministerios`);
              setMyMinistries(myMinistriesResponse.data);
            } catch (error) {
              console.error("Erro ao buscar meus ministérios:", error);
            }
          }
        } else {
          throw new Error("Resposta inesperada da API.");
        }
      } catch (error) {
        console.error("Erro ao buscar ministérios:", error);
        setError("Erro ao carregar ministérios. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchMinistries();
  }, [currentUser]);

  const filteredMinistries = ministries.filter(ministry =>
    ministry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ministry.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMyMinistries = myMinistries.filter(ministry =>
    ministry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ministry.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

          {/* Campo de Pesquisa */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Pesquisar ministérios..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

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
          ) : (
            <Tabs defaultValue="todos" className="w-full">
              {currentUser && (
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                  <TabsTrigger value="todos">Todos os Ministérios</TabsTrigger>
                  <TabsTrigger value="meus">Meus Ministérios</TabsTrigger>
                </TabsList>
              )}

              <TabsContent value="todos">
                {filteredMinistries.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-church-700 mb-4">
                      {searchTerm ? "Nenhum ministério encontrado para sua pesquisa." : "Nenhum ministério cadastrado ainda."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {filteredMinistries.map((ministry) => (
                      <MinistryCard
                        key={ministry.id}
                        title={ministry.name}
                        description={ministry.description}
                        imageUrl={ministry.imageUrl}
                        slug={ministry.id.toString()}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              {currentUser && (
                <TabsContent value="meus">
                  {filteredMyMinistries.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-church-700 mb-4">
                        {searchTerm ? "Nenhum ministério encontrado para sua pesquisa." : "Você ainda não participa de nenhum ministério."}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                      {filteredMyMinistries.map((ministry) => (
                        <MinistryCard
                          key={ministry.id}
                          title={ministry.name}
                          description={ministry.description}
                          imageUrl={ministry.imageUrl}
                          slug={ministry.id.toString()}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              )}
            </Tabs>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Ministerios;
