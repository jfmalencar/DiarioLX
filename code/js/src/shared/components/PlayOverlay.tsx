type Props = {
    placement?: 'center' | 'corner';
    size?: number;
    color?: string;
    icon?: React.ReactNode;
};

const PLACEMENT = {
    center: 'position-absolute top-50 start-50 translate-middle',
    corner: 'position-absolute top-0 end-0 m-2 m-md-3',
};

export const PlayOverlay = ({ placement = 'center', size = 56, icon }: Props) => (
    <div className={PLACEMENT[placement]} style={{ pointerEvents: 'none' }}>
        <div
            className='d-flex align-items-center justify-content-center rounded-circle'
            style={{ width: size, height: size }}
        >
            {icon}
        </div>
    </div>
);
