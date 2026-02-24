"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  icon?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  icon,
  confirmText = "אישור",
  cancelText = "ביטול",
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card p-6 w-full max-w-sm text-center space-y-4"
          >
            {icon && (
              <div className="flex justify-center">{icon}</div>
            )}
            <h3 className="text-lg font-bold">{title}</h3>
            {description && (
              <p className="text-sm text-secondary">{description}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={onConfirm}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.97] ${
                  danger
                    ? "text-white"
                    : "btn-primary"
                }`}
                style={danger ? { background: "var(--accent-danger)" } : undefined}
              >
                {confirmText}
              </button>
              <button
                onClick={onCancel}
                className="flex-1 btn-secondary py-2.5 rounded-xl text-sm font-medium"
              >
                {cancelText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
