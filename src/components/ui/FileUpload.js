import React, { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, AlertTriangle } from 'lucide-react';

export default function FileUpload({ onFileSelect, acceptedFormats = '.pdf', maxFileSizeMB = 5 }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setError(null);
    setFile(null);

    if (selectedFile) {
      const fileSizeMB = selectedFile.size / 1024 / 1024;
      
      if (fileSizeMB > maxFileSizeMB) {
        setError(`O arquivo excede o limite de ${maxFileSizeMB}MB.`);
        onFileSelect(null);
        return;
      }
      
      // Validação de formato simples (pode ser mais robusta)
      const fileExtension = '.' + selectedFile.name.split('.').pop().toLowerCase();
      if (!acceptedFormats.includes(fileExtension)) {
        setError(`Formato de arquivo inválido. Aceito: ${acceptedFormats}.`);
        onFileSelect(null);
        return;
      }

      setFile(selectedFile);
      onFileSelect(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Limpa o input file
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedFormats}
        className="hidden"
      />

      {!file ? (
        <div
          className={`border-2 border-dashed p-6 rounded-lg text-center cursor-pointer transition-colors ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-teal-500'
          }`}
          onClick={() => fileInputRef.current.click()}
        >
          <Upload className="mx-auto h-10 w-10 text-teal-500" />
          <p className="mt-2 text-sm text-gray-600">
            Arraste e solte ou <span className="font-semibold text-teal-600">clique para selecionar</span>
          </p>
          <p className="text-xs text-gray-500">
            {acceptedFormats} (Máx. {maxFileSizeMB}MB)
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 border border-green-400 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">{file.name}</span>
          </div>
          <button onClick={handleRemoveFile} className="text-green-600 hover:text-red-600">
            <X size={18} />
          </button>
        </div>
      )}

      {error && (
        <div className="mt-2 flex items-center space-x-2 text-sm text-red-600">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

