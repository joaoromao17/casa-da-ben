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
  jovens: {
    title: "Ministério de Jovens",
    description: "Um espaço dedicado ao crescimento espiritual e comunhão entre jovens.",
    imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1470&auto=format&fit=crop",
    activities: [
      "Estudos bíblicos",
      "Louvor",
      "Retiros",
      "Evangelismo",
    ],
    schedule: [
      "Sábado às 19h",
      "Domingo às 17h",
    ],
    leaders: [
      { name: "João Silva", role: "Líder" },
      { name: "Maria Santos", role: "Eventos" },
    ],
  },
  louvor: {
    title: "Ministério de Louvor",
    description: "Responsável por conduzir a igreja em adoração a Deus.",
    imageUrl: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?q=80&w=1470&auto=format&fit=crop",
    activities: [
      "Ensaios semanais",
      "Administração nos cultos",
    ],
    schedule: [
      "Sexta às 20h",
      "Domingo às 9h",
    ],
    leaders: [
      { name: "Lucas Oliveira", role: "Líder de Louvor" },
    ],
  },
  // você pode adicionar mais aqui depois...
};
