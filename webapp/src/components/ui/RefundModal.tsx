import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

const REFUND_REASONS = [
  'Не смогу прийти — личные обстоятельства',
  'Заболел / травма',
  'Конфликт расписания — другое событие',
  'Неподходящий уровень участников',
  'Отменилась командная встреча',
  'Другая причина',
];

interface RefundModalProps {
  paymentId: string;
  amount: number;
  hoursBeforeStart: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function RefundModal({ paymentId, amount, hoursBeforeStart, onClose, onSuccess }: RefundModalProps) {
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refundAmount = hoursBeforeStart > 6 ? amount : Math.round(amount * 0.5);
  const isPartial = hoursBeforeStart <= 6;

  const handleRefund = async () => {
    const finalReason = reason === 'Другая причина' ? customReason : reason;
    if (!finalReason) { setError('Выберите или укажите причину возврата'); return; }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ payment_id: paymentId, reason: finalReason }),
      });
      const data = await res.json();
      if (res.ok) {
        onSuccess();
      } else {
        setError(data.error || 'Ошибка при оформлении возврата');
      }
    } catch {
      setError('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          backdropFilter: 'blur(4px)',
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '1.5rem 1.5rem 0 0',
        padding: '24px 24px 40px',
        zIndex: 101,
        maxWidth: '480px',
        margin: '0 auto',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
        animation: 'slideUp 0.25s ease-out',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={18} color="#ef4444" />
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Возврат оплаты</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Вернём {refundAmount} ₽ {isPartial ? '(50% — менее 6ч до старта)' : '(100%)'}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Предупреждение при частичном возврате */}
        {isPartial && (
          <div style={{
            borderRadius: '1rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca',
            padding: '12px', fontSize: '0.75rem', color: '#991b1b', marginBottom: '16px',
          }}>
            ⚠️ До начала события {Math.round(hoursBeforeStart)} ч. По правилам сервиса — возврат 50% (удержание сервисного сбора).
          </div>
        )}

        {/* Причины */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          {REFUND_REASONS.map((r) => (
            <button
              key={r}
              onClick={() => setReason(r)}
              style={{
                padding: '12px 16px',
                borderRadius: '1rem',
                border: `1.5px solid ${reason === r ? 'var(--accent)' : 'var(--border-color)'}`,
                backgroundColor: reason === r ? '#eff6ff' : 'var(--bg-app)',
                color: reason === r ? 'var(--accent)' : 'var(--text-main)',
                fontSize: '0.875rem',
                textAlign: 'left',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: reason === r ? 600 : 400,
                transition: 'all 0.1s',
              }}
            >
              {reason === r ? '✓ ' : ''}{r}
            </button>
          ))}
        </div>

        {/* Своя причина */}
        {reason === 'Другая причина' && (
          <textarea
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value.slice(0, 200))}
            placeholder="Опишите причину кратко..."
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '1rem',
              border: '1px solid var(--border-color)',
              fontFamily: 'inherit',
              fontSize: '0.875rem',
              resize: 'none',
              height: '80px',
              boxSizing: 'border-box',
              marginBottom: '16px',
            }}
          />
        )}

        {error && (
          <div style={{ color: '#ef4444', fontSize: '0.75rem', marginBottom: '12px' }}>{error}</div>
        )}

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="outline" fullWidth onClick={onClose}>Отмена</Button>
          <button
            onClick={handleRefund}
            disabled={loading || !reason}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '1rem',
              backgroundColor: '#ef4444',
              color: 'white',
              fontWeight: 600,
              border: 'none',
              cursor: (loading || !reason) ? 'not-allowed' : 'pointer',
              opacity: (loading || !reason) ? 0.6 : 1,
              fontFamily: 'inherit',
              fontSize: '0.875rem',
              transition: 'opacity 0.15s',
            }}
          >
            {loading ? 'Оформляю...' : `Вернуть ${refundAmount} ₽`}
          </button>
        </div>
      </div>
    </>
  );
}
