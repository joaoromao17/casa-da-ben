
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface UserCardProps {
  usuario: {
    id: number;
    name: string;
    biography?: string;
    profileImageUrl?: string;
    roles: string[];
  };
  birthdayInfo?: {
    text: string;
    isToday: boolean;
  };
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const UserCard = ({ usuario, birthdayInfo }: UserCardProps) => {
  const navigate = useNavigate();

  const getProfileImageUrl = (url: string | null | undefined) => {
    if (!url) return "/default-profile.jpg";
    return url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
  };

  const formatRoleName = (role: string) => {
    return role
      .replace('ROLE_', '')
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleCardClick = () => {
    navigate(`/profile-public/${usuario.id}`);
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200 relative"
      onClick={handleCardClick}
    >
      {birthdayInfo && (
        <div className={`absolute top-2 right-2 z-10 px-2 py-1 rounded-full text-xs font-bold ${
          birthdayInfo.isToday 
            ? 'bg-yellow-400 text-yellow-900 animate-pulse' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {birthdayInfo.text}
        </div>
      )}
      
      <div className="aspect-square overflow-hidden">
        <img 
          src={getProfileImageUrl(usuario.profileImageUrl)} 
          alt={usuario.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-bold text-church-800 mb-2">{usuario.name}</h3>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {usuario.roles.map((role, index) => (
            <Badge 
              key={index}
              variant="secondary"
              className="text-xs bg-church-100 text-church-700"
            >
              {formatRoleName(role)}
            </Badge>
          ))}
        </div>
        
        {usuario.biography && (
          <p className="text-gray-600 text-sm line-clamp-3">
            {usuario.biography}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default UserCard;
