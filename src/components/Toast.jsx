import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const Icon =
          toast.type === 'success'
            ? CheckCircle2
            : toast.type === 'warning'
            ? AlertCircle
            : Info;

        return (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <Icon
              size={18}
              color={
                toast.type === 'success'
                  ? '#22C55E'
                  : toast.type === 'warning'
                  ? '#FF6B35'
                  : '#0066CC'
              }
            />
            <span style={{ fontSize: '0.9rem', fontWeight: 500, flex: 1 }}>
              {toast.message}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#9CA3AF',
                padding: '2px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
