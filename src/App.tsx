import { Button, ConfigProvider, theme } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';

import '@/styles/index.css';

import { countStore } from './store';

const App = () => {
    const count = countStore((state) => state.count);
    const increment = countStore((state) => state.increment);
    return (
        <ConfigProvider
            theme={{
                algorithm: theme.defaultAlgorithm,
                token: {
                    colorPrimary: '#1677ff',
                },
            }}
        >
            {/* 取消 :where定义的Antd样式，并解决与tailwind的样式冲突问题 */}
            <StyleProvider hashPriority="high">
                <div>
                    <h2>Test</h2>
                    <h2>count: {count}</h2>
                    <button onClick={() => increment(1)}>+1</button>
                </div>
                <Button className="tw-font-standard" type="primary">
                    tw测试
                </Button>
            </StyleProvider>
        </ConfigProvider>
    );
};

export default App;
