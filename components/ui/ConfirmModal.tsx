"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmDisabled?: boolean;
  className?: string;
  locale?: string;
}

export function ConfirmModal({
  open,
  title = "Confirm",
  description,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  confirmDisabled,
  className,
  locale,
}: ConfirmModalProps) {
  const confirmRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    const id = requestAnimationFrame(() => confirmRef.current?.focus());
    return () => {
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(id);
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 grid place-items-center p-4",
        className
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div
        className="absolute inset-0 bg-paper/80 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-lg rounded-card border border-rule bg-paper-2 text-ink">
        <div className="px-6 py-5">
          <h3 id="confirm-modal-title" className="text-lg font-semibold">
            {title}
          </h3>
          {description ? (
            <p className="mt-1 text-sm text-ink-3">{description}</p>
          ) : null}
          {children ? (
            <div className="mt-4 rounded-md border border-rule bg-paper p-3 text-sm text-ink-2 max-h-64 overflow-auto whitespace-pre-wrap">
              {children}
            </div>
          ) : null}
          <div className="mt-6 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className={`border-rule text-ink-2 hover:bg-paper-3 generate_lead_modal_cancel${locale ? `_${locale}` : ''}`}
            >
              {cancelText}
            </Button>
            <Button
              type="button"
              ref={confirmRef}
              onClick={onConfirm}
              disabled={!!confirmDisabled}
              className={`bg-lime-green text-carbon hover:bg-lime-green/90 generate_lead_modal_confirm${locale ? `_${locale}` : ''}`}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

