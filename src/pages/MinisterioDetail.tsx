import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MinisterioTemplate from "@/pages/MinisterioTemplate";
import { Loading } from "@/components/ui/loading";
import api from "@/services/api";

interface Ministerio {
  id: number;
  nome: string;
  descricao: string;
  imagem: string;
  atividades: string[];
  horarios: string[];
  lideres: string[];
}

export default function MinisterioDetail() {
  const { id } = useParams<{ id: string }>();
  const [ministerio, setMinisterio] = useState<Ministerio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.get(`/ministerios/${id}`)
        .then((response) => {
          const data = response.data;
  
          setMinisterio({
            id: data.id,
            nome: data.name,
            descricao: data.description,
            imagem: data.imageUrl,
            atividades: data.atividades || [], // o backend não envia, então deixamos vazio
            horarios: data.meetingDay ? [data.meetingDay] : [],
            lideres: data.leader ? data.leader.split(",").map((l: string) => l.trim()) : [],
          });
        })
        .catch((error) => {
          console.error("Erro ao buscar ministério:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

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
      schedule={ministerio.horarios}
      leaders={ministerio.lideres}
    />
  );
}
