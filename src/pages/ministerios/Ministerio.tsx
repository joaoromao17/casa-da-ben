import { useParams } from "react-router-dom";
import { ministeriosData } from "@/data/ministeriosData";
import MinisterioTemplate from "../MinisterioTemplate";

const Ministerio = () => {
  const { nome } = useParams();
  const dadosMinisterio = nome ? ministeriosData[nome] : null;

  if (!dadosMinisterio) {
    return <div>Ministério não encontrado.</div>;
  }

  return <MinisterioTemplate {...dadosMinisterio} />;
};

export default Ministerio;
