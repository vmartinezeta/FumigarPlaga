import React from 'react';
import ReactDOM from 'react-dom/client';
import { GameProvider } from './context/GameContext.jsx';
import App from './App.jsx';

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
