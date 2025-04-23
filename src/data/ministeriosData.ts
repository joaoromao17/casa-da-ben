interface MinisterioData {
  title: string;
  description: string;
  imageUrl: string;
  activities: string[];
  schedule: string[];
  leaders: {
    name: string;
    role: string;
  }[];
}

export const ministeriosData: Record<string, MinisterioData> = {
  Ministerio: {
    title: "Nome do Ministério",
    description: "Descrição do Ministério",
    imageUrl: "/lovable-uploads/ministerios.jpg",
    activities: [
      "Atividade 1",
      "Atividade 2",
      "Atividade 3",
    ],
    schedule: [
      "Agenda do ministerio",
    ],
    leaders: [
      { name: "Nome", role: "Líder" },
      { name: "Nome", role: "Vice-Líder" },
    ],
  }};
