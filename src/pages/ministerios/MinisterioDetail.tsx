import { useParams } from "react-router-dom";
import { ministeriosData } from "@/data/ministeriosData";
import MinisterioTemplate from "@/pages/MinisterioTemplate";

const MinisterioDetail = () => {
  const { slug } = useParams();
  const ministerio = ministeriosData[slug as string];

  if (!ministerio) {
    return <div className="text-center mt-20">Ministério não encontrado.</div>;
  }

  return <MinisterioTemplate {...ministerio} />;
};

export default MinisterioDetail;
