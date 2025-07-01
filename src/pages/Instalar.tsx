
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Download, Share, Plus, Home } from "lucide-react";

const Instalar = () => {
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);
    
    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);

    // Detecta se o PWA pode ser instalado
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    const deferredPrompt = (window as any).deferredPrompt;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      (window as any).deferredPrompt = null;
      setCanInstall(false);
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
              Instale nosso app em seu dispositivo para uma experiência melhor e acesso offline
            </p>
          </div>

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
                {canInstall && isAndroid ? (
                  <div className="space-y-4">
                    <Button 
                      onClick={handleInstallClick}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Instalar App Agora
                    </Button>
                    <p className="text-sm text-gray-600">
                      Clique no botão acima para instalar diretamente
                    </p>
                  </div>
                ) : (
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
                )}
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

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Benefícios do App</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Home className="h-6 w-6 text-church-600" />
                  <span>Acesso rápido pela tela inicial</span>
                </div>
                <div className="flex items-center gap-3">
                  <Smartphone className="h-6 w-6 text-church-600" />
                  <span>Experiência de app nativo</span>
                </div>
                <div className="flex items-center gap-3">
                  <Download className="h-6 w-6 text-church-600" />
                  <span>Funciona mesmo offline</span>
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
