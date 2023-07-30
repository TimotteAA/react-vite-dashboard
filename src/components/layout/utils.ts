import { Reducer } from 'react';

import { produce } from 'immer';

import { deepMerge } from '@/utils';

import { LayoutAction, LayoutFixed, LayoutState } from './types';
import { LayoutActionType, LayoutMode } from './constants';

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
