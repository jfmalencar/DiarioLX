import { Modal } from '@/shared/components/modals/Modal';
import { Alert, type AlertVariant } from '@/shared/components/Alert';

export type ModalConfig = {
    title: string;
    subtitle: string;
    alert: string;
    confirmLabel: string;
    action: (id: string) => Promise<void>;
    getRedirect: () => string;
    variant?: AlertVariant;
}

type Props = {
    name: string;
    config?: ModalConfig;
    closeModal: () => void;
    open: boolean
    onConfirm: () => void;
}

export const ConfirmModal = ({ name, config, open, closeModal, onConfirm }: Props) => {
    return (
        <Modal
            isOpen={open !== null && config !== undefined}
            title={config?.title ?? ''}
            onClose={closeModal}
            buttons={[
                {
                    key: 'cancel',
                    label: 'Cancelar',
                    variant: 'secondary',
                    onClick: closeModal,
                    dataTestId: `cancel-${name}-button`,
                },
                {
                    key: 'confirm',
                    label: config?.confirmLabel ?? '',
                    variant: 'primary',
                    dataTestId: `confirm-${name}-button`,
                    onClick: onConfirm,
                },
            ]}
        >
            <h6 className='mb-3'>{config?.subtitle}</h6>
            <Alert variant={config?.variant ?? 'warning'} title='Atenção!'>
                {config?.alert}
            </Alert>
        </Modal>
    )
}
