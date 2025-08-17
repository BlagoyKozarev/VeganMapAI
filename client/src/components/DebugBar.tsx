import React from 'react';
import { API_BASE } from '../config';

export default function DebugBar({ count }: { count: number }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 10,
      left: 10,
      background: '#111',
      color: '#fff',
      padding: '6px 10px',
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