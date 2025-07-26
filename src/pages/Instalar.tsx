import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Download, Share, Plus, Home } from "lucide-react";

const Instalar = () => {
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);
    
    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);

    // Captura o evento beforeinstallprompt
    const handler = (e: any) => {
      e.preventDefault(); // Impede o prompt automático
      setDeferredPrompt(e);
      setShowInstallButton(true); // Agora podemos mostrar o botão
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Esconde o botão se o app já estiver instalado
    window.addEventListener('appinstalled', () => {
      console.log('App instalado');
      setShowInstallButton(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    console.log('Resultado da instalação:', result.outcome);

    if (result.outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallButton(false);
    }
  };

  return (
    <Layout>
      <div className="container-church py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Smartphone className="mx-auto h-16 w-16 text-church-600 mb-4" />
            <h1 className="text-3xl font-bold mb-4">Instalar App ICB 610</h1>
            <p className="text-gray-600 text-lg">
              Instale nosso app em seu dispositivo para uma experiência melhor
            </p>
          </div>

          {/* Android - Download APK */}
          {isAndroid && (
            <div className="mb-8">
              <Card className="border-2 border-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-6 w-6" />
                    Baixar/Atualizar App para Android
                  </CardTitle>
                  <CardDescription>
                    Toque no botão abaixo para acessar o Google Drive da igreja e baixar o app oficial.
                    <br />
                    <strong>Passo a passo:</strong>
                    <br />
                    1. Clique no botão abaixo para abrir o Google Drive da ICB 610
                    <br />
                    2. No arquivo do app, toque nos três pontos (⋮) 
                    <br />
                    3. Selecione "Baixar" para fazer o download do APK
                    <br />
                    4. Após baixar, instale o app (pode precisar permitir fontes desconhecidas)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <a 
                    href="https://drive.google.com/file/d/1_caWEt3I7Bz8xYKjpNPlknGRrs9pOS0u/view?usp=sharing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                      <Download className="mr-2 h-5 w-5" />
                      📦 Baixar/Atualizar APP
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          )}

          {/* iOS - Instruções manuais */}
          {isIOS && (
            <div className="mb-8">
              <Card className="border-2 border-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-6 w-6" />
                    Como instalar no iPhone
                  </CardTitle>
                  <CardDescription>
                    Siga os passos abaixo para adicionar o app à sua tela inicial:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                      <p>Acesse este site pelo Safari</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                      <p>Toque no botão de compartilhar <Share className="inline h-4 w-4" /> (⬆️)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                      <p>Escolha "Adicionar à Tela de Início" <Plus className="inline h-4 w-4" /></p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</span>
                      <p>O app ficará com ícone e abrirá em tela cheia</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Desktop/Navegadores com suporte PWA */}
          {!isAndroid && !isIOS && showInstallButton && (
            <div className="mb-8">
              <Card className="border-2 border-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-6 w-6" />
                    Instalar App
                  </CardTitle>
                  <CardDescription>
                    Você pode instalar o app no seu computador clicando no botão abaixo.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={handleInstallClick}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    📲 Instalar App
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Instruções gerais quando não há suporte específico */}
          {!isAndroid && !isIOS && !showInstallButton && (
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Android Instructions */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-6 w-6" />
                    Android
                  </CardTitle>
                  <CardDescription>
                    Para dispositivos Android (Chrome, Edge, etc.)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <span className="bg-church-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                      <p>Abra este site no navegador Chrome ou Edge</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-church-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                      <p>Toque no menu (⋮) do navegador</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-church-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                      <p>Selecione "Instalar app" ou "Adicionar à tela inicial"</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-church-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</span>
                      <p>Confirme a instalação</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* iOS Instructions */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-6 w-6" />
                    iPhone/iPad
                  </CardTitle>
                  <CardDescription>
                    Para dispositivos iOS (Safari)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <span className="bg-church-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                      <p>Abra este site no Safari</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-church-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                      <p>Toque no botão de compartilhar <Share className="inline h-4 w-4" /></p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-church-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                      <p>Selecione "Adicionar à Tela de Início" <Plus className="inline h-4 w-4" /></p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-church-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</span>
                      <p>Toque em "Adicionar" para confirmar</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Benefícios do App</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Home className="h-6 w-6 text-church-600" />
                  <span>Acesso rápido pela tela inicial</span>
                </div>
                <div className="flex items-center gap-3">
                  <Smartphone className="h-6 w-6 text-church-600" />
                  <span>Experiência de app nativo</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Após a instalação, você pode acessar o app diretamente da sua tela inicial!
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Instalar;
