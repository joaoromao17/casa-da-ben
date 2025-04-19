import { Link } from "react-router-dom";
import { ministeriosData } from "@/data/ministeriosData";

const Ministerios = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Nossos Ministérios</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Object.entries(ministeriosData).map(([key, ministerio]) => (
          <Link
            to={`/ministerios/${key}`}
            key={key}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={ministerio.imageUrl}
              alt={ministerio.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{ministerio.title}</h2>
              <p className="text-gray-600">{ministerio.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Ministerios;
