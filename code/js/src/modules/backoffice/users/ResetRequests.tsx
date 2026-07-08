import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Check, X, ArrowLeft, MoreHorizontal } from 'lucide-react';

import { Tabs, Tab } from '@/shared/components/Tabs';
import { Table, TableHeader, TableColumn, TableRow, TablePagination, TableBody } from '@/shared/components/table/Table';
import { useUsers } from '@/shared/hooks/useUsers';
import { useI18n } from '@/shared/hooks/useI18n';
import { useSnackbar } from '@/shared/hooks/useSnackbar';
import { useFilters } from '@/shared/hooks/useFilters';
import { ConfirmModal, type ModalConfig } from '@/shared/components/modals/ConfirmModal';
import { useAuthentication } from '@/shared/hooks/useAuthentication';
import type { ResetRequest } from '@/shared/services/users/users.types';
import { ResetRequestDetailModal } from './ResetRequestDetailModal.tsx';

type ModalAction = 'approve' | 'reject';

export function ResetRequests() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showSnackbar } = useSnackbar();
  const { buildQuery } = useFilters();
  const { user } = useAuthentication();
  
  const { 
    loading, 
    resetRequests, 
    resetRequestsPagination, 
    getAllResetRequests, 
    approveResetRequest, 
    rejectResetRequest 
  } = useUsers();

  const [selectedRequest, setSelectedRequest] = useState<null | ResetRequest>(null);
  const [modalAction, setModalAction] = useState<ModalAction | null>(null);
  const [detailRequest, setDetailRequest] = useState<null | ResetRequest>(null);

  const canManageUsers = user?.features?.includes('manage-users');

  useEffect(() => {
    if (user && !canManageUsers) {
      navigate('/backoffice', { replace: true });
    }
  }, [user, canManageUsers, navigate]);

  const currentTab = searchParams.get('tab') || 'pending';

  useEffect(() => {
    if (canManageUsers) {
      const apiStatus = currentTab === 'approved' ? 'APPROVED' : 'PENDING';
      const params = buildQuery(
        { p: 'page', total: 'size', refresh: 'refresh' }, 
        { status: apiStatus }
      );
      getAllResetRequests(params);
    }
  }, [getAllResetRequests, searchParams, buildQuery, canManageUsers, currentTab]);

  const modalConfig: Record<ModalAction, ModalConfig> = {
    approve: {
      title: t('reset_requests.approve_title'),
      subtitle: t('reset_requests.approve_confirmation'),
      confirmLabel: t('common.approve'),
      action: approveResetRequest,
      getRedirect: () => `/backoffice/users/reset-requests?tab=pending`,
      alert: null
    },
    reject: {
      title: t('reset_requests.reject_title'),
      subtitle: t('reset_requests.reject_confirmation'),
      confirmLabel: t('common.reject'),
      action: rejectResetRequest,
      getRedirect: () => `/backoffice/users/reset-requests?tab=pending`,
      variant: 'danger',
      alert: null
    },
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setModalAction(null);
  };

  const handleRefreshData = (baseRedirectPath: string) => {
    const currentParams = new URLSearchParams(searchParams);

    const [path, queryString] = baseRedirectPath.split('?');
    if (queryString) {
      const newParams = new URLSearchParams(queryString);
      newParams.forEach((value, key) => currentParams.set(key, value));
    }

    currentParams.set('refresh', Date.now().toString());
    navigate(`${path || window.location.pathname}?${currentParams.toString()}`, { replace: true });
  };

  const handleConfirmAction = async () => {
    if (!selectedRequest || !activeConfig) return;
    
    const res = await activeConfig.action(selectedRequest.id);
    if (!res.ok) {
      showSnackbar(res.error, 'error');
      return;
    }
    
    showSnackbar(t('common.success_message'), 'success');
    closeModal();
    handleRefreshData(activeConfig.getRedirect());
  };

  const openActionModal = (action: ModalAction, request: ResetRequest) => {
    setSelectedRequest(request);
    setModalAction(action);
  };

  const activeConfig = modalAction ? modalConfig[modalAction] : undefined;

  if (!canManageUsers) return null;

  return (
    <div className="container-fluid pf-0">  
      
      <div className="mb-4">
        <button onClick={() => navigate('/backoffice/users')} className="btn btn-link text-dark p-0 d-flex align-items-center gap-2 text-decoration-none">
          <ArrowLeft size={16} />
          <span>{t('users.back_to_list')}</span>
        </button>
      </div>

      <Tabs>
        <Tab id="pending" label={t('common.pending')}>
          <ResetRequestsTable 
            loading={loading}
            requests={resetRequests}
            onAction={openActionModal}
            onOpenDetails={setDetailRequest}
            isApprovedTab={false}
          />
        </Tab>
        <Tab id="approved" label={t('common.approved')}>
          <ResetRequestsTable 
            loading={loading}
            requests={resetRequests}
            onAction={openActionModal}
            onOpenDetails={setDetailRequest}
            isApprovedTab={true}
          />
        </Tab>
      </Tabs>

      {resetRequestsPagination && (
        <div className="mt-3">
          <TablePagination 
            hasPrevious={resetRequestsPagination.hasPrevious} 
            hasNext={resetRequestsPagination.hasNext} 
          />
        </div>
      )}

      <ConfirmModal
      open={!!selectedRequest && !!modalAction}
      onConfirm={handleConfirmAction}
      config={activeConfig}
      name="reset-request"
      closeModal={closeModal}
      />

      <ResetRequestDetailModal 
      request={detailRequest}
      isOpen={!!detailRequest}
      onClose={() => setDetailRequest(null)}
      />
      </div>
  );
}

type TableProps = {
  loading: boolean;
  requests: ResetRequest[] | undefined;
  onAction: (action: ModalAction, request: ResetRequest) => void;
  onOpenDetails: (request: ResetRequest) => void;
  isApprovedTab: boolean;
};

function ResetRequestsTable({ loading, requests, onAction, onOpenDetails, isApprovedTab }: TableProps) {
  const { t } = useI18n();

  return (
    <Table dataTestId={isApprovedTab ? 'approved-requests-table' : 'pending-requests-table'}>
      <TableHeader>
        <TableColumn className="col-lg-3" isHeader={true}>{t('users.name')}</TableColumn>
        <TableColumn className="col-lg-3" isHeader={true}>{t('users.username')}</TableColumn>
        <TableColumn className="col-lg-4" isHeader={true}>{t('users.email')}</TableColumn>
        <TableColumn className="col-lg-2 text-center" isHeader={true}>{t('common.actions')}</TableColumn>
      </TableHeader>
      
      <TableBody 
        cols={4} 
        loading={loading} 
        isEmpty={!requests || requests.length === 0} 
        emptyMessage={t('reset_requests.empty_list')}
      >
        {requests?.map((row: ResetRequest) => (
          <TableRow key={row.id}>
            <TableColumn className="col-lg-3">
              <span className="fw-medium text-dark">{row.requesterName || '-'}</span>
            </TableColumn>
            <TableColumn className="col-lg-3">
              <span className="text-secondary">{row.requesterUsername}</span>
            </TableColumn>
            <TableColumn className="col-lg-4">
              <span className="text-secondary">{row.requesterEmail}</span>
            </TableColumn>
            <TableColumn className="col-lg-2 text-lg-end">
              <div className="d-flex justify-content-center align-items-center gap-2">
                {!isApprovedTab ? (
                  <>
                    <button onClick={() => onAction('approve', row)} className="btn btn-dark rounded-2 p-2 d-flex align-items-center" title={t('common.approve')}>
                      <Check size={16} />
                    </button>
                    <button onClick={() => onAction('reject', row)} className="btn btn-danger rounded-2 p-2 d-flex align-items-center" title={t('common.reject')}>
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <button onClick={() => onOpenDetails(row)} className="btn btn-outline-secondary rounded-2 p-2 d-flex align-items-center" title={t('common.details')}>
                    <MoreHorizontal size={16} />
                  </button>
                )}
              </div>
            </TableColumn>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}