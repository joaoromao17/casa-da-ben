
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MinisterioTemplate from "@/pages/MinisterioTemplate";
import { Loading } from "@/components/ui/loading";
import LoginRequiredNotice from "@/components/ui/LoginRequiredNotice";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import api from "@/services/api";

interface Leader {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Ministerio {
  id: number;
  nome: string;
  descricao: string;
  imagem: string;
  atividades: string[];
  horarios: string[];
  lideres: Leader[];
  viceLideres: Leader[];
  mural: string;
}

export default function MinisterioDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ministerio, setMinisterio] = useState<Ministerio | null>(null);
  const [loading, setLoading] = useState(true);
  const [membros, setMembros] = useState([]);
  const [showLoginNotice, setShowLoginNotice] = useState(false);

  useEffect(() => {
    // Verificar se o usuário está logado
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      setShowLoginNotice(true);
      setLoading(false);
      return;
    }

    if (id) {
      // busca do ministério
      api.get(`/ministerios/${id}`)
        .then((response) => {
          const data = response.data;
          setMinisterio({
            id: data.id,
            nome: data.name,
            descricao: data.description,
            imagem: data.imageUrl,
            atividades: data.atividades || [],
            horarios: data.meetingDay ? [data.meetingDay] : [],
            lideres: data.leaders || [],
            viceLideres: data.viceLeaders || [],
            mural: data.wall || "",
          });
        });

      // busca dos membros
      api.get(`/ministerios/${id}/membros`)
        .then((response) => {
          setMembros(response.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar membros:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, navigate]);

  if (loading) {
    return <Loading />;
  }

  if (showLoginNotice) {
    return (
      <Layout>
        <div className="container-church py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Detalhes do Ministério</h1>
          <p className="text-gray-600">Você precisa estar logado para ver os detalhes dos ministérios.</p>
          <Button onClick={() => navigate("/ministerios")} className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Ministérios
          </Button>
        </div>
        <LoginRequiredNotice
          message="Você precisa estar logado para acessar os detalhes dos ministérios."
          onClose={() => setShowLoginNotice(false)}
        />
      </Layout>
    );
  }

  if (!ministerio) {
    return <div>Ministério não encontrado.</div>;
  }

  return (
    <MinisterioTemplate
      title={ministerio.nome}
      description={ministerio.descricao}
      imageUrl={ministerio.imagem}
      activities={ministerio.atividades}
      schedule={ministerio.horarios.join(", ")}
      leaders={ministerio.lideres}
      viceLeaders={ministerio.viceLideres}
      wall={ministerio.mural}
      members={membros}
      ministryId={id}
    />
  );
}
