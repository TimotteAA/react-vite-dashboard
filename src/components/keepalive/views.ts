import ReactDOM from 'react-dom';
import { isNil, filter, map, findIndex } from 'lodash';
import { useUpdate, useUpdateEffect } from 'ahooks';
import {
    ReactNode,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    forwardRef,
    useImperativeHandle,
} from 'react';

import { matchRoutes, useLocation, useOutlet } from 'react-router-dom';

import { useUnmount } from 'react-use';

import { deepMerge } from '@/utils';

import { useNavigator } from '../router/hooks';

import { RouterStore } from '../router/store';

import { factoryRoutes } from '../router/utils';

import { AlivePageProps } from './types';
import { KeepAliveAction } from './constants';
import { KeepAliveDispatchContext, KeepAliveIdContext } from './constants';
import { KeepAliveStore } from './store';

interface ParentRef {
    refresh: (resetId: string) => void;
}

/**
 * 监听location变化，从routes计算出location对应的路由id
 * @param param0 
 * @returns 
 */
const Provider: FC<{ children: ReactNode }> = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigator();
    const { path, reset } = KeepAliveStore((state) => ({ ...state }))
    // 新的tab是否是根路由
    const [isRoot, setIsRoot] = useState(true);
    const [resetId, setResetId] = useState<string | null>(null);
    const ref = useRef<ParentRef | null>(null);
    // 监听location的变化，从routes计算出当前route
    const matchRouteId = useMemo(() => {
        const { config, routes, flat } = RouterStore.getState();
        const matches = matchRoutes(factoryRoutes(routes), location, config.basepath)
        if (isNil(matches) || matches.length < 1) return null;
        // 返回的是所有匹配的route，最后一个是当前的
        const match = matches[matches.length - 1];
        // 找到对应的item
        const item = flat.find(r => r.id === (match.route as any).id);
        if (!item) return null;
        return item.id;
    }, [location])
    // 渲染缓存和判断404
    useEffect(() => {
        const { flat } = RouterStore.getState();
        const matchItem = flat.find(item => item.id === matchRouteId);
        // 检查是否是根路径
        const checkroot = !!(
            matchItem && 
            matchItem.path === path && 
            // 常见的跟路径设定：
            // 1. path是根路径，但没有index
            // 2. index为true，没有子路由（和别的‘首页’区别在于有无页面）
            (!matchItem.index || (matchItem.index && isNil(matchItem.page)))
        );
        setIsRoot(checkroot);
        if (checkroot) return;
        if (matchRouteId) {
            KeepAliveStore.dispatch({ type: KeepAliveAction.ADD, payload: {id: matchRouteId} });
            KeepAliveStore.dispatch({ type: KeepAliveAction.ACTIVE, id: matchRouteId })
        } else if (location.pathname !== path) {
            // navigate({pathname: notFound});
        }
    }, [matchRouteId, location, navigate]);
    // 如果存在要reset的组件，调用refresh方法
    useUpdateEffect(() => {
        setResetId(reset);
        if (isNil(reset)) return;
        ref.current && ref.current.refresh(reset);
        KeepAliveStore.dispatch({
            type: KeepAliveAction.RESET,
            payload: {
                id: null
            }
        })
    }, [reset]);
    console.log()
    return isRoot || isNil(matchRouteId) ? (
        <>{children}</>
    ) : (
        <KeepAliveDispatchContext.Provider value={KeepAliveStore.dispatch}>
            <KeepContainer active={matchRouteId} reset={resetId} ref={ref} />
        </KeepAliveDispatchContext.Provider>
    )
}

/**
 * 最外层KeepAlive组件
 * 主要负责初始化KeepAliveStore：根据router得到根路径、404页面等
 * 监听lives，设置为include，在卸载前保存
 * 
 * @param param0
 */
const KeepAlive: FC<{ children: ReactNode }> = ({ children }) => {
    // 根据router配置设定keepalive的跟路径、notFound页面
    const config = RouterStore((state) => state.config);
    const setuped = KeepAliveStore((state) => state.setuped);
    const listenLives = KeepAliveStore.subscribe(
        (state) => state.lives,
        (lives) => {
            KeepAliveStore.setState((state) => {
                state.inlude = lives;
            });
        },
    );
    useEffect(() => {
        if (!setuped) {
            KeepAliveStore.setState(
                (state) =>
                    deepMerge(
                        state,
                        {
                            path: config.basepath,
                            notFound: config.notFound,
                            setuped: true,
                        },
                        'replace',
                    ),
                true,
            );
        }
    }, [config.basepath, config.notFound, setuped]);
    // 卸载前取消订阅
    useUnmount(() => {
        listenLives();
    })
    return <Provider>{children}</Provider>
};
export default KeepAlive;
