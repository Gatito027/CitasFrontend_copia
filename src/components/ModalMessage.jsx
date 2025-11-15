// src/components/ModalMessage.jsx
export default function ModalMessage({ text, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-20 backdrop-blur-md">
      <div className="p-6 rounded-lg shadow-lg transition-opacity duration-300 bg-white text-black">
        <p className="text-lg font-semibold">{text}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-sky-500 text-white py-2 px-4 rounded-lg transition-all hover:scale-[1.03]"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
