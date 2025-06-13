
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const ContribuicaoCard = ({ contribuicao }) => {
  const { currentUser } = useCurrentUser();
  const isLoggedIn = !!currentUser;

  const { 
    id, 
    title, 
    shortDescription, 
    description,
    imageUrl, 
    targetValue, 
    collectedValue, 
    isGoalVisible,
    status 
  } = contribuicao;

  console.log("Dados do card:", { 
    id, title, imageUrl, targetValue, collectedValue, isGoalVisible 
  });

  // Use shortDescription if available, otherwise use the first part of the regular description
  const displayDescription = shortDescription || (description ? description.substring(0, 100) + (description.length > 100 ? '...' : '') : '');

  // Calcular a porcentagem de progresso - só mostrar se usuário estiver logado
  const progressPercentage = isLoggedIn && isGoalVisible !== false && targetValue 
    ? Math.min(Math.round((collectedValue / targetValue) * 100), 100)
    : null;

  // Formatar valores para exibição em reais - só mostrar se usuário estiver logado
  const formatarValor = (valor) => {
    return Number(valor).toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  // Handle image URLs: if it's a full URL, use it directly, otherwise prepend the API base URL
  const fullImageUrl = imageUrl?.startsWith("http") 
    ? imageUrl 
    : imageUrl 
      ? `${API_BASE_URL}${imageUrl}` 
      : '/placeholder.svg';
      
  console.log("URL da imagem formatada:", fullImageUrl);

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <div className="relative w-full h-48 overflow-hidden">
        <img 
          src={fullImageUrl} 
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error("Erro ao carregar imagem:", fullImageUrl);
            e.target.src = '/placeholder.svg';
          }}
        />
        {status !== "ATIVA" && (
          <div className={`absolute top-2 right-2 px-3 py-1 text-xs font-medium rounded-full ${
            status === "CONCLUIDA" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}>
            {status === "CONCLUIDA" ? "Concluída" : "Cancelada"}
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{displayDescription}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        {/* Só mostrar informações financeiras se usuário estiver logado */}
        {isLoggedIn && isGoalVisible !== false && progressPercentage !== null && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Arrecadado: {formatarValor(collectedValue)}</span>
              <span>Meta: {formatarValor(targetValue)}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-right text-muted-foreground">
              {progressPercentage}% alcançado
            </p>
          </div>
        )}
        
        {/* Mensagem para usuários não logados */}
        {!isLoggedIn && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">
              Faça login para ver o progresso da campanha
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Link to={`/contribuicoes/${id}`} className="w-full">
          <Button variant="outline" className="w-full">
            Saiba mais <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ContribuicaoCard;
