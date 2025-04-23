
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const Cultos = () => {
  const horariosCulto = [
    {
      dia: "Domingo",
      horario: "18:30",
      descricao: "Culto da Família"
    },
    {
      dia: "Terça-feira",
      horario: "20:00",
      descricao: "Oração"
    },
    {
      dia: "Quarta-feira",
      horario: "20:00",
      descricao: "Escola Bíblica"
    },
    {
      dia: "Sexta-feira",
      horario: "20:00",
      descricao: "Culto de Libertação"
    }
  ];

  return (
    <Layout>
      <div className="container-church py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-church-900 mb-4">
            Horários de Culto
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Venha adorar e buscar a Deus conosco em nossos cultos semanais.
            Todos são bem-vindos!
          </p>
        </div>

        {/* Horários Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {horariosCulto.map((culto, index) => (
            <Card key={index} className="border-2 border-church-200 hover:border-church-300 transition-colors">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold text-church-900">
                  {culto.dia}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-church-700">
                  <Clock className="w-5 h-5" />
                  <span className="text-lg">{culto.horario}h</span>
                </div>
                <p className="text-gray-600">{culto.descricao}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-church-50 rounded-xl p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-church-900 mb-4">
              Participe de Nossos Cultos
            </h2>
            <p className="text-gray-600 mb-6">
              Junte-se a nós em um de nossos cultos semanais. Nossa igreja está
              de portas abertas para receber você e sua família.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/contato">
                <Button variant="outline" className="border-church-700 text-church-700 hover:bg-church-50">
                  Como Chegar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cultos;

