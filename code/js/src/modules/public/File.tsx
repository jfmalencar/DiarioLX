import { useState, useRef } from 'react';

const API_BASE_URL = "http://localhost:5173";

const FileUpload = () => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleUpload = async () => {
        const file = fileInputRef.current?.files[0];
        if (!file) {
            alert("Escolhe um ficheiro primeiro!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/files`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const result = await response.json();

            // Atualiza o estado com a URL retornada pelo backend
            setPreviewUrl(result.url);
            console.log("Sucesso:", result);
        } catch (err) {
            console.error(err);
            alert("Erro no upload");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            {/* Input e Botão */}
            <div>
                <input
                    type="file"
                    ref={fileInputRef}
                    id="fileInput"
                />
                <button
                    onClick={handleUpload}
                    disabled={loading}
                >
                    {loading ? "A enviar..." : "Upload"}
                </button>
            </div>

            {/* Preview da Imagem */}
            <div style={{ marginTop: '16px' }}>
                {previewUrl && (
                    <img
                        src={previewUrl}
                        alt="Preview"
                        style={{ maxWidth: '300px', display: 'block' }}
                    />
                )}
            </div>
        </div>
    );
};

export { FileUpload };