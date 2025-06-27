
import { useState, useEffect } from "react";
import { TextareaWithCounter } from "@/components/ui/TextareaWithCounter";
import { Input } from "@/components/ui/input";
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
  const [pdfUrl, setPdfUrl] = useState<string>(initialData?.pdfUrl || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [author, setAuthor] = useState(initialData?.author || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [isSuccess, setIsSuccess] = useState(false);

  // Atualiza pdfUrl se initialData mudar (ex: quando abrir edição)
  useEffect(() => {
    setPdfUrl(initialData?.pdfUrl || "");
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEditing = !!initialData;

    // Validação: precisa ter arquivo ou link
    if (!isEditing && !pdfFile && !pdfUrl.trim()) {
      alert("Você precisa enviar um arquivo PDF ou informar um link.");
      return;
    }

    const formData = new FormData();
    
    // Priorizar link externo se fornecido
    if (pdfUrl.trim()) {
      formData.append("pdfUrl", pdfUrl.trim());
    } else if (pdfFile) {
      formData.append("pdf", pdfFile);
    }

    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("category", category);
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
        setPdfUrl("");
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
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Descrição</label>
            <TextareaWithCounter
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o conteúdo do estudo..."
              className="h-32"
              maxLength={500}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Autor</label>
            <Input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
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
            <p className="text-sm text-gray-500 mb-2">
              Você pode <strong>enviar um arquivo PDF</strong> ou <strong>colar o link do estudo</strong> (ex: Google Drive).
            </p>

            <label className="block text-sm font-medium">Link do Estudo (PDF) - opcional</label>
            <Input
              type="url"
              placeholder="https://drive.google.com/..."
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Upload de PDF - opcional</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                setPdfFile(e.target.files?.[0] || null);
              }}
              className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!!pdfUrl.trim()}
            />
            {pdfUrl.trim() && (
              <p className="text-sm text-gray-500">
                Upload desabilitado porque um link foi fornecido.
              </p>
            )}
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
