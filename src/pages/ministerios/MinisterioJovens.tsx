
import MinisterioTemplate from "../MinisterioTemplate";

const MinisterioJovens = () => {
  return (
    <MinisterioTemplate
      title="Ministério de Jovens"
      description="Um espaço dedicado ao crescimento espiritual e comunhão entre jovens, desenvolvendo líderes para o Reino de Deus."
      imageUrl="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1470&auto=format&fit=crop"
      activities={[
        "Encontros semanais de estudo bíblico",
        "Eventos de louvor e adoração",
        "Retiros espirituais",
        "Ações sociais e evangelismo",
        "Grupos pequenos de discipulado",
        "Atividades esportivas e recreativas"
      ]}
      schedule={[
        "Sábados às 19h - Encontro de Jovens",
        "Domingos às 17h - Ensaio do Coral Jovem",
        "Quartas às 19h30 - Grupos Pequenos"
      ]}
      leaders={[
        { name: "Pastor João Silva", role: "Líder do Ministério" },
        { name: "Maria Santos", role: "Coordenadora de Eventos" },
        { name: "Lucas Oliveira", role: "Líder de Louvor" }
      ]}
    />
  );
};

export default MinisterioJovens;
