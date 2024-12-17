const Popup = ({ message, onClose }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <p className="text-zinc-700">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-green-800 text-white px-4 py-2 rounded-xl"
        >
          Close
        </button>
      </div>
    </div>
  );

  export default Popup