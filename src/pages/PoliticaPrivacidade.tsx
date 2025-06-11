
import Layout from "@/components/layout/Layout";

const PoliticaPrivacidade = () => {
  return (
    <Layout>
      <section className="py-12 bg-white">
        <div className="container-church max-w-4xl">
          <h1 className="text-4xl font-bold text-church-900 mb-8 text-center">
            Política de Privacidade
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8 text-center">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-church-800 mb-4">1. Informações que Coletamos</h2>
                <p className="text-gray-700 mb-4">
                  A Igreja Casa da Bênção coleta informações que você fornece diretamente, como:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Nome completo e informações de contato</li>
                  <li>Endereço de e-mail e telefone</li>
                  <li>Data de nascimento e informações pessoais relevantes</li>
                  <li>Foto de perfil (opcional)</li>
                  <li>Informações sobre participação em ministérios</li>
                  <li>Testemunhos e pedidos de oração</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-church-800 mb-4">2. Como Usamos suas Informações</h2>
                <p className="text-gray-700 mb-4">
                  Utilizamos suas informações para:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Fornecer e melhorar nossos serviços</li>
                  <li>Comunicar-se com você sobre eventos e atividades da igreja</li>
                  <li>Facilitar sua participação em ministérios</li>
                  <li>Processar contribuições e doações</li>
                  <li>Manter registros de membros para fins administrativos</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-church-800 mb-4">3. Compartilhamento de Informações</h2>
                <p className="text-gray-700 mb-4">
                  Não vendemos, trocamos ou transferimos suas informações pessoais para terceiros sem seu consentimento, exceto:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Quando necessário para cumprir obrigações legais</li>
                  <li>Para proteger nossos direitos e propriedade</li>
                  <li>Com provedores de serviços que nos ajudam a operar o site</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-church-800 mb-4">4. Segurança dos Dados</h2>
                <p className="text-gray-700">
                  Implementamos medidas de segurança apropriadas para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-church-800 mb-4">5. Seus Direitos</h2>
                <p className="text-gray-700 mb-4">
                  Você tem o direito de:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Acessar suas informações pessoais</li>
                  <li>Corrigir dados incorretos</li>
                  <li>Solicitar a exclusão de suas informações</li>
                  <li>Retirar seu consentimento a qualquer momento</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-church-800 mb-4">6. Contato</h2>
                <p className="text-gray-700">
                  Para questões sobre esta política de privacidade, entre em contato conosco através do e-mail: 
                  <a href="mailto:icbcasadabencao610@gmail.com" className="text-church-600 hover:underline ml-1">
                    icbcasadabencao610@gmail.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PoliticaPrivacidade;
