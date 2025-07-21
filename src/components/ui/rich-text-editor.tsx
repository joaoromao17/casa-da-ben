import React, { useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  maxLength?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Digite sua mensagem...",
  className,
  maxLength = 500
}) => {
  const quillRef = useRef<ReactQuill>(null);

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['link'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ],
  };

  const formats = [
    'bold', 'italic', 'underline',
    'link', 'list', 'bullet'
  ];

  const handleChange = (content: string, delta: any, source: any, editor: any) => {
    const text = editor.getText();
    
    // Verificar limite de caracteres
    if (text.length <= maxLength + 1) { // +1 por causa do \n final do quill
      onChange(content);
    }
  };

  // Função para obter o texto simples (sem HTML) para contagem
  const getTextLength = () => {
    if (!quillRef.current) return 0;
    const editor = quillRef.current.getEditor();
    const text = editor.getText();
    return Math.max(0, text.length - 1); // -1 por causa do \n final do quill
  };

  return (
    <div className={cn("relative", className)}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        style={{
          height: '120px',
          marginBottom: '42px'
        }}
      />
      <div className="absolute bottom-0 right-0 text-sm text-muted-foreground">
        {getTextLength()}/{maxLength} caracteres
      </div>
      
      <style>{`
        .ql-editor {
          min-height: 80px !important;
          font-size: 14px;
        }
        .ql-toolbar {
          border-top: 1px solid hsl(var(--border));
          border-left: 1px solid hsl(var(--border));
          border-right: 1px solid hsl(var(--border));
        }
        .ql-container {
          border-bottom: 1px solid hsl(var(--border));
          border-left: 1px solid hsl(var(--border));
          border-right: 1px solid hsl(var(--border));
          border-radius: 0 0 6px 6px;
        }
        .ql-toolbar {
          border-radius: 6px 6px 0 0;
        }
        .ql-editor.ql-blank::before {
          color: hsl(var(--muted-foreground));
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
};