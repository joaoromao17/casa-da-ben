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
  Midia: {
    title: "Ministério da Mídia",
    description: "Um espaço dedicado à organização e planejamento do departamento da mídia",
    imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1470&auto=format&fit=crop",
    activities: [
      "Postagens de Instagram",
      "Story do culto",
      "Propagação do Evangelho por redes sociais",
      "Reels",
    ],
    schedule: [
      "Sexta às 20h",
      "Domingo às 18h:30",
    ],
    leaders: [
      { name: "Viviane Romão", role: "Líder" },
      { name: "Glaucia", role: "Vice-Líder" },
    ],
  },
  louvor: {
    title: "Ministério de Louvor",
    description: "Responsável por conduzir a igreja em adoração a Deus.",
    imageUrl: "/lovable-uploads/equipe_de_louvor.jpg",
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
  casais: {
    title: "Ministério de Casais",
    description: "Fortalecendo lares e relacionamentos à luz da Palavra de Deus.",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1470&auto=format&fit=crop",
    activities: [
      "Encontros mensais",
      "Palestras e workshops",
      "Jantares temáticos",
      "Aconselhamentos",
    ],
    schedule: [
      "Todo primeiro sábado do mês às 20h",
      "Quarta-feira às 19h (quinzenal)",
    ],
    leaders: [
      { name: "Carlos e Ana Souza", role: "Líderes de Casais" },
    ],
  },
  modelo: {
    title: "Nome do Ministério",
    description: "Descrição breve sobre o propósito e as atividades principais deste ministério dentro da igreja.",
    imageUrl: "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?q=80&w=1470&auto=format&fit=crop",
    activities: [
      "Atividade 1 do ministério",
      "Atividade 2 do ministério",
      "Atividade 3 do ministério",
      "Atividade 4 do ministério"
    ],
    schedule: [
      "Dia da semana e horário - Atividade principal",
      "Outro dia e horário - Reunião ou evento"
    ],
    leaders: [
      { name: "Nome do Líder", role: "Função no ministério" },
      { name: "Nome do Co-líder", role: "Função no ministério" }
    ]
  }
};
