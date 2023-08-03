import { Layout, Space, theme as AntdTheme } from 'antd';

import { CSSProperties, useCallback, useMemo } from 'react';

import clsx from 'clsx';

import Icon from '@/components/icon/Icon';

import { useResponsive, useResponsiveMobileCheck } from '@/utils/hooks';

import Theme from '@/components/theme';

import { useDrawer, useDrawerChange } from '../drawer/hooks';

import { Logo } from '../sidebar/logo';

import { useLayout, useLayoutAction, useLayoutTheme } from '../../hooks';
import { SideMenu } from '../menu';

const Setting = () => {
    const drawer = useDrawer();
    const changeDrawerVisible = useDrawerChange();
    const toggleDrawer = useCallback(() => changeDrawerVisible(!drawer), [drawer]);
    return (
        <Icon name="iconify:carbon:settings" className="tw-cursor-pointer" onClick={toggleDrawer} />
    );
};

export const LayoutHeader = () => {
    const { Header } = Layout;
    const { isNotebook } = useResponsive();
    const isMobile = useResponsiveMobileCheck();
    const { mode, collapsed, menu, styles: layoutStyles } = useLayout();
    const theme = useLayoutTheme();
    const { toggleCollapse, toggleMobileSide } = useLayoutAction();
    const sideControl = useCallback(() => {
        isMobile ? toggleMobileSide() : toggleCollapse;
    }, [isMobile, isNotebook]);
    const {
        token: { colorBgContainer },
    } = AntdTheme.useToken();
    // header的styles与类
    const styles = useMemo<CSSProperties>(
        () => ({
            height: layoutStyles.headerHeight,
            lineHeight: layoutStyles.headerHeight,
            background: colorBgContainer,
        }),
        [theme.header, layoutStyles],
    );
    const classes = useMemo(() => {
        if (theme.header === 'dark') return '!tw-text-[rgba(255, 255, 25, 0.65)]';
        return 'tw-bg-white';
    }, [theme.header]);
    return (
        <Header style={styles} className={clsx(`tw-flex tw-content-between !tw-px-2 ${classes}`)}>
            <Space>
                {/* 如果当前设备非移动端且布局模式不为"side"，则显示logo */}
                {!isMobile && mode !== 'side' ? (
                    <div className="flex-none">
                        <Logo />
                    </div>
                ) : null}
                {/* 如果当前布局模式非"top"或"embed"或当前设备为移动端，显示折叠/展开按钮 */}
                {((mode !== 'top' && mode !== 'embed') || isMobile) && (
                    <Icon
                        name={
                            collapsed
                                ? 'iconify:ant-design:menu-unfold-outlined'
                                : 'iconify:ant-design:menu-fold-outline'
                        }
                        className="tw-cursor-pointer"
                        onClick={sideControl}
                    />
                )}
            </Space>
            <div className="tw-flex-auto">
                {/* top模式下的导航菜单 */}
                {mode === 'top' ? (
                    <SideMenu mode="horizontal" theme={theme.header} menu={menu} />
                ) : null}
            </div>
            <Space className="tw-flex-none">
                <Theme />
                {/* 设定抽屉 */}
                <Setting />
            </Space>
        </Header>
    );
};
