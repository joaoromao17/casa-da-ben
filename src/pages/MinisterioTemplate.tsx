
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";

interface MinisterioTemplateProps {
  title: string;
  description: string;
  imageUrl: string;
  activities: string[];
  schedule: string[];
  leaders: { name: string; role: string }[];
}

const MinisterioTemplate = ({
  title,
  description,
  imageUrl,
  activities,
  schedule,
  leaders
}: MinisterioTemplateProps) => {
  return (
    <Layout>
      <div className="relative h-[300px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="container-church relative h-full flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
            <p className="text-xl text-white/90 max-w-2xl">{description}</p>
          </div>
        </div>
      </div>

      <div className="container-church py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-church-900 mb-4">Nossas Atividades</h2>
              <ul className="space-y-2">
                {activities.map((activity, index) => (
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
                {schedule.map((time, index) => (
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
                {leaders.map((leader, index) => (
                  <div key={index} className="border-b border-church-200 last:border-0 pb-4 last:pb-0">
                    <h3 className="font-semibold text-church-800">{leader.name}</h3>
                    <p className="text-sm text-gray-600">{leader.role}</p>
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
    </Layout>
  );
};

export default MinisterioTemplate;
