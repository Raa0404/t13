import React, { useState } from 'react';
import Phase1 from './Phase1';
import Phase2 from './Phase2';
import Phase3 from './Phase3';

function App() {
  const [phase, setPhase] = useState(1);
  const [solId, setSolId] = useState('');
  const [userName, setUserName] = useState('');
  const [cifData, setCifData] = useState([]);

  return (
    <>
      {phase === 1 && (
        <Phase1
          onProceed={(sol, name) => {
            setSolId(sol);
            setUserName(name);
            setPhase(2);
          }}
        />
      )}

      {phase === 2 && (
        <Phase2
          solId={solId}
          userName={userName}
          onBack={() => setPhase(1)}
          onProceed={(accounts) => {
            setCifData(accounts);
            setPhase(3);
          }}
        />
      )}

      {phase === 3 && (
        <Phase3
          accountData={cifData}
          onBack={() => setPhase(2)}
        />
      )}
    </>
  );
}

export default App;