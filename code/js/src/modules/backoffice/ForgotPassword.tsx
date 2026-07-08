import React, { useReducer } from 'react';
import { Link } from 'react-router';

import { useI18n } from '@/shared/hooks/useI18n';
import image from '@/assets/login.png';
import logo from '@/assets/logo.svg';
import { useUsers } from '@/shared/hooks/useUsers';

type State = {
username: string;
error: string | undefined;
stage: 'editing' | 'posting' | 'succeed' | 'failed';
};

type Action =
| { type: 'input-change'; username: string }
| { type: 'post' }
| { type: 'success' }
| { type: 'error'; message: string };

function reducer(state: State, action: Action): State {
switch (action.type) {
case 'input-change':
    return {
    ...state,
    username: action.username,
    };
case 'post':
    return {
    ...state,
    stage: 'posting',
    error: undefined,
    };
case 'success':
    return {
    ...state,
    username: '',
    error: undefined,
    stage: 'succeed',
    };
case 'error':
    return {
    ...state,
    stage: 'failed',
    error: action.message,
    };
default:
    return state;
}
}

const initialState: State = {
username: '',
error: undefined,
stage: 'editing',
};

export function ForgotPassword() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { t } = useI18n();
    const { requestPasswordReset } = useUsers();

    function handleChange(ev: React.FormEvent<HTMLInputElement>) {
        dispatch({
            type: 'input-change',
            username: ev.currentTarget.value,
        });
    }

    async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        dispatch({ type: 'post' });

        const result = await requestPasswordReset(state.username);
        if (result.ok) {
            dispatch({ type: 'success' });
        } else {
            dispatch({
                type: 'error',
                message: result.error || t('forgot_password.error_message'),
            });
        }
    }

    return (
        <div className='container-fluid vh-100'>
            <div className='row h-100'>
            <div className='col-md-6 d-none d-md-flex align-items-center justify-content-center text-white text-center'
                style={{ background: `url(${image}) center/cover no-repeat` }}>
                <div>
                <img src={logo} alt='DiárioLX' className='mb-2' style={{ width: '150px' }} />
                <p>Backoffice</p>
                <Link to='/' className='text-white small'>{t('login.visit')}</Link>
                </div>
            </div>

            <div className='col-md-6 d-flex align-items-center justify-content-center'>
                <div className='w-50'>
                <h2 className='fw-bold'>{t('login.forgot_password')}</h2>
                
                {state.stage === 'succeed' ? (
                    <div className='mt-3'>
                    <div className='alert alert-success'>
                        {t('forgot_password.success_message')}
                    </div>
                    <div className='mt-4'>
                        <Link to='/backoffice/login' className='btn btn-dark w-100 rounded-0'>
                        {t('forgot_password.back_to_login')}
                        </Link>
                    </div>
                    </div>
                ) : (
                    <>
                    <p className='text-muted'>
                        {t('forgot_password.subtitle')}
                    </p>
                    
                    <form onSubmit={handleSubmit}>
                        <div className='mb-4'>
                        <input
                            data-testid='username-forgot-password'
                            value={state.username}
                            onChange={handleChange}
                            type='text'
                            name='username'
                            className='form-control border-0 border-bottom rounded-0 border-black'
                            placeholder='username'
                            required
                            disabled={state.stage === 'posting'}
                        />
                        </div>

                        {state.error && <div className='alert alert-danger mb-3'>{state.error}</div>}

                        <button
                        data-testid='submit-forgot-password'
                        className='btn btn-outline-dark w-100 rounded-0 mb-3'
                        disabled={state.stage === 'posting' || !state.username}
                        >
                        {state.stage === 'posting' ? t('login.loading') : t('forgot_password.send_request')}
                        </button>

                        <div className='text-center mt-3'>
                        <Link to='/backoffice/login' className='small text-decoration-none'>
                            {t('forgot_password.back_to_login')}
                        </Link>
                        </div>
                    </form>
                    </>
                )}
                </div>
            </div>
            </div>
        </div>
    );
}