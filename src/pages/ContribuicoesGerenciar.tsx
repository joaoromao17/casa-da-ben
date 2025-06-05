
import Layout from "@/components/layout/Layout";
import ContributionsTab from "@/components/admin/ContributionsTab";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Navigate } from "react-router-dom";
import { Loading } from "@/components/ui/loading";

const ContribuicoesGerenciar = () => {
  const { currentUser, isLoading } = useCurrentUser();

  if (isLoading) {
    return <Loading />;
  }

  // Check if user has permission to manage contributions
  const canManageContributions = currentUser?.roles?.some(role => 
    ['ROLE_ADMIN', 'ROLE_PASTOR', 'ROLE_PASTORAUXILIAR', 'ROLE_LIDER'].includes(role)
  );

  if (!canManageContributions) {
    return <Navigate to="/contribuicoes" replace />;
  }

  return (
    <Layout>
      <div className="py-12 bg-gray-50">
        <div className="container-church max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <ContributionsTab />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContribuicoesGerenciar;
