"use client";

import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function CardModal({ isOpen, onClose, title, children }: CardModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const scrollWrapper = document.querySelector('.bento-scroll') as HTMLElement;
    if (scrollWrapper) scrollWrapper.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      if (scrollWrapper) scrollWrapper.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-[9999] overflow-y-auto"
          style={{ isolation: 'isolate' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        >
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Centering container */}
          <div className="min-h-full flex items-center justify-center p-4 md:p-8" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
          {/* Modal */}
          <motion.div
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-[0_0_60px_rgba(0,0,0,0.5)]"
            initial={{ scale: 0.92, y: 30, opacity: 0, filter: "blur(8px)" }}
            animate={{ scale: 1, y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ scale: 0.95, y: 20, opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-elevated)]/90 backdrop-blur-sm">
              <span className="text-[11px] font-mono text-[var(--fg-3)] tracking-[0.2em] uppercase">
                {title}
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--fg-3)] hover:text-[var(--fg)] hover:border-[var(--border-hover)] transition-all text-sm"
                data-cursor="Close"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
