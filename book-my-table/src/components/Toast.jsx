import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const icons = {
  success: <CheckCircle size={18} />,
  error: <XCircle size={18} />,
  info: <Info size={18} />,
  warning: <AlertTriangle size={18} />,
};

export default function ToastContainer() {
  const { toasts } = useApp();

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {icons[t.type] || icons.info}
          <span style={{ flex: 1 }}>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
