import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { 
  User, 
  BookOpen, 
  Users, 
  MessageSquare, 
  Heart, 
  Shield, 
  Calendar, 
  HandHeart, 
  UserPlus,
  Bird
} from "lucide-react";

const PorQueSeRegistrar = () => {
  return (
    <Layout>
      <div className="bg-gradient-to-b from-church-50 to-white min-h-screen">
        <div className="container-church py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-church-900 mb-4">
                🙋‍♂️ Por que se cadastrar no nosso site?
              </h1>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Para membros da Igreja */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-church-800 mb-6 flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  Para membros da Igreja:
                </h2>
                <p className="text-gray-600 mb-6">
                  Se você já faz parte da Igreja Casa da Bênção, ter um cadastro no nosso site traz muitas vantagens:
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                      <span className="text-green-600 font-bold text-sm">✅</span>
                    </div>
                    <div>
                      <p className="text-gray-700">
                        <strong>Acesso exclusivo</strong> ao seu perfil com seus dados atualizados.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BookOpen className="h-6 w-6 text-church-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-700">
                        <strong>Participação nos estudos bíblicos</strong>, com acesso a materiais, PDFs e conteúdos reservados a professores e membros.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="h-6 w-6 text-church-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-700">
                        <strong>Integração aos ministérios</strong> da igreja — você pode visualizar e se conectar com os ministérios que participa.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-6 w-6 text-church-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-700">
                        <strong>Publicação de testemunhos e pedidos de oração</strong> diretamente pelo site, podendo acompanhar e editar quando quiser.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Heart className="h-6 w-6 text-church-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-700">
                        <strong>Contribuições e apoios</strong> a campanhas com total transparência.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-church-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-700">
                        E tudo isso com <strong>segurança e privacidade</strong>, somente para membros autenticados.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Para visitantes */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-church-800 mb-6 flex items-center gap-2">
                  <UserPlus className="h-6 w-6" />
                  Para visitantes:
                </h2>
                <p className="text-gray-600 mb-6">
                  Mesmo que você ainda não seja um membro ativo da nossa igreja, o cadastro no site também é muito importante:
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-6 w-6 text-church-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-700">
                        <strong>Acompanhe os eventos</strong> da igreja.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-6 w-6 text-church-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-700">
                        <strong>Envie pedidos de oração</strong> ou leia testemunhos de fé que edificam vidas.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <HandHeart className="h-6 w-6 text-church-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-700">
                        <strong>Participe das campanhas</strong> de contribuição solidária e ajude causas especiais.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Bird className="h-6 w-6 text-church-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-700">
                        <strong>Dê um passo de aproximação</strong> com a Casa da Bênção — quem sabe seja o início de uma linda jornada com Cristo!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botão de Cadastro */}
            <div className="text-center">
              <Link to="/cadastro">
                <Button className="btn-primary text-lg px-8 py-3 hover:scale-105 transition-transform">
                  Cadastre-se
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PorQueSeRegistrar;
