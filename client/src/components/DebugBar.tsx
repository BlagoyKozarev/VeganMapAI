import React from 'react';
import { API_BASE } from '../config';

export default function DebugBar({ count }: { count: number }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 10,
      left: 10,
      padding: '8px 12px',
      background: '#111',
      color: '#fff',
      fontSize: 12,
      zIndex: 9999,
      borderRadius: 8,
      fontFamily: 'monospace'
    }}>
      <div>API_BASE: {API_BASE}</div>
      <div>points: {count}</div>
    </div>
  );
}