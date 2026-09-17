import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import ComposeEmail from './components/ComposeEmail';

export default function App() {
  const [view, setView] = useState<'dashboard' | 'compose'>('dashboard');

  return (
    <div>
      <nav style={{ background: '#1e293b', padding: '12px 24px', color: 'white', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '20px' }}>ReachInbox Scheduler</h2>
        <button onClick={() => setView('dashboard')} style={{ background: 'transparent', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}>Dashboard</button>
        <button onClick={() => setView('compose')} style={{ background: 'transparent', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}>Compose / Bulk Upload</button>
      </nav>
      {view === 'dashboard' ? <Dashboard /> : <ComposeEmail />}
    </div>
  );
}
