import './App.css';
import { countStore } from './store';

function App() {
    const count = countStore((state) => state.count);
    const increment = countStore((state) => state.increment);
    return (
        <div>
            <h2>Test</h2>
            <h2>count: {count}</h2>
            <button onClick={() => increment(1)}>+1</button>
        </div>
    );
}

export default App;
