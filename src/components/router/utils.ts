import { Suspense } from 'react';

import { isNil, omit, trim } from 'lodash';

import { DataRouteObject } from 'react-router';

import { isUrl } from '@/utils';

import { IAuth } from '../auth/types';

import { RouteOption, RouterConfig } from './types';

import { getAsyncImport } from './views';
import { RouterStore } from './store';

/**
 * 根据权限过滤路由表
 * @param routes 路由表
 * @param auth 权限
 * @returns
 */
export const getAuthRoutes = (routes: RouteOption[], auth: IAuth | null): RouteOption[] =>
    routes
        .map((route) => {
            if (route.auth !== false && route?.auth?.enabled !== false) {
                // 当前没权限，返回[]
                if (isNil(auth)) return [];
                // 路由配置需要进行权限验证
                if (typeof route.auth !== 'boolean' && route.auth?.permissions?.length) {
                    // 当前路由所需权限没有完全包括
                    if (!route.auth.permissions.every((p) => auth.permissions.includes(p))) {
                        return [];
                    }
                    if (!route.children?.length) return [route];
                    // 递归子路由表
                    return [{ ...route, children: getAuthRoutes(route.children, auth) }];
                }
            }
            // 路由没开启auth
            return [route];
        })
        .reduce((o, n) => [...o, ...n], []);

/**
 * 获得路由表
 * @param routes
 * @returns
 */
export const getRoutes = (routes: RouteOption[]): RouteOption[] =>
    routes
        .map((route) => {
            // 路由分割线
            if (route.divide) return [];
            // 非首页、过滤外链
            if ((!route.index && isNil(route.path)) || isUrl(route.path)) {
                return route.children?.length ? getRoutes(route.children) : [];
            }
            return [route];
        })
        .reduce((o, n) => [...o, ...n], []);

/**
 * 获得所有的菜单项
 * @param routes
 * @returns
 */
export const getMenus = (routes: RouteOption[]): RouteOption[] =>
    routes
        .map((route) => {
            if (isNil(route.menu) && !route.menu) {
                return route.children?.length ? getMenus(route.children) : [];
            }
            return [
                {
                    ...route,
                    children: route.children?.length ? getMenus(route.children) : undefined,
                },
            ];
        })
        .reduce((o, n) => [...o, ...n], []);

/**
 * 获得扁平化的路由表
 * @param routes
 * @returns
 */
export const getFlatRoutes = (routes: RouteOption[]): RouteOption[] =>
    routes
        .map((route) => {
            if (route.divide) return [];
            return route.children?.length ? [route, ...getFlatRoutes(route.children)] : [route];
        })
        .reduce((o, n) => [...o, ...n], []);
