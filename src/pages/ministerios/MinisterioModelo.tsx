import MinisterioTemplate from "../MinisterioTemplate";
import { ministerioModelo } from "@/data/ministeriosData";

const MinisterioModelo = () => {
  return <MinisterioTemplate {...ministerioModelo} />;
};

export default MinisterioModelo;
