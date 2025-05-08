
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContribuicaoCard = ({ contribuicao }) => {
  const { 
    id, 
    title, 
    shortDescription, 
    imageUrl, 
    targetValue, 
    collectedValue, 
    isGoalVisible,
    status 
  } = contribuicao;

  // Calcular a porcentagem de progresso
  const progressPercentage = isGoalVisible && targetValue 
    ? Math.min(Math.round((collectedValue / targetValue) * 100), 100)
    : null;

  // Formatar valores para exibição em reais
  const formatarValor = (valor) => {
    return valor.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <div className="relative w-full h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover"
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
        <CardDescription className="line-clamp-2">{shortDescription}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        {isGoalVisible && progressPercentage !== null && (
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
