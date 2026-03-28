import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router';

type TabProps = {
    id: string;
    label: string;
    badge?: number;
    children: React.ReactNode;
};

type TabsProps = {
    toolbar?: React.ReactNode;
    children: React.ReactNode;
};

export function Tab({ children }: TabProps) {
    return children
}

export function Tabs({ toolbar, children }: TabsProps) {
    const [searchParams, setSearchParams] = useSearchParams();

    const tabs = useMemo(
        () =>
            React.Children.toArray(children)
                .filter(React.isValidElement)
                .map((child) => child as React.ReactElement<TabProps>),
        [children]
    );

    const paramTab = searchParams.get('tab');
    const activeTab = tabs.some((tab) => tab.props.id === paramTab) ? paramTab! : tabs[0].props.id;

    const handleChangeTab = (id: string) => {
        const nextParams = new URLSearchParams();
        nextParams.set('tab', id);
        setSearchParams(nextParams, { replace: true });
    }

    const activeContent = tabs.find((tab) => tab.props.id === activeTab) || tabs[0];

    return (
        <>
            <div className='d-flex flex-wrap gap-4 align-items-center justify-content-between border-bottom border-1 border-dark mb-3'>
                <div>
                    {tabs.map((tab) => {
                        const isActive = tab.props.id === activeTab;
                        return (
                            <button
                                key={tab.props.id}
                                type='button'
                                className={`btn p-0 border-0 bg-transparent rounded-0 position-relative text-dark me-4 border-bottom border-4` + (isActive ? ' pb-2 border-dark' : ' pb-2 border-light')}
                                onClick={() => handleChangeTab(tab.props.id)}
                                style={{ fontSize: '1.1rem', fontWeight: isActive ? 600 : 400 }}
                            >
                                {tab.props.label}
                                {tab.props.badge !== undefined && tab.props.badge > 0 && (
                                    <span
                                        className='position-absolute rounded-circle bg-warning'
                                        style={{ width: 9, height: 9, top: 3, right: -12 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
                {toolbar ?
                    <div className='col-lg-4'>
                        <div className='d-flex justify-content-lg-end align-items-center gap-3'>
                            {toolbar}
                        </div>
                    </div>
                    : null}
            </div>
            <div className='mt-3'>
                {activeContent?.props.children}
            </div>
        </>
    );
}
