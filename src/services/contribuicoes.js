
import api from './api';

// Dados mock para as campanhas de contribuição
const CONTRIBUICOES_MOCK = [
  {
    id: 1,
    title: "Reforma do Salão Principal",
    description: "Ajude-nos a renovar o nosso salão principal com novos equipamentos de som e iluminação para melhorar a experiência dos cultos.",
    imageUrl: "/lovable-uploads/galeria1.jpg",
    targetValue: 15000,
    collectedValue: 9750,
    isGoalVisible: true,
    status: "ATIVA",
    startDate: "2025-04-01",
    endDate: "2025-06-30",
    createdBy: "Pr. Walter Silva",
    shortDescription: "Renovação completa do sistema de áudio e iluminação do salão principal.",
    pixKey: "12345678901",
    fullDescription: `
      Nossa igreja precisa renovar todo o sistema de áudio e iluminação do salão principal para melhorar a qualidade dos cultos e eventos.
      
      Com o novo equipamento, poderemos:
      - Melhorar a qualidade do som durante os louvores e pregações
      - Criar uma atmosfera mais adequada com iluminação apropriada
      - Possibilitar transmissões online com melhor qualidade
      - Atender melhor os visitantes e membros da igreja

      Contamos com sua generosidade para tornar esse projeto realidade!
    `
  },
  {
    id: 2,
    title: "Projeto Missionário Amazônia",
    description: "Apoie nossos missionários que levarão a palavra de Deus para comunidades ribeirinhas na Amazônia.",
    imageUrl: "/lovable-uploads/galeria2.jpg",
    targetValue: 7500,
    collectedValue: 3200,
    isGoalVisible: true,
    status: "ATIVA",
    startDate: "2025-03-15",
    endDate: "2025-05-15",
    createdBy: "Min. de Missões",
    shortDescription: "Apoio aos missionários que trabalharão em comunidades ribeirinhas.",
    pixKey: "12345678902",
    fullDescription: `
      O Projeto Missionário Amazônia visa levar a palavra de Deus e apoio humanitário para comunidades isoladas na região amazônica.
      
      Os recursos serão usados para:
      - Passagens e deslocamento dos missionários
      - Material evangelístico e Bíblias
      - Medicamentos e itens de primeira necessidade
      - Suporte para as famílias missionárias
      
      Sua contribuição ajudará a transformar vidas nessas comunidades!
    `
  },
  {
    id: 3,
    title: "Cestas Básicas para Famílias Carentes",
    description: "Contribua para a doação mensal de cestas básicas para famílias em situação de vulnerabilidade em nossa comunidade.",
    imageUrl: "/lovable-uploads/galeria3.jpg",
    targetValue: 5000,
    collectedValue: 4200,
    isGoalVisible: true,
    status: "ATIVA",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    createdBy: "Min. de Ação Social",
    shortDescription: "Auxílio mensal com alimentos para famílias carentes da nossa comunidade.",
    pixKey: "12345678903",
    fullDescription: `
      O projeto de Cestas Básicas visa atender mensalmente famílias em situação de vulnerabilidade em nossa comunidade.
      
      Cada cesta básica contém:
      - Arroz, feijão, óleo e outros itens básicos
      - Produtos de higiene pessoal
      - Material escolar para crianças (quando necessário)
      
      Atualmente atendemos 25 famílias e queremos expandir para 40 famílias até o final do ano.
      Sua doação faz toda a diferença na vida dessas pessoas!
    `
  },
  {
    id: 4,
    title: "Retiro de Jovens 2025",
    description: "Ajude a financiar o retiro anual da juventude, permitindo que jovens com dificuldades financeiras também participem.",
    imageUrl: "/lovable-uploads/galeria4.jpg",
    targetValue: 6000,
    collectedValue: 1500,
    isGoalVisible: true,
    status: "ATIVA",
    startDate: "2025-04-15",
    endDate: "2025-07-10",
    createdBy: "Min. de Jovens",
    shortDescription: "Apoio para o retiro anual de jovens, incluindo bolsas para participantes sem recursos.",
    pixKey: "12345678904",
    fullDescription: `
      O Retiro de Jovens é um evento transformador que acontece anualmente em nossa igreja.
      
      O objetivo deste ano é proporcionar:
      - Um fim de semana de renovação espiritual para 80 jovens
      - Bolsas integrais para 15 jovens que não têm condições de pagar
      - Bolsas parciais para 25 jovens
      
      Os valores arrecadados serão destinados ao aluguel do espaço, alimentação, material e transporte.
      Ajude-nos a impactar a vida desses jovens!
    `
  },
  {
    id: 5,
    title: "Equipamentos para Escola Bíblica",
    description: "Contribua para a compra de materiais didáticos e equipamentos para nossa Escola Bíblica Dominical.",
    imageUrl: "/lovable-uploads/galeria5.jpg",
    targetValue: 3500,
    collectedValue: 2100,
    isGoalVisible: true,
    status: "ATIVA",
    startDate: "2025-02-01",
    endDate: "2025-05-30",
    createdBy: "Min. de Educação Cristã",
    shortDescription: "Aquisição de recursos didáticos para as classes da Escola Bíblica.",
    pixKey: "12345678905",
    fullDescription: `
      Nossa Escola Bíblica Dominical precisa de novos recursos para oferecer um ensino de qualidade.
      
      Os recursos serão investidos em:
      - Materiais didáticos atualizados
      - TV e projetor para salas de aula
      - Mobiliário infantil adequado
      - Livros e recursos para professores
      
      Com sua ajuda, poderemos melhorar a qualidade do ensino bíblico em nossa igreja!
    `
  }
];

// Serviço para listar todas as contribuições
export const listarContribuicoes = async () => {
  // Em um cenário real, isso seria uma chamada de API
  // return api.get('/contribuicoes');
  
  // Retornando dados mock
  return Promise.resolve({ data: CONTRIBUICOES_MOCK });
};

// Serviço para obter detalhes de uma contribuição específica
export const obterContribuicao = async (id) => {
  // Em um cenário real, isso seria uma chamada de API
  // return api.get(`/contribuicoes/${id}`);
  
  // Simulando a busca no mock
  const contribuicao = CONTRIBUICOES_MOCK.find(c => c.id === Number(id));
  
  if (contribuicao) {
    return Promise.resolve({ data: contribuicao });
  } else {
    return Promise.reject({ message: 'Contribuição não encontrada' });
  }
};

// Serviço para registrar uma nova doação
export const registrarDoacao = async (contribuicaoId, dados) => {
  // Em um cenário real, isso seria uma chamada de API
  // return api.post(`/contribuicoes/${contribuicaoId}/doacoes`, dados);
  
  // Simulando uma resposta de sucesso
  return Promise.resolve({ 
    success: true, 
    message: 'Doação registrada com sucesso!' 
  });
};
