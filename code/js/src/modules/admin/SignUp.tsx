import React, { useReducer, useState } from 'react';
import { Navigate, useLocation, Link } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';

import { useAuthentication } from '@/shared/hooks/useAuthentication';
import { useI18n } from '@/shared/hooks/useI18n';
import { isValidEmail, isValidName, isValidPassword } from '@/shared/services/auth/auth.validation';

import image from '@/assets/login.png';
import logo from '@/assets/logo.svg';

// State type
type State = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  inviteCode: string;
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
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        inviteCode: '',
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
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  inviteCode: '',
  error: undefined,
  stage: 'editing',
};

export function SignUp() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const { register, login, error } = useAuthentication();
  const location = useLocation();
  const { t } = useI18n();

  if (state.stage === 'succeed') {
    return <Navigate to={location.state?.source || '/admin'} replace={true} />;
  }

  function handleChange(ev: React.FormEvent<HTMLInputElement>) {
    const { name, value } = ev.currentTarget;
    dispatch({ type: 'input-change', inputName: name, inputValue: value });
  }

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    dispatch({ type: 'post' });

    try {
      // Validate inputs
      if (!isValidName(state.firstName)) {
        dispatch({ type: 'error', message: t('register.invalid_name') });
        return;
      }

      if (!isValidName(state.lastName)) {
        dispatch({ type: 'error', message: t('register.invalid_name') });
        return;
      }

      if (!isValidEmail(state.email)) {
        dispatch({ type: 'error', message: t('register.invalid_email') });
        return;
      }

      if (!isValidPassword(state.password)) {
        dispatch({ type: 'error', message: t('register.invalid_password') });
        return;
      }

      if (state.password !== state.confirmPassword) {
        dispatch({ type: 'error', message: t('register.password_mismatch') });
        return;
      }

      // Register user
      const registerResult = await register(
        state.username,
        state.email,
        state.password,
        state.firstName,
        state.lastName,
        state.inviteCode
      );

      if (!registerResult) {
        dispatch({ type: 'error', message: error || t('register.invalid_registration') });
        return;
      }

      // Auto-login after registration
      const loginResult = await login(state.username, state.password);
      if (!loginResult) {
        dispatch({ type: 'error', message: error || t('login.invalid_credentials') });
        return;
      }

      dispatch({ type: 'success' });
    } catch (err) {
      dispatch({
        type: 'error',
        message: err instanceof Error ? err.message : t('register.invalid_registration'),
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
            <h2 className='fw-bold'>{t('register.title')}</h2>
            <p className='text-muted'>{t('register.subtitle')}</p>
            <form onSubmit={handleSubmit}>
              <div className='row g-3 mb-3'>
                <div className='col-6'>
                  <input
                    value={state.firstName}
                    onChange={handleChange}
                    type='text'
                    name='firstName'
                    className='form-control border-0 border-bottom rounded-0 border-black'
                    placeholder={t('register.first_name')}
                    required
                  />
                </div>
                <div className='col-6'>
                  <input
                    value={state.lastName}
                    onChange={handleChange}
                    type='text'
                    name='lastName'
                    className='form-control border-0 border-bottom rounded-0 border-black'
                    placeholder={t('register.last_name')}
                    required
                  />
                </div>
              </div>
              <div className='mb-3'>
                <input
                  value={state.username}
                  onChange={handleChange}
                  type='text'
                  name='username'
                  className='form-control border-0 border-bottom rounded-0 border-black'
                  placeholder={t('register.username')}
                  required
                />
              </div>
              <div className='mb-3'>
                <input
                  data-testid='email-register'
                  value={state.email}
                  onChange={handleChange}
                  type='email'
                  name='email'
                  className='form-control border-0 border-bottom rounded-0 border-black'
                  placeholder={t('register.email')}
                  required
                />
              </div>
              <div className='mb-3 input-group'>
                <input
                  data-testid='password-register'
                  value={state.password}
                  onChange={handleChange}
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  className='form-control border-0 border-bottom rounded-0 border-black'
                  placeholder={t('register.password')}
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
              <div className='mb-3 input-group'>
                <input
                  value={state.confirmPassword}
                  onChange={handleChange}
                  type={showPassword ? 'text' : 'password'}
                  name='confirmPassword'
                  className='form-control border-0 border-bottom rounded-0 border-black'
                  placeholder={t('register.confirm_password')}
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
              <div className='mb-3'>
                <input
                  value={state.inviteCode}
                  onChange={handleChange}
                  type='text'
                  name='inviteCode'
                  className='form-control border-0 border-bottom rounded-0 border-black'
                  placeholder={t('register.invite_code')}
                />
              </div>
              {state.error && <div className='alert alert-danger mb-3'>{state.error}</div>}
              <button
                data-testid='submit-register'
                className='btn btn-outline-dark w-100 rounded-0'
                disabled={state.stage === 'posting'}
              >
                {state.stage === 'posting' ? t('register.loading') || 'Registering...' : t('register.submit')}
              </button>
              <div className='text-center mt-4'>
                <Link to='/admin/login' className='small'>
                  {t('register.back_to_login')}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
