import { useState, type ReactNode } from 'react';

import { Snackbar } from '@/shared/components/Snackbar';
import { SnackbarContext, type SnackbarType } from '@/shared/hooks/useSnackbar'

type Props = {
    children: ReactNode
}

export const SnackbarProvider = ({ children }: Props) => {
    const [state, setState] = useState({
        show: false,
        message: '',
        type: 'info' as SnackbarType,
        delay: 3000,
    });

    const showSnackbar = (
        message: string,
        type: SnackbarType = 'info',
        delay = 3000
    ) => {
        setState({
            show: true,
            message,
            type,
            delay,
        });
    };

    const hideSnackbar = () => {
        setState((prev) => ({
            ...prev,
            show: false,
        }));
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <Snackbar
                show={state.show}
                message={state.message}
                type={state.type}
                delay={state.delay}
                onClose={hideSnackbar}
            />
        </SnackbarContext.Provider>
    );
}
