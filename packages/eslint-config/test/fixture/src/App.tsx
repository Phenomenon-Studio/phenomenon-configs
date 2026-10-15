import { useEffect, useState } from 'react';

export function App() {
    const [count, setCount] = useState(0);

    useEffect(function logCount() {
        document.title = String(count);
    });

    return (
        <button
            type="button"
            onClick={() => {
                return setCount(count + 1);
            }}
        >
            {count}
        </button>
    );
}
