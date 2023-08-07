import 'dayjs/locale/zh-cn';

import { FC, useEffect, useState } from 'react';

import { MappingAlgorithm, ThemeConfig } from 'antd/es/config-provider/context';

import { ConfigProvider, theme, App as AntdApp } from 'antd';

import { produce } from 'immer';

import { StyleProvider } from '@ant-design/cssinjs';

import Router from './components/router/router';
import { Fetcher } from './components/fetcher/provider';
import { useTheme, useThemeListener } from './components/theme/hooks';
import { useLayoutTheme } from './components/layout/hooks';
import { LayoutStore } from './components/layout/store';
import { customDarkAlgorithm } from './utils/customDark';
// import {  }

const App = () => {
    useThemeListener();
    const { mode, compact } = useTheme();
    const [algorithm, setAlgorithm] = useState<MappingAlgorithm[]>([theme.defaultAlgorithm]);
    const [antdTheme, setAntdTheme] = useState<ThemeConfig>({
        components: {
            Tabs: {
                cardPaddingSM: '0.3rem',
                horizontalItemGutter: 50,
                cardGutter: 10,
                titleFontSizeSM: 12,
                horizontalMargin: '0',
            },
        },
    });

    useEffect(() => {
        if (!compact) {
            // setAlgorithm(mode === 'light' ? [theme.defaultAlgorithm] : [theme.darkAlgorithm]);
            setAlgorithm(mode === 'light' ? [theme.defaultAlgorithm] : [customDarkAlgorithm]);
        } else {
            setAlgorithm(
                mode === 'light'
                    ? [theme.defaultAlgorithm, theme.compactAlgorithm]
                    : [customDarkAlgorithm, theme.compactAlgorithm],
            );
        }
        if (mode === 'dark') {
            setAntdTheme((state) =>
                produce(state, (draft) => {
                    draft.token = {
                        colorText: 'rgb(175 166 153 / 85%)',
                    };
                    draft.components!.Tabs!.itemSelectedColor = 'rgb(208 208 208 / 88%)';
                }),
            );
        } else {
            setAntdTheme((state) =>
                produce(state, (draft) => {
                    draft.token = {
                        colorText: 'rgb(60 60 60 /88%)',
                    };
                    draft.components!.Tabs!.itemSelectedColor = 'rgb(80 80 80 /88%)';
                }),
            );
        }
    }, [mode, compact]);
    return (
        <ConfigProvider
            theme={{
                algorithm,
                ...antdTheme,
                // token: {
                //     colorPrimary: '#1677ff',
                // },
            }}
        >
            {/* 取消 :where定义的Antd样式，并解决与tailwind的样式冲突问题 */}
            <StyleProvider hashPriority="high">
                {/* <ThemeProvider appearance={'light'}>
                    <AntdApp>
                        <Fetcher>
                            <Router />
                        </Fetcher>
                    </AntdApp>
                </ThemeProvider> */}
                <AntdApp>
                    <Fetcher>
                        <Router />
                    </Fetcher>
                </AntdApp>
            </StyleProvider>
        </ConfigProvider>
    );
};

export default App;
