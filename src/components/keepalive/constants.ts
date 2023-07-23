import { createContext, Dispatch } from 'react';

import { KeepAliveActionType } from './types';

/**
 * keepalive tabs的操作
 */
export enum KeepAliveAction {
    REMOVE = 'remove',
    REMOVE_MULTI = 'remove_multi',
    ADD = 'add',
    CLEAR = 'clear',
    ACTIVE = 'active',
    CHANGE = 'change',
    RESET = 'reset',
}

export const KeepAliveIdContext = createContext<string | null>(null);
export const KeepAliveDispatchContext = createContext<Dispatch<KeepAliveAction | null> | null>(
    null,
);
