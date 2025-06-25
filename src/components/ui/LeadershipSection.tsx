
import { Skeleton } from "@/components/ui/skeleton";
import UserCard from "./UserCard";

interface LeadershipSectionProps {
  title: string;
  usuarios: any[];
  isLoading: boolean;
}

const LeadershipSection = ({ title, usuarios, isLoading }: LeadershipSectionProps) => {
  if (isLoading) {
    return (
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-church-800">{title}</h2>
        <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!usuarios.length) {
    return null;
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-church-800">{title}</h2>
      <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {usuarios.map((usuario) => (
          <UserCard usuario={usuario} key={usuario.id} />
        ))}
      </div>
    </section>
  );
};

export default LeadershipSection;
