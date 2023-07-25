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

/**
 * 获取带全路径的路由
 * @param routes 原始路由数组
 * @param parentPath 父级路径，用于递归调用
 */
export const getFullPathRoutes = (routes: RouteOption[], parentPath?: string): RouteOption[] =>
    routes
        .map((route) => {
            // 如果当前路由被标记为 devide，则跳过处理，返回空数组
            if (route.divide) return [];

            // 深复制当前路由对象，为避免修改原对象
            const item: RouteOption = { ...route };

            // 初始化父路径和子路径前缀
            const pathPrefix: { parent?: string; child?: string } = {
                parent: trim(parentPath ?? '', '/').length
                    ? `/${trim(parentPath ?? '', '/')}/`
                    : '/',
                child: trim(parentPath ?? '', '/').length ? `/${trim(parentPath ?? '', '/')}` : '/',
            };

            // 如果当前路由被标记为 devide 或 index，则剔除掉 children 和 path 属性，并返回
            if (route.divide || route.index) return [omit(route, ['children', 'path'])];

            // 判断路由路径是否是 URL，如果是，则直接赋值给 item.path
            if (isUrl(route.path)) {
                item.path = route.path;
            } else {
                // 如果不是 URL，拼接父路径和子路径生成全路径
                pathPrefix.child = route.path?.length
                    ? `${pathPrefix.parent}${trim(route.path, '/')}`
                    : pathPrefix.child;
                item.path = route.onlyGroup ? undefined : pathPrefix.child;
            }

            // 处理子路由，递归调用当前函数
            item.children = route.children?.length
                ? getFullPathRoutes(route.children, pathPrefix.child)
                : undefined;

            // 如果当前路由被标记为 onlyGroup，并且没有子路由，则将其 children 属性设置为 []
            if (route.onlyGroup) item.children = item.children?.length ? item.children : [];

            // 返回处理过的路由对象
            return [item];
        })
        // 使用 reduce 将 map 返回的二维数组合并成一维数组
        .reduce((o, n) => [...o, ...n], []);
