
import Layout from "@/components/layout/Layout";

const TermosUso = () => {
  return (
    <Layout>
      <section className="py-12 bg-white">
        <div className="container-church max-w-4xl">
          <h1 className="text-4xl font-bold text-church-900 mb-8 text-center">
            Termos de Uso
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8 text-center">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-church-800 mb-4">1. Aceitação dos Termos</h2>
                <p className="text-gray-700">
                  Ao acessar e usar o site da Igreja Casa da Bênção, você concorda em cumprir estes termos de uso. Se você não concordar com qualquer parte destes termos, não deve usar nosso site.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-church-800 mb-4">2. Uso do Site</h2>
                <p className="text-gray-700 mb-4">
                  Você pode usar nosso site para:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Acessar informações sobre a igreja e seus ministérios</li>
                  <li>Participar de estudos bíblicos e eventos</li>
                  <li>Compartilhar testemunhos e pedidos de oração</li>
                  <li>Fazer contribuições e doações</li>
                  <li>Interagir com outros membros da comunidade</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-church-800 mb-4">3. Conduta do Usuário</h2>
                <p className="text-gray-700 mb-4">
                  Ao usar nosso site, você concorda em:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Fornecer informações verdadeiras e precisas</li>
                  <li>Manter a confidencialidade de sua conta</li>
                  <li>Não usar o site para fins ilegais ou prejudiciais</li>
                  <li>Respeitar outros usuários e seus direitos</li>
                  <li>Não compartilhar conteúdo ofensivo ou inadequado</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-church-800 mb-4">4. Conteúdo do Usuário</h2>
                <p className="text-gray-700">
                  Você é responsável por qualquer conteúdo que publique no site, incluindo testemunhos e pedidos de oração. Reservamo-nos o direito de remover conteúdo que consideremos inadequado ou que viole estes termos.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-church-800 mb-4">5. Propriedade Intelectual</h2>
                <p className="text-gray-700">
                  Todo o conteúdo do site, incluindo textos, imagens, logos e materiais de estudo, é propriedade da Igreja Casa da Bênção e está protegido por direitos autorais.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-church-800 mb-4">6. Limitação de Responsabilidade</h2>
                <p className="text-gray-700">
                  A Igreja Casa da Bênção não se responsabiliza por danos diretos ou indiretos resultantes do uso deste site, incluindo perda de dados ou interrupções de serviço.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-church-800 mb-4">7. Modificações</h2>
                <p className="text-gray-700">
                  Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações serão efetivas imediatamente após a publicação no site.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-church-800 mb-4">8. Contato</h2>
                <p className="text-gray-700">
                  Para questões sobre estes termos de uso, entre em contato conosco através do e-mail: 
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

export default TermosUso;
