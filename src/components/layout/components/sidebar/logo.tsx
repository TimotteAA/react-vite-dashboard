import { CSSProperties, FC, useMemo } from 'react';
import clsx from 'clsx';

import logo from '@/assets/logo.svg';

import { useLayout } from '../../hooks';

import $styles from './logo.module.css';

export const Logo: FC<{ style?: CSSProperties }> = ({ style }) => {
    const { collapsed } = useLayout();

    const classes = useMemo(
        () => clsx($styles.container, { logoCollapsed: collapsed }),
        [collapsed],
    );

    return (
        <div style={style ?? {}} className={classes}>
            <img src={logo} alt="logo" style={{ width: '64px', height: '64px' }} />
            <span>Admin Pro</span>
        </div>
    );
};
