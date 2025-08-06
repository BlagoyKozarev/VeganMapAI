export const designTokens = {
  // Spacing system
  spacing: {
    xs: '4px',
    sm: '8px', 
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px'
  },

  // Modal and popup sizes
  modalSizes: {
    small: {
      width: '320px',
      maxWidth: '90vw',
      minHeight: '200px'
    },
    medium: {
      width: '480px', 
      maxWidth: '90vw',
      minHeight: '300px'
    },
    large: {
      width: '640px',
      maxWidth: '95vw', 
      minHeight: '400px'
    },
    fullScreen: {
      width: '100vw',
      height: '100vh',
      maxWidth: 'none'
    }
  },

  // Popup positioning
  popupSizes: {
    tooltip: {
      maxWidth: '280px',
      padding: '12px'
    },
    scoreExplanation: {
      width: '320px',
      maxWidth: '90vw',
      padding: '16px'
    },
    restaurantCard: {
      width: '360px',
      maxWidth: '95vw', 
      minHeight: '200px',
      padding: '20px'
    }
  },

  // Typography scale
  typography: {
    h1: { fontSize: '28px', fontWeight: '700', lineHeight: '1.2' },
    h2: { fontSize: '24px', fontWeight: '600', lineHeight: '1.3' },
    h3: { fontSize: '20px', fontWeight: '600', lineHeight: '1.4' },
    h4: { fontSize: '18px', fontWeight: '600', lineHeight: '1.4' },
    body: { fontSize: '16px', fontWeight: '400', lineHeight: '1.5' },
    bodySmall: { fontSize: '14px', fontWeight: '400', lineHeight: '1.4' },
    caption: { fontSize: '12px', fontWeight: '400', lineHeight: '1.3' }
  },

  // Color system
  colors: {
    primary: '#22C55E',      // Green
    primaryHover: '#16A34A',
    secondary: '#3B82F6',    // Blue  
    secondaryHover: '#2563EB',
    text: {
      primary: '#111827',
      secondary: '#6B7280', 
      muted: '#9CA3AF'
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      overlay: 'rgba(0, 0, 0, 0.5)'
    },
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B', 
    error: '#EF4444'
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  },

  // Border radius
  borderRadius: {
    sm: '4px',
    md: '8px', 
    lg: '12px',
    xl: '16px',
    full: '9999px'
  },

  // Z-index layers
  zIndex: {
    base: 0,
    dropdown: 10,
    overlay: 20,
    modal: 30,
    popover: 40,
    tooltip: 50,
    toast: 60
  }
};