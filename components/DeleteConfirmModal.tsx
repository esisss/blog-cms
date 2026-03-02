"use client";

import { Trash2, X } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  title?: string;
  message?: string;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  title = "¿Eliminar artículo?",
  message = "Esta acción no se puede deshacer. El artículo será eliminado permanentemente.",
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-sm">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          disabled={isDeleting}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center pt-4">
          <div className="bg-error/10 p-4 rounded-full mb-4">
            <Trash2 className="w-8 h-8 text-error" />
          </div>
          <h3 className="font-bold text-lg mb-2">{title}</h3>
          <p className="text-base-content/70 mb-6">{message}</p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="btn btn-ghost flex-1"
              disabled={isDeleting}
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="btn btn-error flex-1"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Eliminar"
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="modal-backdrop bg-black/50" onClick={onClose} />
    </dialog>
  );
}
