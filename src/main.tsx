import React from 'react';
import ReactDOM from 'react-dom/client';

// A simple App component for now, you can replace this with your actual app structure
function App() {
    return (
        <div>
            <h1>Welcome to the Stock App!</h1>
            <p>This is a pure front-end application.</p>
            {/* You will need to set up routing and render your components here */}
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);