import { useEffect, useReducer } from 'react';

type HttpResponse = {}

// The State
type State<A extends HttpResponse> =
  | { type: 'begin' }
  | { type: 'loading'; url: string }
  | { type: 'loaded'; payload: A; url: string }
  | { type: 'error'; error: Error; url: string };

// The Action
type Action<A extends HttpResponse> =
  | { type: 'start-loading'; url: string }
  | { type: 'loading-success'; payload: A; url: string }
  | { type: 'loading-error'; error: Error };

function unexpectedAction<A extends HttpResponse>(action: Action<A>, state: State<A>): State<A> {
  console.log(`Unexpected action ${action.type} in state ${state.type}`);
  return state;
}

// The reducer
function reducer<A extends HttpResponse>(state: State<A>, action: Action<A>): State<A> {
  switch (action.type) {
    case 'start-loading':
      return { type: 'loading', url: action.url };
    case 'loading-success':
      if (state.type !== 'loading') return unexpectedAction(action, state);
      return { type: 'loaded', payload: action.payload, url: state.url };
    case 'loading-error':
      if (state.type !== 'loading') return unexpectedAction(action, state);
      return { type: 'error', error: action.error, url: state.url };
  }
}

export function useFetch<A extends HttpResponse>(url: string, options?: RequestInit): State<A> {
  const [state, dispatch] = useReducer(reducer as any, { type: 'begin' } as State<A>);

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    let cancelled = false;

    async function doFetch() {
      dispatch({ type: 'start-loading', url } as Action<A>);
      try {
        const resp = await fetch(url, { ...options, signal: controller.signal, credentials: 'include' });
        const payload = await resp.json();
        if (!cancelled) dispatch({ type: 'loading-success', payload, url } as Action<A>);
      } catch (error) {
        if (!cancelled) dispatch({ type: 'loading-error', error: error as Error } as Action<A>);
      }
    }

    doFetch();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [url, options]);

  return state;
}
