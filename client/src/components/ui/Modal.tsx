import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { designTokens } from '../../styles/designTokens';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'small' | 'medium' | 'large' | 'fullScreen';
  children: React.ReactNode;
  className?: string;
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  size = 'medium', 
  children, 
  className = '' 
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const modalSize = designTokens.modalSizes[size];

  // Handle ESC key and outside clicks
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: designTokens.colors.background.overlay,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: designTokens.zIndex.modal,
        padding: designTokens.spacing.md
      }}
    >
      <div
        ref={modalRef}
        className={`modal-content ${className}`}
        style={{
          backgroundColor: designTokens.colors.background.primary,
          borderRadius: designTokens.borderRadius.lg,
          boxShadow: designTokens.shadows.xl,
          width: modalSize.width,
          maxWidth: modalSize.maxWidth,
          minHeight: size === 'fullScreen' ? '100vh' : (modalSize as any).minHeight,
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative'
        }}
      >
        {/* Header */}
        {title && (
          <div 
            className="modal-header"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: `${designTokens.spacing.lg} ${designTokens.spacing.lg} ${designTokens.spacing.md}`,
              borderBottom: `1px solid ${designTokens.colors.border}`
            }}
          >
            <h2 style={{
              ...designTokens.typography.h3,
              color: designTokens.colors.text.primary,
              margin: 0
            }}>
              {title}
            </h2>
            <button
              onClick={onClose}
              className="modal-close-button"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: designTokens.spacing.sm,
                borderRadius: designTokens.borderRadius.md,
                color: designTokens.colors.text.secondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Content */}
        <div 
          className="modal-body"
          style={{
            padding: designTokens.spacing.lg
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}