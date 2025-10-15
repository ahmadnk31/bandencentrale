import { useState } from 'react';

interface Toast {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (toast: Toast) => {
    // For now, just log to console
    // In a real app, you'd integrate with a toast library like sonner or react-hot-toast
    console.log(`Toast: ${toast.title}`, toast.description);
    
    // Simple alert for demo purposes
    if (toast.variant === 'destructive') {
      alert(`Error: ${toast.title}\n${toast.description || ''}`);
    } else {
      console.log(`Success: ${toast.title}\n${toast.description || ''}`);
    }
  };

  return { toast, toasts };
}
