import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom';

export const ErrorPage = () => {
    const error = useRouteError();

    let title = 'Something went wrong';
    let message =
        'An unexpected error occurred while loading this page.';

    if (isRouteErrorResponse(error)) {
        switch (error.status) {
            case 404:
                title = 'Page not found';
                message =
                    'The page you are looking for does not exist.';
                break;

            case 403:
                title = 'Access denied';
                message =
                    'You do not have permission to access this page.';
                break;

            case 500:
                title = 'Internal server error';
                message =
                    'Something failed on the server. Please try again later.';
                break;
        }
    }

    return (
        <div className='container min-vh-100 d-flex align-items-center justify-content-center'>
            <div
                className='card border-0 shadow-sm p-4 text-center'
                style={{
                    maxWidth: 520,
                    width: '100%',
                    borderRadius: 16,
                }}
            >
                <div
                    className='mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle bg-light'
                    style={{
                        width: 72,
                        height: 72,
                        fontSize: 32,
                    }}
                >
                    ⚠️
                </div>

                <h1 className='h3 fw-semibold mb-3'>
                    {title}
                </h1>

                <p className='text-secondary mb-4'>
                    {message}
                </p>

                <div className='d-flex justify-content-center gap-2'>
                    <button
                        type='button'
                        className='btn btn-dark px-4'
                        onClick={() => window.location.reload()}
                    >
                        Reload
                    </button>

                    <Link
                        to='/'
                        className='btn btn-light border px-4'
                    >
                        Go home
                    </Link>
                </div>

                {import.meta.env.DEV && error instanceof Error && (
                    <div className='mt-4 text-start'>
                        <div className='small text-secondary mb-2'>
                            Development error
                        </div>

                        <pre
                            className='bg-light p-3 rounded small overflow-auto'
                            style={{
                                maxHeight: 200,
                            }}
                        >
                            {error.message}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};