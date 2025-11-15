export default function ModalPDFViewer({ titulo, archivo, onClose }) {
  if (!archivo) return null;

  let src = null;

  if (typeof archivo === "string") {
    // Es un enlace directo
    src = archivo;
  } else if (archivo instanceof Blob) {
    // Es un archivo local
    src = URL.createObjectURL(archivo);
  } else {
    console.warn("Tipo de archivo no soportado:", archivo);
    return null;
  }

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold text-sky-600 mb-4">
          Visualizando: {titulo}
        </h2>
        {src ? (
          <embed
            src={src}
            type="application/pdf"
            className="w-full h-[500px] border rounded mb-4"
          />
        ) : (
          <p className="text-red-500">No se pudo cargar el PDF.</p>
        )}
      </div>
    </div>
  );
}