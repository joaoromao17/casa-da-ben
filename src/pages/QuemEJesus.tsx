import Layout from "@/components/layout/Layout";
import PageHero from "@/components/ui/PageHero";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const sections = [
  {
    title: "Quem é Jesus?",
    text: "Jesus Cristo é o Filho de Deus, enviado ao mundo para revelar o amor do Pai. Ele nasceu, viveu entre nós, ensinou sobre o Reino de Deus, e mostrou através de sua vida o caminho para uma relação verdadeira com Deus.",
    verse: '"Eu sou o caminho, a verdade e a vida. Ninguém vem ao Pai senão por mim."',
    ref: "João 14:6",
  },
  {
    title: "O que Ele fez?",
    text: "Jesus deu sua vida na cruz para que pudéssemos ser reconciliados com Deus. Ele carregou sobre si os nossos pecados, morreu e ressuscitou ao terceiro dia, vencendo a morte e abrindo o caminho para a vida eterna.",
    verse: '"Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna."',
    ref: "João 3:16",
  },
  {
    title: "Por que isso importa?",
    text: "Porque todos nós precisamos de salvação. O pecado nos separa de Deus, mas Jesus é a ponte que nos reconecta ao Pai. Através dele, encontramos perdão, propósito, esperança e vida verdadeira.",
    verse: '"Porque o salário do pecado é a morte, mas o dom gratuito de Deus é a vida eterna em Cristo Jesus, nosso Senhor."',
    ref: "Romanos 6:23",
  },
  {
    title: "Como começar?",
    text: "O primeiro passo é simples: crer em Jesus e aceitar o que Ele fez por você. Não é necessário ser perfeito — basta um coração aberto. Você pode orar agora mesmo, onde estiver, e convidar Jesus para fazer parte da sua vida.",
    verse: '"Eis que estou à porta e bato. Se alguém ouvir a minha voz e abrir a porta, entrarei e cearei com ele, e ele comigo."',
    ref: "Apocalipse 3:20",
  },
];

const QuemEJesus = () => {
  return (
    <Layout>
      <PageHero
        title="Quem é Jesus?"
        subtitle="A mensagem mais importante que você pode ouvir"
        image="/lovable-uploads/sobre_nos.png"
        imageAlt="Quem é Jesus"
      />

      <section className="section-padding bg-background">
        <div className="container-church max-w-3xl">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`${i > 0 ? "mt-16" : ""}`}
            >
              <h2 className="heading-display text-2xl md:text-3xl text-foreground mb-4">{section.title}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{section.text}</p>
              <div className="bg-warm-50 border-l-4 border-church-gold rounded-r-2xl p-6">
                <blockquote className="font-display text-lg italic text-foreground leading-relaxed">
                  {section.verse}
                </blockquote>
                <p className="text-church-gold font-semibold text-sm mt-3">{section.ref}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-padding bg-warm-50">
        <div className="container-church text-center max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-display text-2xl md:text-3xl text-foreground mb-4">
              Queremos caminhar com você
            </h2>
            <p className="text-muted-foreground mb-8">
              Se esta mensagem tocou o seu coração, venha nos visitar. Estamos aqui para ajudar você a dar os próximos passos na sua caminhada de fé.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/primeira-visita">
                <Button className="btn-primary-warm group">
                  Planeje sua Visita <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contato">
                <Button variant="outline" className="border-warm-300 text-foreground hover:bg-warm-100">
                  Fale Conosco
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default QuemEJesus;
