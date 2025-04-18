import MinisterioTemplate from "../MinisterioTemplate";

const MinisterioModelo = () => {
  return (
    <MinisterioTemplate
      title="Nome do Ministério"
      description="Descrição breve sobre o propósito e as atividades principais deste ministério dentro da igreja."
      imageUrl="https://images.unsplash.com/photo-1596495577886-d920f1fb7238?q=80&w=1470&auto=format&fit=crop"
      activities={[
        "Atividade 1 do ministério",
        "Atividade 2 do ministério",
        "Atividade 3 do ministério",
        "Atividade 4 do ministério"
      ]}
      schedule={[
        "Dia da semana e horário - Atividade principal",
        "Outro dia e horário - Reunião ou evento"
      ]}
      leaders={[
        { name: "Nome do Líder", role: "Função no ministério" },
        { name: "Nome do Co-líder", role: "Função no ministério" }
      ]}
    />
  );
};

export default MinisterioModelo;
