import { DropDown, MenuProps, Tabs, TabsProps, theme as AntdTheme } from 'antd';

import { memo, useCallback, useMemo, useState } from 'react';

import { useDeepCompareEffect } from 'react-use';

import { useActived, useKeepAliveDispatch, useKeepAlives } from '@/components/keepalive/hooks';

import { useRouterStore } from '@/components/router/hooks';

import { useDeepCompareUpdateEffect } from '@/utils/hooks';

import { RouteOption } from '@/components/router/types';

import Icon from '@/components/icon/Icon';

import IconRefresh from '~icons/ion/md-refresh';
import IconArrowDown from '~icons/ion/chevron-down-sharp';
import IconClose from '~icons/ion/close-outline';
import IconLeft from '~icons/mdi/arrow-collapse-left';
import IconRight from '~icons/mdi/arrow-collapse-right';
import IconExpend from '~icons/mdi/arrow-expand-horizontal';
import IconClear from '~icons/ant-design/minus-outlined';
