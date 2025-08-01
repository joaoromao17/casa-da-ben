
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, Github, Linkedin, Code, Coffee, Star, Smartphone } from "lucide-react";

const ApoiarDesenvolvedor = () => {
  return (
    <Layout>
      <div className="container-church py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-church-900 mb-4">
              Apoiar o Desenvolvedor
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Este sistema foi desenvolvido com muito carinho para a comunidade da ICB 610
            </p>
            <p className="text-gray-600">
              Se você gostou do projeto e quer apoiar o desenvolvedor, aqui estão algumas formas de ajudar!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Sobre o Desenvolvedor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-church-700" />
                  Sobre o Desenvolvedor
                </CardTitle>
                <CardDescription>
                  Conheça quem está por trás deste projeto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center mb-4">
                  <Avatar className="h-24 w-24 mx-auto mb-3">
                    <AvatarImage src="/lovable-uploads/759f8e23-09e1-40d2-8796-6a6d0dde9c8a.png" alt="João Vítor" />
                    <AvatarFallback>JV</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg mb-2">João Vítor Romão Colares de França</h3>
                  <p className="text-gray-600">
                    Desenvolvedor em busca de oportunidades na área de tecnologia. 
                    Este projeto foi criado como forma de contribuir com a comunidade 
                    e demonstrar habilidades técnicas.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Tecnologias utilizadas:</strong> Backend em Java com Spring Boot 3, Frontend em React + Vite,
                      Banco de dados PostgreSQL, Uploads via Cloudinary, Notificações push com Firebase, Deploy em Vercel + Render
                      e App mobile com PWA + Capacitor
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Objetivo:</strong> Criar um sistema completo para gestão 
                      da comunidade eclesiástica com foco na experiência do usuário.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Como Apoiar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coffee className="h-5 w-5 text-orange-600" />
                  Como Apoiar
                </CardTitle>
                <CardDescription>
                  Várias formas de ajudar o desenvolvedor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Dê uma estrela no GitHub</p>
                      <p className="text-sm text-gray-600">
                        Mostre que gostou do projeto dando uma ⭐ no repositório
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Linkedin className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Conecte no LinkedIn</p>
                      <p className="text-sm text-gray-600">
                        Ajude a expandir a rede profissional do desenvolvedor
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Heart className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Indique para oportunidades</p>
                      <p className="text-sm text-gray-600">
                        Conhece alguma vaga? Compartilhe o perfil do desenvolvedor!
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Coffee className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Feedback e Sugestões</p>
                      <p className="text-sm text-gray-600">
                        Seu feedback é muito valioso para melhorar o projeto
                      </p>
                    </div>
                  </div>
                  
                   {/* Pix desenvolvedor
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <Smartphone className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">PIX para apoiar</p>
                      <p className="text-sm text-gray-600 mb-2">
                        Quer contribuir financeiramente? Use o PIX:
                      </p>
                      <p className="text-sm font-mono bg-white p-2 rounded border text-green-800">
                        (61) 98614-9855
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Qualquer valor é muito bem-vindo e ajuda muito! 🙏
                      </p>
                    </div>
                  </div>
                  */}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Links e Ações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="text-center">
                  <Linkedin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">LinkedIn</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Conecte-se no LinkedIn e acompanhe a jornada profissional
                  </p>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => window.open('https://www.linkedin.com/feed/update/urn:li:activity:7352057075947945985/', '_blank')}
                  >
                    <Linkedin className="mr-2 h-4 w-4" />
                    Conectar no LinkedIn
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 bg-gray-50">
              <CardContent className="p-6">
                <div className="text-center">
                  <Github className="h-12 w-12 text-gray-800 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">GitHub</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Confira o código fonte e dê uma estrela nos repositórios
                  </p>
                  <div className="space-y-2">
                    <Button 
                      variant="outline"
                      className="w-full border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white"
                      onClick={() => window.open('https://github.com/joaoromao17/casa-da-ben', '_blank')}
                    >
                      <Github className="mr-2 h-4 w-4" />
                      Ver código Frontend
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white"
                      onClick={() => window.open('https://github.com/joaoromao17/backend_CasaDaBencao', '_blank')}
                    >
                      <Github className="mr-2 h-4 w-4" />
                      Ver código Backend
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mensagem de Agradecimento */}
          <div className="mt-8 text-center">
            <Card className="bg-church-50 border-church-200">
              <CardContent className="p-6">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-church-900 mb-2">
                  Se tem interesse em fazer um site, só entrar em contato. Muito Obrigado!
                </h3>
                <p className="text-gray-700">
                  Sua ajuda faz toda a diferença na jornada de um desenvolvedor iniciante. 
                  Juntos podemos fazer a diferença na comunidade tech! 🚀
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ApoiarDesenvolvedor;
