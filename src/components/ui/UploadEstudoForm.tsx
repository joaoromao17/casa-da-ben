import { useState, useEffect } from "react";
import api from "@/services/api";

type UploadEstudoFormProps = {
  onUploadSuccess: () => void;
  initialData?: {
    id: string;
    title: string;
    description: string;
    author: string;
    category: string;
    pdfUrl?: string;
    date: string;
  };
};

const UploadEstudoForm = ({ onUploadSuccess, initialData }: UploadEstudoFormProps) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | undefined>(initialData?.pdfUrl);
  const [title, setTitle] = useState(initialData?.title || "");
  const [author, setAuthor] = useState(initialData?.author || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [isSuccess, setIsSuccess] = useState(false);

  // Atualiza pdfUrl se initialData mudar (ex: quando abrir edição)
  useEffect(() => {
    setPdfUrl(initialData?.pdfUrl);
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEditing = !!initialData;

    // Se não está editando, pdfFile é obrigatório
    if (!isEditing && !pdfFile) {
      alert("Escolha um arquivo PDF!");
      return;
    }

    const formData = new FormData();
    // Só adiciona PDF no form se tiver um arquivo novo
    if (pdfFile) {
      formData.append("pdf", pdfFile);
    }

    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("category", category);
    // Se quiser permitir alterar a data, pode criar estado para ela.
    // Por enquanto, mantém a data atual ou usa a data atual do sistema:
    formData.append("date", initialData?.date || new Date().toISOString().split("T")[0]);

    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      alert("Você precisa estar logado para enviar estudos.");
      return;
    }

    try {
      if (isEditing) {
        // PUT com formData multipart/form-data
        await api.put(`/estudos/${initialData.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/estudos/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setIsSuccess(true);
      onUploadSuccess();

      if (!isEditing) {
        // limpar formulário só no upload novo
        setTitle("");
        setAuthor("");
        setDescription("");
        setCategory("");
        setPdfFile(null);
        setPdfUrl(undefined);
      }
    } catch (error) {
      console.error("Erro ao enviar estudo:", error);
      alert("Erro ao enviar o estudo.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isSuccess ? (
        <>
          {/* Campos do formulário */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Autor</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecione uma categoria</option>
              <option value="Bíblia">Bíblia</option>
              <option value="Doutrina">Doutrina</option>
              <option value="Família">Família</option>
              <option value="Evangelismo">Evangelismo</option>
              <option value="Vida Cristã">Vida Cristã</option>
              <option value="Finanças">Finanças</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Upload de PDF</label>

            {/* Se tiver pdfUrl, mostra o link */}
            {pdfUrl && (
              <p className="mb-2">
                PDF atual:{" "}
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  Ver PDF
                </a>
              </p>
            )}

            <input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                setPdfFile(e.target.files?.[0] || null);
                // Se trocar arquivo, esconde o link atual
                if (e.target.files?.[0]) setPdfUrl(undefined);
              }}
              className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              // Apenas obrigatório no upload novo, no edit não
              required={!initialData}
            />
          </div>

          {/* Botão de salvar */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Salvar
            </button>
          </div>
        </>
      ) : (
        <div className="text-center space-y-4">
          <p className="text-green-600 font-semibold">Estudo enviado com sucesso!</p>
          <button
            type="button"
            onClick={onUploadSuccess}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            OK
          </button>
        </div>
      )}
    </form>
  );
};

export default UploadEstudoForm;
