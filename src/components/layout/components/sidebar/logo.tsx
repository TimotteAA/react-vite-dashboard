import { CSSProperties, FC, useCallback, useMemo } from 'react';
import clsx from 'clsx';

import { KeepAliveStore } from '@/components/keepalive/store';
import { useNavigator } from '@/components/router/hooks';

import logo from '@/assets/logo.svg';

import { useLayout } from '../../hooks';

import $styles from './logo.module.css';

export const Logo: FC<{ style?: CSSProperties }> = ({ style }) => {
    const { collapsed } = useLayout();
    const path = KeepAliveStore(useCallback((state) => state.path, []));
    const navigate = useNavigator();

    const goHome = useCallback(() => navigate(path), [path]);

    const classes = useMemo(
        () => clsx($styles.container, { logoCollapsed: collapsed }),
        [collapsed],
    );

    return (
        <div style={style ?? {}} className={classes} onClick={goHome}>
            <img src={logo} alt="logo" style={{ width: '64px', height: '64px' }} />
            <span>Admin Pro</span>
        </div>
    );
};
