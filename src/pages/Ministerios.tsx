import { ministeriosData } from "@/data/ministeriosData";
import MinistryCard from "@/components/ui/MinistryCard";
import Layout from "@/components/layout/Layout";

const Ministerios = () => {
  const allMinistries = Object.entries(ministeriosData).map(([slug, data]) => ({
    ...data,
    slug,
  }));

  return (
    <Layout>
      <section className="py-16">
        <div className="container-church">
          <h1 className="text-4xl font-bold text-center text-church-800 mb-8">Todos os Ministérios</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {allMinistries.map((ministerio, index) => (
              <MinistryCard
                key={index}
                title={ministerio.title}
                description={ministerio.description}
                imageUrl={ministerio.imageUrl}
                slug={ministerio.slug}
              />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Ministerios;