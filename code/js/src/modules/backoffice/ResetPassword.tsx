import React, { useReducer, useState } from 'react';
import { Navigate, useSearchParams, Link } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';

import { useI18n } from '@/shared/hooks/useI18n';
import { useUsers } from '@/shared/hooks/useUsers';
import { isValidPassword } from '@/shared/services/auth/auth.validation';

import image from '@/assets/login.png';
import logo from '@/assets/logo.svg';

// State type
type State = {
  password: string;
  confirmPassword: string;
  error: string | undefined;
  stage: 'editing' | 'posting' | 'succeed' | 'failed';
};

// Action types
type Action =
  | { type: 'input-change'; inputName: string; inputValue: string }
  | { type: 'post' }
  | { type: 'success' }
  | { type: 'error'; message: string };

// Reducer function
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'input-change':
      return {
        ...state,
        [action.inputName]: action.inputValue,
      };
    case 'post':
      return {
        ...state,
        stage: 'posting',
        error: undefined,
      };
    case 'success':
      return {
        password: '',
        confirmPassword: '',
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
  password: '',
  confirmPassword: '',
  error: undefined,
  stage: 'editing',
};

export function ResetPassword() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const { completePasswordReset } = useUsers();
  const { t } = useI18n();

  const resetToken = searchParams.get('resetToken');
  
  // Expressão regular para validar 64 caracteres hexadecimais (0-9, a-f, A-F)
  const hex64Regex = /^[a-fA-F0-9]{64}$/;

  // Redireciona para o login caso o token falte ou seja inválido
  if (!resetToken || !hex64Regex.test(resetToken)) {
    return <Navigate to="/backoffice/login" replace={true} />;
  }

  function handleChange(ev: React.FormEvent<HTMLInputElement>) {
    const { name, value } = ev.currentTarget;
    dispatch({ type: 'input-change', inputName: name, inputValue: value });
  }

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    dispatch({ type: 'post' });

    try {
      // Validar a segurança da password usando o teu validador existente
      if (!isValidPassword(state.password)) {
        dispatch({ type: 'error', message: t('register.invalid_password') });
        return;
      }

      // Validar a confirmação de igualdade
      if (state.password !== state.confirmPassword) {
        dispatch({ type: 'error', message: t('register.password_mismatch') });
        return;
      }

      if (!resetToken || !hex64Regex.test(resetToken)) {
        return <Navigate to="/backoffice/login" replace={true} />;
      }
      
      // Executa a ação do useUsers passando o token da URL e a nova password
      const res = await completePasswordReset(resetToken, state.password);

      if (res && !res.ok) {
        dispatch({ 
          type: 'error', 
          message: res.error || t('forgot_password.error_message') || 'Não foi possível alterar a password.' 
        });
        return;
      }

      dispatch({ type: 'success' });
    } catch (err) {
      dispatch({
        type: 'error',
        message: err instanceof Error ? err.message : t('forgot_password.error_message') || 'Não foi possível alterar a password.',
      });
    }
  }

  return (
    <div className='container-fluid vh-100'>
      <div className='row h-100'>
        {/* Lado Esquerdo - Imagem de marca */}
        <div className='col-md-6 d-none d-md-flex align-items-center justify-content-center text-white text-center'
          style={{ background: `url(${image}) center/cover no-repeat` }}>
          <div>
            <img src={logo} alt='DiárioLX' className='mb-2' style={{ width: '150px' }} />
            <p>Backoffice</p>
            <Link to='/' className='text-white small'>{t('login.visit')}</Link>
          </div>
        </div>

        {/* Lado Direito - Formulário */}
        <div className='col-md-6 d-flex align-items-center justify-content-center'>
          <div className='w-50'>
            <h2 className='fw-bold'>{t('login.reset_password') || 'Definir Nova Password'}</h2>
            
            {state.stage === 'succeed' ? (
              <div className='mt-3'>
                <div className='alert alert-success'>
                  {t('reset_password.success_message') || 'A sua password foi alterada com sucesso!'}
                </div>
                <div className='mt-4'>
                  <Link to='/backoffice/login' className='btn btn-dark w-100 rounded-0'>
                    {t('login.submit') || 'Ir para o Login'}
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <p className='text-muted'>
                  {t('reset_password.subtitle') || 'Por favor, introduza e confirme a sua nova credencial de acesso.'}
                </p>
                
                <form onSubmit={handleSubmit}>
                  {/* Campo da Nova Password */}
                  <div className='mb-3 input-group'>
                    <input
                      data-testid='password-reset'
                      value={state.password}
                      onChange={handleChange}
                      type={showPassword ? 'text' : 'password'}
                      name='password'
                      className='form-control border-0 border-bottom rounded-0 border-black'
                      placeholder={t('register.password')}
                      required
                      disabled={state.stage === 'posting'}
                    />
                    <button
                      type='button'
                      className='input-group-text border-0 border-bottom rounded-0 border-black bg-transparent'
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? t('register.hide_password') : t('register.show_password')}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Campo de Confirmação */}
                  <div className='mb-3 input-group'>
                    <input
                      value={state.confirmPassword}
                      onChange={handleChange}
                      type={showPassword ? 'text' : 'password'}
                      name='confirmPassword'
                      className='form-control border-0 border-bottom rounded-0 border-black'
                      placeholder={t('register.confirm_password')}
                      required
                      disabled={state.stage === 'posting'}
                    />
                    <button
                      type='button'
                      className='input-group-text border-0 border-bottom rounded-0 border-black bg-transparent'
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? t('register.hide_password') : t('register.show_password')}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {state.error && <div className='alert alert-danger mb-3'>{state.error}</div>}

                  <button
                    data-testid='submit-reset-password'
                    className='btn btn-outline-dark w-100 rounded-0'
                    disabled={state.stage === 'posting' || !state.password || !state.confirmPassword}
                  >
                    {state.stage === 'posting' ? t('register.loading') || 'A guardar...' : t('reset_password.submit') || 'Atualizar Password'}
                  </button>

                  <div className='text-center mt-4'>
                    <Link to='/backoffice/login' className='small text-decoration-none'>
                      {t('register.back_to_login')}
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