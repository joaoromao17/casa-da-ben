import { useState } from "react";
import axios from "axios";

type UploadEstudoFormProps = {
  onUploadSuccess: () => void;
};

const UploadEstudoForm = ({ onUploadSuccess }: UploadEstudoFormProps) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) return alert("Escolha um arquivo PDF!");

    const formData = new FormData();
    formData.append("pdf", pdfFile);
    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("date", new Date().toISOString().split('T')[0]);

    try {
      await axios.post("http://localhost:8080/api/estudos/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIsSuccess(true); // marca que deu sucesso
      onUploadSuccess();  // avisa o pai que deu sucesso também

      // Limpa campos
      setTitle("");
      setAuthor("");
      setDescription("");
      setCategory("");
      setPdfFile(null);

    } catch (error) {
      console.error("Erro ao enviar estudo:", error);
      alert("Erro ao enviar o estudo.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isSuccess ? (
        <>
          {/* Campos de formulário */}
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
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
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
          {/* Botão "OK" */}
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
