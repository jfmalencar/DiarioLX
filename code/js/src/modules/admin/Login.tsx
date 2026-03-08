import React, { useReducer } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';

import { useAuthentication } from '@/shared/hooks/useAuthentication';
import { useI18n } from '@/shared/hooks/useI18n';

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
  const navigate = useNavigate();
  const { t } = useI18n();

  if (state.tag === 'redirect') {
    return <Navigate to={location.state?.source || '/admin'} replace={true} />;
  }

  function handleChange(ev: React.FormEvent<HTMLInputElement>) {
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
    <div className='login-container'>
      <h2>{t('login.title')}</h2>
      <form onSubmit={handleSubmit} className='login-form'>
        <fieldset disabled={state.tag !== 'editing'}>
          <div className='form-group'>
            <label htmlFor='username'>{t('login.username')}</label>
            <input id='username' type='text' name='username' value={username} onChange={handleChange} className='form-input' />
          </div>
          <div className='form-group'>
            <label htmlFor='password'>{t('login.password')}</label>
            <input id='password' type='password' name='password' value={password} onChange={handleChange} className='form-input' />
          </div>
          <div>
            <button type='submit' className='login-button'>{t('login.submit')}</button>
          </div>
        </fieldset>
        {state.tag === 'editing' && state.error && <div className='error-message'>{state.error}</div>}
      </form>
      <div className='register-prompt'>
        <p>{t('login.no_account')}</p>
        <button onClick={() => navigate('/register', {state: { source: location.state?.source || '/admin' }, replace: true })} className='secondary-button'>
          {t('login.register')}
        </button>
      </div>
    </div>
  );
}