import React, { useReducer } from 'react';
import { Navigate, useLocation, Link } from 'react-router';

import { useAuthentication } from '@/shared/hooks/useAuthentication';
import { useI18n } from '@/shared/hooks/useI18n';

import image from '@/assets/login.png';
import logo from '@/assets/logo.svg';

type State =
  | { tag: 'editing'; error?: string; inputs: { username: string; password: string } }
  | { tag: 'submitting'; username: string }
  | { tag: 'redirect' };

type Action =
  | { type: 'edit'; inputName: string; inputValue: string }
  | { type: 'submit' }
  | { type: 'error'; message: string }
  | { type: 'success' };

function reduce(state: State, action: Action): State {
  switch (state.tag) {
    case 'editing':
      if (action.type === 'edit') {
        console.log(`Editing ${action.inputName} to ${action.inputValue}`);
        return { tag: 'editing', error: undefined, inputs: { ...state.inputs, [action.inputName]: action.inputValue } };
      } else if (action.type === 'submit') {
        return { tag: 'submitting', username: state.inputs.username };
      } else {
        console.log(`Unexpected action ${action.type} in state ${state.tag}`);
        return state;
      }

    case 'submitting':
      if (action.type === 'success') return { tag: 'redirect' };
      else if (action.type === 'error') return { tag: 'editing', error: action.message, inputs: { username: state.username, password: '' } };
      else { console.log(`Unexpected action ${action.type} in state ${state.tag}`); return state; }

    case 'redirect':
      console.log(`Unexpected action ${action.type} in state ${state.tag}`);
      return state;
  }
}

export function Login() {
  const [state, dispatch] = useReducer(reduce, { tag: 'editing', inputs: { username: '', password: '' } });
  const { login, error } = useAuthentication();
  const location = useLocation();
  const { t } = useI18n();

  if (state.tag === 'redirect') {
    return <Navigate to={location.state?.source || '/admin'} replace={true} />;
  }

  function handleChange(ev: React.FormEvent<HTMLInputElement>) {
    console.log(ev.currentTarget.name, ev.currentTarget.value);
    dispatch({ type: 'edit', inputName: ev.currentTarget.name, inputValue: ev.currentTarget.value });
  }

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (state.tag !== 'editing') return;

    dispatch({ type: 'submit' });
    const username = state.inputs.username;
    const password = state.inputs.password;

    const result = await login(username, password);
    if (!result) {
      dispatch({ type: 'error', message: error || t('login.invalid_credentials') });
      return;
    }
    dispatch({ type: 'success' });
  }

  const username = state.tag === 'submitting' ? state.username : state.inputs.username;
  const password = state.tag === 'submitting' ? '' : state.inputs.password;

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
                <input data-testid='username-login' value={username} onChange={handleChange} type='text' name='username' className='form-control border-0 border-bottom rounded-0 border-black' placeholder='username' />
              </div>
              <div className='mb-3'>
                <input data-testid='password-login' value={password} onChange={handleChange} type='password' name='password' className='form-control border-0 border-bottom rounded-0 border-black' placeholder='password' />
              </div>
              <div className='text-end mb-4'>
                <Link to='/admin/forgot-password' className='small'>
                  {t('login.forgot_password')}
                </Link>
              </div>
              <button data-testid='submit-login' className='btn btn-outline-dark w-100 rounded-0' disabled={state.tag === 'submitting'}>
                {t('login.submit')}
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
