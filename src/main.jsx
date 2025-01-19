import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { GameProvider } from './context/GameContext.jsx';

function Main() {
    return <GameProvider>
        <App />
    </GameProvider>
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Main />
    </React.StrictMode>,
)
