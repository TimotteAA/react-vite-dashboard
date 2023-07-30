import { ConfigProvider } from 'antd';

import Icon from './components/icon/Icon';
import './App.css';
import { countStore } from './store';

const App = () => {
    const count = countStore((state) => state.count);
    const increment = countStore((state) => state.increment);
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#1677ff',
                },
            }}
        >
            <div>
                <h2>Test</h2>
                <h2>count: {count}</h2>
                <button onClick={() => increment(1)}>+1</button>
            </div>
        </ConfigProvider>
    );
};

export default App;
