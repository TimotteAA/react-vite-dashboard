import { FC, useCallback, useMemo } from 'react';
import { Link, matchRoutes, useLocation } from 'react-router-dom';
import { Breadcrumb as AntdBreadcrumb } from 'antd';
import { ItemType } from 'antd/es/breadcrumb/Breadcrumb';

import { useResponsiveMobileCheck } from '@/utils/hooks';
import { RouterStore } from '@/components/router/store';
import { factoryRoutes } from '@/components/router/utils';
import { RouteOption } from '@/components/router/types';
import { isNil } from 'lodash';

const Breadcrumb: FC = () => {
    const isMobile = useResponsiveMobileCheck();

    const location = useLocation();
    const { routes, basepath, hash } = RouterStore(
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

    const items: ItemType[] = useMemo(() => {
        return matches
            ?.slice(1)
            .map((item) => ({ key: item.pathname, title: (item?.route as any)?.meta.name }));
    }, [matches]);
    if (isMobile || isNil(matches)) return null;

    return <AntdBreadcrumb items={items as any} />;
};

export default Breadcrumb;
