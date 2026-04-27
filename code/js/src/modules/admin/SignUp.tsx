import React, { useReducer, useState } from 'react';
import { Navigate, useLocation, Link } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';

import { useAuthentication } from '@/shared/hooks/useAuthentication';
import { useI18n } from '@/shared/hooks/useI18n';
import { isValidEmail, isValidName, isValidPassword } from '@/shared/services/auth/auth.validation';

import image from '@/assets/login.png';
import logo from '@/assets/logo.svg';

type Inputs = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  inviteCode: string;
}

type State =
  | { tag: 'editing'; error?: string; inputs: Inputs }
  | { tag: 'submitting'; inputs: Inputs }
  | { tag: 'redirect' };

type Action =
  | { type: 'edit'; inputName: keyof Inputs; inputValue: string }
  | { type: 'submit' }
  | { type: 'error'; message: string }
  | { type: 'success' };

function reduce(state: State, action: Action): State {
  switch (state.tag) {
    case 'editing':
      if (action.type === 'edit') {
        return { tag: 'editing', error: undefined, inputs: { ...state.inputs, [action.inputName]: action.inputValue } };
      } else if (action.type === 'submit') {
        return { tag: 'submitting', inputs: state.inputs };
      } else {
        return state;
      }

    case 'submitting':
      if (action.type === 'success') return { tag: 'redirect' };
      else if (action.type === 'error') return { tag: 'editing', error: action.message, inputs: state.inputs };
      else { return state; }

    case 'redirect':
      return state;
  }
}

export function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, dispatch] = useReducer(reduce, {
    tag: 'editing',
    inputs: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      inviteCode: '',
    },
  });
  const { register, login, error } = useAuthentication();
  const location = useLocation();
  const { t } = useI18n();

  if (state.tag === 'redirect') {
    return <Navigate to={location.state?.source || '/admin'} replace={true} />;
  }

  const canSubmit = state.tag === 'editing'
    && isValidName(state.inputs.firstName)
    && isValidName(state.inputs.lastName)
    && state.inputs.password.length > 0
    && state.inputs.password === state.inputs.confirmPassword
    && isValidEmail(state.inputs.email)
    && isValidPassword(state.inputs.password);

  function handleChange(ev: React.FormEvent<HTMLInputElement>) {
    dispatch({ type: 'edit', inputName: ev.currentTarget.name as keyof Inputs, inputValue: ev.currentTarget.value });
  }

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (state.tag !== 'editing') return;

    dispatch({ type: 'submit' });
    const { firstName, lastName, username, password, inviteCode, confirmPassword } = state.inputs;

    if (!isValidName(firstName) || !isValidName(lastName)) {
      dispatch({ type: 'error', message: t('register.invalid_name') });
      return;
    }

    if (password !== confirmPassword) {
      dispatch({ type: 'error', message: t('register.password_mismatch') });
      return;
    }

    if (!isValidEmail(state.inputs.email)) {
      dispatch({ type: 'error', message: t('register.invalid_email') });
      return;
    }

    if (!isValidPassword(password)) {
      dispatch({ type: 'error', message: t('register.invalid_password') });
      return;
    }

    const result = await register(username, state.inputs.email, password, firstName, lastName, inviteCode);
    if (!result) {
      dispatch({ type: 'error', message: error || t('register.invalid_registration') });
      return;
    }

    const authenticatedUser = await login(username, password);
    if (!authenticatedUser) {
      dispatch({ type: 'error', message: error || t('login.invalid_credentials') });
      return;
    }

    dispatch({ type: 'success' });
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
                  <input value={state.inputs.firstName} onChange={handleChange} type='text' name='firstName' className='form-control border-0 border-bottom rounded-0 border-black' placeholder={t('register.first_name')} />
                </div>
                <div className='col-6'>
                  <input value={state.inputs.lastName} onChange={handleChange} type='text' name='lastName' className='form-control border-0 border-bottom rounded-0 border-black' placeholder={t('register.last_name')} />
                </div>
              </div>
              <div className='mb-3'>
                <input value={state.inputs.username} onChange={handleChange} type='text' name='username' className='form-control border-0 border-bottom rounded-0 border-black' placeholder={t('register.username')} />
              </div>
              <div className='mb-3'>
                <input data-testid='email-register' value={state.inputs.email} onChange={handleChange} type='email' name='email' className='form-control border-0 border-bottom rounded-0 border-black' placeholder={t('register.email')} />
              </div>
              <div className='mb-3 input-group'>
                <input data-testid='password-register' value={state.inputs.password} onChange={handleChange} type={showPassword ? 'text' : 'password'} name='password' className='form-control border-0 border-bottom rounded-0 border-black' placeholder={t('register.password')} />
                <button type='button' className='input-group-text border-0 border-bottom rounded-0 border-black bg-transparent' onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? t('register.hide_password') : t('register.show_password')}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className='mb-3 input-group'>
                <input value={state.inputs.confirmPassword} onChange={handleChange} type={showPassword ? 'text' : 'password'} name='confirmPassword' className='form-control border-0 border-bottom rounded-0 border-black' placeholder={t('register.confirm_password')} />
                <button type='button' className='input-group-text border-0 border-bottom rounded-0 border-black bg-transparent' onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? t('register.hide_password') : t('register.show_password')}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className='mb-3'>
                <input value={state.inputs.inviteCode} onChange={handleChange} type='text' name='inviteCode' className='form-control border-0 border-bottom rounded-0 border-black' placeholder={t('register.invite_code')} />
              </div>
              <button data-testid='submit-register' className='btn btn-outline-dark w-100 rounded-0' disabled={state.tag === 'submitting' || !canSubmit}>
                {t('register.submit')}
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
