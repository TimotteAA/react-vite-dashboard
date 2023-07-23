import { deepMerge } from '@/utils';
import { createStore } from '../store';
import { RouterState } from './types';
import { getDefaultRouterConfig } from './_default.config';
import { config } from '@/config';

export const RouterStore = createStore<RouterState>(() => ({
    ready: false,
    routes: [],
    menus: [],
    flat: [],
    config: deepMerge(getDefaultRouterConfig(), config().router ?? {}, 'replace'),
}));
