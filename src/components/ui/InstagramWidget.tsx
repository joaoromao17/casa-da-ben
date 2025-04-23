import { useEffect } from "react";

const InstagramWidget = () => {
  useEffect(() => {
    // Verifica se o script já foi carregado para evitar duplicação
    if (!document.querySelector('script[src="https://static.elfsight.com/platform/platform.js"]')) {
      const script = document.createElement("script");
      script.src = "https://static.elfsight.com/platform/platform.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full flex justify-center">
      <div
        className="elfsight-app-da554126-7c2f-4e5b-b587-5cb0cf253300 w-full"
        data-elfsight-app-lazy
      />
    </div>
  );
};

export default InstagramWidget;