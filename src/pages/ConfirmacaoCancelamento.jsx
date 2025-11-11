import React from "react";
import { X } from "lucide-react";

export default function ConfirmacaoCancelamento({ isOpen, onClose, onConfirm, proc }) {
  if (!isOpen || !proc) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-xl p-6 relative">
        
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>

        {/* Título */}
        <h2 className="text-xl font-bold text-gray-800 mb-3">Cancelar Inscrição</h2>

        <p className="text-gray-700 mb-4">
          Tem certeza que deseja cancelar sua inscrição no procedimento
          <strong> "{proc.titulo}"</strong>?
        </p>

        {/* Informações do Procedimento */}
        <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 space-y-1 mb-4">
          <p><strong>Data:</strong> {proc.data}</p>
          <p><strong>Horário:</strong> {proc.horario}</p>
          <p><strong>Estudante:</strong> {proc.estudante.nome}</p>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Esta ação não pode ser desfeita. O estudante será notificado sobre o cancelamento.
        </p>

        {/* Botões */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Manter Inscrição
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Confirmar Cancelamento
          </button>
        </div>
      </div>
    </div>
  );
}