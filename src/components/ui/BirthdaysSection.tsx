
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import UserCard from "./UserCard";
import api from "@/services/api";

interface BirthdaysSectionProps {
  className?: string;
}

const BirthdaysSection = ({ className }: BirthdaysSectionProps) => {
  const [birthdays, setBirthdays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users/public/aniversariantes');
        setBirthdays(response.data);
      } catch (error) {
        console.error('Erro ao buscar aniversariantes:', error);
        setBirthdays([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBirthdays();
  }, []);

  const formatBirthDate = (birthDate: string) => {
    const date = new Date(birthDate);
    const hoje = new Date();
    
    const isToday = date.getDate() === hoje.getDate() && 
                   date.getMonth() === hoje.getMonth();
    
    if (isToday) {
      return { text: "🎉 É HOJE!", isToday: true };
    }
    
    const day = date.getDate();
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    return { 
      text: `${day} de ${months[date.getMonth()]}`, 
      isToday: false 
    };
  };

  if (loading) {
    return (
      <div className={className}>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-church-900 mb-4">Aniversariantes do Mês</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Celebre com os aniversariantes deste mês
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-church-900 mb-4">Aniversariantes do Mês</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Celebre com os aniversariantes deste mês
        </p>
      </div>

      {birthdays.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Ninguém faz aniversário este mês</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {birthdays.map((person) => {
            const birthdayInfo = formatBirthDate(person.birthDate);
            return (
              <UserCard 
                usuario={person} 
                key={person.id}
                birthdayInfo={birthdayInfo}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BirthdaysSection;
