export default function ModalConfirmarInscricao({ isOpen, onClose, onConfirm, proc }) {
  if (!isOpen || !proc) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-lg animate-fade-in">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Confirmar Inscrição
        </h2>

        <p className="text-sm text-gray-700 mb-4">
          Deseja confirmar sua inscrição no procedimento<br />
          <span className="font-semibold">"{proc.titulo}"</span>?
        </p>

        <div className="space-y-3 text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border">
          <p className="flex items-center gap-2">
            <strong>Data:</strong> {proc.data}
          </p>

          <p className="flex items-center gap-2">
            <strong>Horário:</strong> {proc.horario} ({proc.duracao})
          </p>

          <p className="flex items-center gap-2">
            <strong>Estudante:</strong> {proc.estudante.nome}
          </p>

          <p className="flex items-center gap-2">
            <strong>Local:</strong> {proc.local}
          </p>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          Após a confirmação, você estará oficialmente inscrito(a) no procedimento.
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Confirmar Inscrição
          </button>
        </div>
      </div>
    </div>
  );
}