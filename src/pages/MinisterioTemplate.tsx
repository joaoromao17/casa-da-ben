
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Phone, Mail, Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface MinisterioTemplateProps {
  title: string;
  description: string;
  imageUrl: string;
  activities: string[];
  schedule: string[];
  leaders: string[];
}
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const MinisterioTemplate = ({

  title,
  description,
  imageUrl,
  activities,
  schedule,
  leaders
}: MinisterioTemplateProps) => {
  const fullImageUrl = imageUrl.startsWith("http")
    ? imageUrl
    : `${API_BASE_URL}${imageUrl}`;
  return (
    <Layout>
      <div className="relative h-[300px] overflow-hidden">
        <img
          src={fullImageUrl}
          alt={`Imagem do ${title}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="container-church relative h-full flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
            <p className="text-xl text-white/90 max-w-2xl">{description}</p>
          </div>
        </div>
      </div>

      {/* Tabs de Conteúdo */}
      <section className="py-12 bg-white">
        <div className="container-church">
          <Tabs defaultValue="historia" className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-6">
              <TabsTrigger value="sobre">Sobre o Ministério</TabsTrigger>
              <TabsTrigger value="mural">Mural</TabsTrigger>
              <TabsTrigger value="membros">Membros do Ministério</TabsTrigger>
            </TabsList>

            <TabsContent value="sobre">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-church-900 mb-4">Sobre nós</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Aqui está detalhes sobre o nosso ministério
                </p>
              </div>
              <div className="container-church py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <section>
                      <h2 className="text-2xl font-bold text-church-900 mb-4">Nossas Atividades</h2>
                      <ul className="space-y-2">
                        {(activities ?? []).map((activity, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block w-2 h-2 mt-2 mr-2 bg-church-700 rounded-full" />
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section>
                      <h2 className="text-2xl font-bold text-church-900 mb-4">Horários</h2>
                      <ul className="space-y-2">
                        {(schedule ?? []).map((time, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block w-2 h-2 mt-2 mr-2 bg-church-700 rounded-full" />
                            {time}
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>

                  <div className="lg:col-span-1">
                    <div className="bg-church-50 rounded-xl p-6">
                      <h2 className="text-xl font-bold text-church-900 mb-4">Liderança</h2>
                      <div className="space-y-4">
                        {(leaders ?? []).map((leader, index) => (
                          <div key={index} className="border-b border-church-200 last:border-0 pb-4 last:pb-0">
                            <h3 className="font-semibold text-church-800">{leader}</h3>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6">
                        <Link to="/contato">
                          <Button className="w-full bg-church-700 hover:bg-church-800">
                            <Users className="w-4 h-4 mr-2" />
                            Faça Parte
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Aba de Liderança */}
            <TabsContent value="mural">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-church-900 mb-4">Mural</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Este mural serve para avisos do Líder para os membros
                </p>
              </div>
            </TabsContent>
            <TabsContent value="membros">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-church-900 mb-4">Membros</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Aqui está os membros desse ministério
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default MinisterioTemplate;
