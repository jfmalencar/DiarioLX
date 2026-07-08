import { useState } from 'react';
import { Copy, CheckCircle } from 'lucide-react';
import { Modal } from '@/shared/components/modals/Modal';
import { useI18n } from '@/shared/hooks/useI18n';
import { useSnackbar } from '@/shared/hooks/useSnackbar';
import type { ResetRequest } from '@/shared/services/users/users.types';

type Props = {
  request: ResetRequest | null;
  isOpen: boolean;
  onClose: () => void;
};

export function ResetRequestDetailModal({ request, isOpen, onClose }: Props) {
  const { t } = useI18n();
  const { showSnackbar } = useSnackbar();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = (token: string | null) => {
    if (!token) return;
    const domain = window.location.origin;
    const fullLink = `${domain}/backoffice/reset-password?resetToken=${token}`;
    
    navigator.clipboard.writeText(fullLink);
    setCopied(true);
    showSnackbar(t('reset_requests.copied_success'), 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!request) return null;

  return (
    <Modal
      isOpen={isOpen}
      title={t('reset_requests.details_title')}
      onClose={onClose}
      buttons={[
        {
          key: 'close',
          label: t('common.close'),
          variant: 'secondary',
          onClick: onClose
        }
      ]}
    >
      <div className="d-flex flex-column gap-3">
        <div>
          <label className="text-muted small fw-bold text-uppercase">{t('users.name')}</label>
          <div className="fs-5 fw-medium text-dark">{request.requesterName || '-'}</div>
        </div>
        
        <div className="row">
          <div className="col-6">
            <label className="text-muted small fw-bold text-uppercase">{t('users.username')}</label>
            <div className="text-dark">{request.requesterUsername}</div>
          </div>
          <div className="col-6">
            <label className="text-muted small fw-bold text-uppercase">{t('users.email')}</label>
            <div className="text-dark">{request.requesterEmail}</div>
          </div>
        </div>

        <div className="row">
          <div className="col-6">
            <label className="text-muted small fw-bold text-uppercase">{t('common.status')}</label>
            <div>
              <span className="badge bg-success">{request.status}</span>
            </div>
          </div>
          <div className="col-6">
            <label className="text-muted small fw-bold text-uppercase">{t('reset_requests.created_at')}</label>
            <div className="text-dark">{new Date(request.createdAt).toLocaleString()}</div>
          </div>
        </div>

        {request.adminUsername && (
          <div className="p-3 bg-light rounded border border-start-4 border-success">
            <label className="text-muted small fw-bold text-uppercase">{t('reset_requests.approved_by')}</label>
            <div className="fw-medium text-dark">{request.adminName} ({request.adminUsername})</div>
          </div>
        )}

        {request.resetToken && (
          <div className="mt-2">
            <label className="text-muted small fw-bold text-uppercase mb-2 d-block">
              {t('reset_requests.link_label')}
            </label>
            <div className="input-group">
              <input 
                type="text" 
                className="form-control bg-light" 
                readOnly 
                value={`${window.location.origin}/backoffice/reset-password?resetToken=${request.resetToken}`}
              />
              <button 
                className={`btn ${copied ? 'btn-success' : 'btn-dark'}`}
                type="button"
                onClick={() => handleCopyLink(request.resetToken)}
              >
                {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}