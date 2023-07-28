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
 * 最外层KeepAlive组件
 * @param param0
 */
const KeepAlive: FC<{ children: ReactNode }> = ({ children }) => {};
