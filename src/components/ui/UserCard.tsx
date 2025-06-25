
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/services/api";

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

const UserCard = ({ usuario, birthdayInfo }: UserCardProps) => {
  const navigate = useNavigate();

  const getProfileImageUrl = (url: string | null | undefined) => {
    if (!url) return "/default-profile.jpg";
    return url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
  };

  const handleCardClick = () => {
    navigate(`/profile-public/${usuario.id}`);
  };

  const formatRoleName = (role: string) => {
    return role
      .replace("ROLE_", "")
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200 relative"
      onClick={handleCardClick}
    >
      {/* 📌 Aniversariante */}
      {birthdayInfo ? (
        <>
          <div className="aspect-square overflow-hidden">
            <img
              src={getProfileImageUrl(usuario.profileImageUrl)}
              alt={usuario.name}
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-2 sm:p-4 text-center">
            <h3 className="text-sm sm:text-lg font-bold text-church-800 line-clamp-2">{usuario.name}</h3>
            <p className="text-xs sm:text-sm text-gray-600">{birthdayInfo.text}</p>
          </CardContent>
        </>
      ) : (
        <>
          {/* 🎯 Card padrão */}
          <div className="aspect-square overflow-hidden">
            <img
              src={getProfileImageUrl(usuario.profileImageUrl)}
              alt={usuario.name}
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-2 sm:p-4">
            <h3 className="text-sm sm:text-lg font-bold text-church-800 mb-1 sm:mb-2 line-clamp-2">{usuario.name}</h3>
            <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
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
              <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">{usuario.biography}</p>
            )}
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default UserCard;
