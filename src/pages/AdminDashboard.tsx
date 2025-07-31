
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

// Admin Tab Components
import UsersTab from "@/components/admin/UsersTab";
import MinistriesTab from "@/components/admin/MinistriesTab";
import StudiesTab from "@/components/admin/StudiesTab";
import EventsTab from "@/components/admin/EventsTab";
import ContributionsTab from "@/components/admin/ContributionsTab";
import PrayerTestimonyTab from "@/components/admin/PrayerTestimonyTab";
import VersesTab from "@/components/admin/VersesTab";

// Role-based protection
const getUserRoles = (): string[] => {
  const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  if (!token) return [];
  
  try {
    // Get payload from JWT token (assuming format: header.payload.signature)
    const payload = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload.roles || [];
  } catch (error) {
    console.error("Error decoding token:", error);
    return [];
  }
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  
  // Check if user has admin access
  useEffect(() => {
    const roles = getUserRoles();
    const hasAccess = roles.some(role => 
      role === "ROLE_ADMIN" || role === "ROLE_PASTOR"
    );
    
    if (!hasAccess) {
      toast({
        title: "Acesso Negado",
        description: "Você não tem permissão para acessar esta área.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [navigate]);
  
  return (
    <Layout>
      <div className="container py-6 px-4 mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Painel de Administração</h1>
        
        <Tabs 
          defaultValue="users" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="overflow-x-auto mb-6">
            <TabsList className="flex w-full min-w-[700px] grid-cols-none">
              <TabsTrigger value="users" className="text-xs sm:text-sm whitespace-nowrap">Usuários</TabsTrigger>
              <TabsTrigger value="ministries" className="text-xs sm:text-sm whitespace-nowrap">Ministérios</TabsTrigger>
              <TabsTrigger value="studies" className="text-xs sm:text-sm whitespace-nowrap">Estudos</TabsTrigger>
              <TabsTrigger value="events" className="text-xs sm:text-sm whitespace-nowrap">Eventos</TabsTrigger>
              <TabsTrigger value="contributions" className="text-xs sm:text-sm whitespace-nowrap">Contribuições</TabsTrigger>
              <TabsTrigger value="prayer-testimony" className="text-xs sm:text-sm whitespace-nowrap">Oração/Test.</TabsTrigger>
              <TabsTrigger value="verses" className="text-xs sm:text-sm whitespace-nowrap">Versículos</TabsTrigger>
            </TabsList>
          </div>
          
          <Card>
            <CardContent className="pt-4 md:pt-6">
              <TabsContent value="users">
                <UsersTab />
              </TabsContent>
              
              <TabsContent value="ministries">
                <MinistriesTab />
              </TabsContent>
              
              <TabsContent value="studies">
                <StudiesTab />
              </TabsContent>
              
              <TabsContent value="events">
                <EventsTab />
              </TabsContent>
              
              <TabsContent value="contributions">
                <ContributionsTab />
              </TabsContent>
              
              <TabsContent value="prayer-testimony">
                <PrayerTestimonyTab />
              </TabsContent>
              
              <TabsContent value="verses">
                <VersesTab />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;