import React, { useEffect, useRef, useState } from 'react';
import { designTokens } from '../../styles/designTokens';

interface PopoverProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: React.ReactElement;
  content: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  size?: 'tooltip' | 'scoreExplanation' | 'restaurantCard';
  className?: string;
}

export function Popover({
  isOpen,
  onClose,
  trigger,
  content,
  placement = 'auto',
  size = 'tooltip',
  className = ''
}: PopoverProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [actualPlacement, setActualPlacement] = useState(placement);

  const popoverSize = designTokens.popupSizes[size];

  // Calculate optimal position
  useEffect(() => {
    if (!isOpen || !triggerRef.current || !popoverRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let top = 0;
    let left = 0;
    let finalPlacement = placement;

    // Auto placement logic
    if (placement === 'auto') {
      const spaceBelow = viewport.height - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
      const spaceRight = viewport.width - triggerRect.right;
      const spaceLeft = triggerRect.left;

      if (spaceBelow >= popoverRect.height) {
        finalPlacement = 'bottom';
      } else if (spaceAbove >= popoverRect.height) {
        finalPlacement = 'top';
      } else if (spaceRight >= popoverRect.width) {
        finalPlacement = 'right';
      } else {
        finalPlacement = 'left';
      }
    }

    // Position calculation based on placement
    switch (finalPlacement) {
      case 'bottom':
        top = triggerRect.bottom + 8;
        left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
        break;
      case 'top':
        top = triggerRect.top - popoverRect.height - 8;
        left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
        left = triggerRect.right + 8;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
        left = triggerRect.left - popoverRect.width - 8;
        break;
    }

    // Keep within viewport bounds
    left = Math.max(8, Math.min(left, viewport.width - popoverRect.width - 8));
    top = Math.max(8, Math.min(top, viewport.height - popoverRect.height - 8));

    setPosition({ top, left });
    setActualPlacement(finalPlacement);
  }, [isOpen, placement]);

  // Handle outside clicks
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Trigger */}
      <div ref={triggerRef} className="popover-trigger">
        {trigger}
      </div>

      {/* Popover */}
      {isOpen && (
        <div
          ref={popoverRef}
          className={`popover-content ${className}`}
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            width: (popoverSize as any).width || 'auto',
            maxWidth: popoverSize.maxWidth || '90vw',
            backgroundColor: designTokens.colors.background.primary,
            border: `1px solid ${designTokens.colors.border}`,
            borderRadius: designTokens.borderRadius.lg,
            boxShadow: designTokens.shadows.lg,
            padding: popoverSize.padding,
            zIndex: designTokens.zIndex.popover,
            fontSize: designTokens.typography.bodySmall.fontSize,
            lineHeight: designTokens.typography.bodySmall.lineHeight
          }}
        >
          {content}
        </div>
      )}
    </>
  );
}