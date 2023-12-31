import { CSSProperties, Reducer } from 'react';

import { produce } from 'immer';

import { deepMerge, isUrl } from '@/utils';

import {
    LayoutAction,
    LayoutFixed,
    LayoutMenuState,
    LayoutSplitMenuState,
    LayoutState,
    LayoutStylesConfig,
} from './types';
import { LayoutActionType, LayoutMode } from './constants';
import clsx from 'clsx';
import { kebabCase } from 'lodash';
import { RouteOption } from '../router/types';
import { matchPath, Location } from 'react-router';

export const layoutReducer: Reducer<LayoutState, LayoutAction> = produce((state, action) => {
    switch (action.type) {
        case LayoutActionType.CHANGE_STYLES: {
            state.styles = { ...state.styles, ...action.styles };
            break;
        }
        case LayoutActionType.CHANGE_MODE: {
            state.mode = action.value;
            break;
        }
        case LayoutActionType.CHANGE_FIXED: {
            const newFixed = { [action.key]: action.value };
            state.fixed = getLayoutFixed(state.mode, { ...state.fixed, ...newFixed }, newFixed);
            break;
        }
        case LayoutActionType.CHANGE_COLLAPSE: {
            state.collapsed = action.value;
            break;
        }
        case LayoutActionType.TOGGLE_COLLAPSE: {
            state.collapsed = !state.collapsed;
            break;
        }
        case LayoutActionType.CHANGE_MOBILE_SIDE: {
            state.mobileSide = action.value;
            break;
        }
        case LayoutActionType.TOGGLE_MOBILE_SIDE: {
            state.mobileSide = !state.mobileSide;
            break;
        }
        case LayoutActionType.CHANGE_THEME: {
            state.theme = { ...state.theme, ...action.value };
            break;
        }
        case LayoutActionType.CHANGE_MENU: {
            state.menu = deepMerge(state.menu, action.value, 'replace');
            break;
        }
        default: {
            break;
        }
    }
});

export const getLayoutFixed = (
    mode: `${LayoutMode}`,
    fixed: LayoutFixed,
    newFixed: Partial<LayoutFixed>,
) => {
    // 当前sidebar、header的fixed状态
    const current = { ...fixed, ...newFixed };
    if (mode === 'side') {
        // 侧边栏：header固定，sidebar也固定，保持体验一致
        // 反之侧边栏不固定，header也不固定
        // 顶栏用户体验更重要
        if (newFixed.header) current.sidebar = true;
        if (newFixed.sidebar !== undefined && !newFixed.sidebar) current.header = false;
    } else if (mode === 'content') {
        // 内容模式，导航都在侧边栏里
        // 侧边栏固定，顶栏也固定
        // 顶栏不固定，为了布局一致性，sidebar也不固定
        if (newFixed.sidebar) current.header = true;
        if (newFixed.header !== undefined && !newFixed.header) current.sidebar = false;
    } else if (mode === 'embed') {
        // 此种模式下三者联动
        // header固定，都固定
        if (newFixed.header) {
            current.sidebar = true;
            current.embed = true;
        }
        // 侧边栏不固定，三者都不固定
        if (newFixed.sidebar !== undefined && !newFixed.sidebar) {
            current.embed = false;
            current.header = false;
        }
        // 子侧边栏固定，侧边栏也得固定
        if (newFixed.embed) current.sidebar = true;
        if (newFixed.embed !== undefined && !newFixed.embed) current.embed = false;
    }
    return current;
};

/**
 * 获得布局中Sidebar、Header、Embed的css类
 * @param fixed 固定状态
 * @param mode 模式
 * @param style css module类
 * @param isMobile 是否处于移动端
 * @returns
 */
export const getLayoutClasses = (
    fixed: LayoutFixed,
    mode: `${LayoutMode}`,
    style: CSSModuleClasses,
    isMobile: boolean,
) => {
    const items = ['!tw-min-h-screen'];
    if (fixed.sidebar || fixed.header || fixed.sidebar) {
        items.push(style.layoutFixed);
    }
    switch (mode) {
        case 'side': {
            if (fixed.header) items.push(style.layoutSideHeaderFixed);
            else if (fixed.sidebar) items.push(style.layoutSideSidebarFixed);
            break;
        }
        case 'content': {
            if (fixed.sidebar) items.push(style.layoutContentSidebarFixed);
            else if (fixed.header) items.push(style.layoutContentHeaderFixed);
            break;
        }
        case 'top': {
            if (fixed.header) items.push(style.layoutTopHeaderFixed);
            break;
        }
        case 'embed': {
            items.push(style.layoutEmbed);
            if (fixed.header) items.push(style.layoutEmbedHeaderFixed);
            else if (fixed.embed) items.push(style.layoutEmbedEmbedFixed);
            else if (fixed.sidebar) items.push(style.layoutEmbedSiderbarFixed);
            break;
        }
        default:
            break;
    }
    if (isMobile) items.push(style.mobileLayout);
    return clsx(items);
};

/**
 * 将store中设定的css变量转换成css style对象
 * @param styles
 * @returns
 */
export const getLayoutCssStyle = (styles: Required<LayoutStylesConfig>): CSSProperties =>
    Object.fromEntries(
        Object.entries(styles).map(([key, value]) => [
            `--${kebabCase(key)}`,
            typeof value === 'number' ? `${value}px` : value,
        ]),
    );

/**
 * 获得菜单数据
 * @param menus
 * @param location
 * @param layoutMode
 * @param isMobile
 * @returns
 */
export const getMenuData = (
    menus: RouteOption[],
    location: Location,
    layoutMode: `${LayoutMode}`,
    isMobile: boolean,
): LayoutMenuState => {
    const split: LayoutSplitMenuState = {
        data: [],
        selects: [],
    };
    let data = menus;
    // 获取选中的菜单id
    let selects = diffKeys(getSelectMenus(data, location));
    // 获取打开的菜单id
    let opens = diffKeys(getOpenMenus(data, selects, []));
    // 获取顶级菜单中拥有子菜单的菜单ID
    let rootSubKeys = diffKeys(data.filter((menu) => menu.children));
    // 嵌入模式仅能选择一个顶级菜单，根据顶级菜单计算展开的项
    if (layoutMode === 'embed' && !isMobile) {
        // data存储顶级菜单
        split.data = menus.map((item) => {
            const { children, ...meta } = item;
            return meta;
        });
        // 选中的顶级菜单（仅找了树的第一层）
        const select = data.find((item) => selects.includes(item.id));
        // 没有找到选中的顶级菜单项，或者选中的顶级菜单项没有子菜单
        if (!select || !select.children) {
            opens = [];
            rootSubKeys = [];
            data = [];
        }
        if (select) {
            // embed的模式下仅有一个被选中的顶级菜单
            split.selects = [select.id];
            if (select.children) {
                // 根据顶级菜单重新计算
                data = select.children;
                selects = diffKeys(getSelectMenus(data, location));
                selects = diffKeys(getOpenMenus(data, selects, []));
                rootSubKeys = diffKeys(data.filter((menu) => menu.children));
            }
        }
    }
    return {
        data,
        opens,
        selects,
        rootSubKeys,
        split,
    };
};

const diffKeys = (menus: RouteOption[]) => menus.map((menu) => menu.id);

/**
 * 逐层提取符合当前路径的menu
 * @param menus
 * @param location
 * @returns
 */
const getSelectMenus = (menus: RouteOption[], location: Location): RouteOption[] =>
    menus
        .map((menu) => {
            if (menu.children) return getSelectMenus(menu.children, location);
            if (menu.path && !isUrl(menu.path) && matchPath(menu.path, location.pathname)) {
                return [menu];
            }
            return [];
        })
        .reduce((o, n) => [...o, ...n], []);

/**
 * 从选中的menu项中，获得其打开的父菜单
 *
 * @param menus
 * @param selects
 * @param parents
 * @returns
 */
const getOpenMenus = (
    menus: RouteOption[],
    selects: string[],
    parents: RouteOption[],
): RouteOption[] => {
    return menus
        .map((menu) => {
            // 被选中
            if (!menu.children) return selects.includes(menu.id) ? [...parents] : [];
            return getOpenMenus(menu.children, selects, [...parents, menu]);
        })
        .reduce((o, n) => [...o, ...n], []);
};
