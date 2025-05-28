import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MinisterioTemplate from "@/pages/MinisterioTemplate";
import { Loading } from "@/components/ui/loading";
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
  const [ministerio, setMinisterio] = useState<Ministerio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [id]);

  const [membros, setMembros] = useState([]);


  if (loading) {
    return <Loading />;
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
    />
  );
}
