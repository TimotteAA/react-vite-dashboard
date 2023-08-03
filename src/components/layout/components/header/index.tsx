import { Layout, Space, theme as AntdTheme } from 'antd';

import { CSSProperties, useCallback, useMemo } from 'react';

import clsx from 'clsx';

import Icon from '@/components/icon/Icon';

import { useResponsive, useResponsiveMobileCheck } from '@/utils/hooks';

import Theme from '@/components/theme';

import { useDrawer, useDrawerChange } from '../drawer/hooks';

import { useLayout, useLayoutAction, useLayoutTheme } from '../../hooks';
// import {  }
