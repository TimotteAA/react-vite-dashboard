import { omit } from 'lodash';

import { deepMerge } from '@/utils';

import { config } from '@/config';

import { createPersistReduxStore } from '../store';

import { LayoutAction, LayoutState } from './types';
import { defaultLayoutConfig } from './_default.config';
import { layoutReducer } from './utils';

type PersistType = Omit<LayoutState, 'styles' | 'mobileSide' | 'menu'>;
export const LayoutStore = createPersistReduxStore<LayoutState, LayoutAction, PersistType>(
    layoutReducer,
    { ...deepMerge(defaultLayoutConfig, config().layout ?? {}), mobileSide: false },
    {
        name: 'layout-config',
        partialize: (state) => omit({ ...state }, ['styles', 'mobileSide', 'menu']),
    },
);
