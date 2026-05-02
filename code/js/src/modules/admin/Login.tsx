import React, { useReducer, useState } from 'react';
import { Navigate, useLocation, Link } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';

import { useAuthentication } from '@/shared/hooks/useAuthentication';
import { useI18n } from '@/shared/hooks/useI18n';

import image from '@/assets/login.png';
import logo from '@/assets/logo.svg';

// State type
type State = {
  username: string;
  password: string;
  error: string | undefined;
  stage: 'editing' | 'posting' | 'succeed' | 'failed';
};

// Action types
type Action =
  | { type: 'input-change'; username: string; password: string }
  | { type: 'post' }
  | { type: 'success' }
  | { type: 'error'; message: string };

// Reducer function
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'input-change':
      return {
        ...state,
        username: action.username,
        password: action.password,
      };
    case 'post':
      return {
        ...state,
        stage: 'posting',
        error: undefined,
      };
    case 'success':
      return {
        username: '',
        password: '',
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

// Initial state
const initialState: State = {
  username: '',
  password: '',
  error: undefined,
  stage: 'editing',
};

export function Login() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { login, error } = useAuthentication();
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const { t } = useI18n();

  if (state.stage === 'succeed') {
    return <Navigate to={location.state?.source || '/admin'} replace={true} />;
  }

  function handleChange(ev: React.FormEvent<HTMLInputElement>) {
    const { name, value } = ev.currentTarget;
    dispatch({
      type: 'input-change',
      username: name === 'username' ? value : state.username,
      password: name === 'password' ? value : state.password,
    });
  }

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    dispatch({ type: 'post' });

    try {
      const result = await login(state.username, state.password);
      if (!result) {
        dispatch({ type: 'error', message: error || t('login.invalid_credentials') });
        return;
      }
      dispatch({ type: 'success' });
    } catch (err) {
      dispatch({
        type: 'error',
        message: err instanceof Error ? err.message : t('login.invalid_credentials'),
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
            <h2 className='fw-bold'>{t('login.title')}</h2>
            <p className='text-muted'>{t('login.subtitle')}</p>
            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <input
                  data-testid='username-login'
                  value={state.username}
                  onChange={handleChange}
                  type='text'
                  name='username'
                  className='form-control border-0 border-bottom rounded-0 border-black'
                  placeholder='username'
                  required
                />
              </div>
              <div className='mb-3 input-group'>
                <input
                  data-testid='password-login'
                  value={state.password}
                  onChange={handleChange}
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  className='form-control border-0 border-bottom rounded-0 border-black'
                  placeholder='password'
                  required
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
              <div className='text-end mb-4'>
                <Link to='/admin/forgot-password' className='small'>
                  {t('login.forgot_password')}
                </Link>
              </div>
              <button
                data-testid='submit-login'
                className='btn btn-outline-dark w-100 rounded-0'
                disabled={state.stage === 'posting'}
              >
                {state.stage === 'posting' ? t('login.loading') || 'Logging in...' : t('login.submit')}
              </button>
              <div className='text-center mt-4'>
                <span className='text-muted'>{t('login.new_user')}</span>
                <Link to='/admin/register' state={{ source: location.state?.source || '/admin' }} replace={true} className='ms-2'>
                  {t('login.create_account')}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
