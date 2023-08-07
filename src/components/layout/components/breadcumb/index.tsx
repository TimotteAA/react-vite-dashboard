import { FC, useCallback, useMemo } from 'react';
import { Link, matchRoutes, useLocation } from 'react-router-dom';
import { isNil } from 'lodash';
import { Breadcrumb as AntdBreadcrumb, theme as AntdTheme } from 'antd';
import { ItemType } from 'antd/es/breadcrumb/Breadcrumb';
import clsx from 'clsx';

import { useResponsiveMobileCheck } from '@/utils/hooks';
import { RouterStore } from '@/components/router/store';
import { factoryRoutes } from '@/components/router/utils';
import { MenuRouteMeta, RouteOption } from '@/components/router/types';
import Icon from '@/components/icon/Icon';

import $styles from './index.module.css';

const Breadcrumb: FC = () => {
    const isMobile = useResponsiveMobileCheck();

    const location = useLocation();
    const { routes, basepath } = RouterStore(
        useCallback(
            (state) => ({
                routes: state.routes,
                basepath: state.config.basepath,
                hash: state.config.hash,
            }),
            [],
        ),
    );
    const matches = matchRoutes(factoryRoutes(routes), location, basepath)!;

    const {
        token: { colorPrimaryText },
    } = AntdTheme.useToken();

    const items: ItemType[] = useMemo(() => {
        return matches?.slice(1).map((item) => {
            const route = item.route as RouteOption;
            const { name, icon } = route?.meta as MenuRouteMeta;
            const classes = clsx(
                { breadActive: item.pathname === location.pathname },
                $styles.link,
            );

            return {
                title: (
                    <Link
                        to={item.pathname}
                        style={
                            {
                                '--colorPrimaryText': colorPrimaryText,
                            } as Record<string, any>
                        }
                        className={classes}
                    >
                        {icon ? (
                            typeof icon === 'string' ? (
                                <Icon name={icon} />
                            ) : (
                                <Icon component={icon} />
                            )
                        ) : null}
                        {name}
                    </Link>
                ),
                key: item.pathname,
            };
        });
    }, [matches]);
    if (isMobile || isNil(matches)) return null;

    return <AntdBreadcrumb items={items as any} />;
};

export default Breadcrumb;
