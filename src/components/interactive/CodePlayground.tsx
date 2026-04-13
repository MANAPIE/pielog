import { useState } from 'react';

export default function CodePlayground() {
    const [code, setCode] = useState('console.log("Hello, World!");');
    const [output, setOutput] = useState('');

    const handleRun = () => {
        try {
            const logs: string[] = [];
            const mockConsole = {
                log: (...args: unknown[]) => logs.push(args.join(' ')),
            };
            new Function('console', code)(mockConsole);
            setOutput(logs.join('\n'));
        } catch (e) {
            setOutput(`Error: ${(e as Error).message}`);
        }
    };

    return (
        <div className="code-playground">
            <h3>Code Playground</h3>
            <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
            />
            <button onClick={handleRun}>실행</button>
            {output && <div className="output">{output}</div>}
        </div>
    );
}
