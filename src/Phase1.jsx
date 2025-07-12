import React, { useState } from 'react';

export default function Phase1({ onProceed }) {
  const [solId, setSolId]   = useState('');
  const [userName, setUserName] = useState('');

  const handleNext = () => {
    const sol = parseInt(solId, 10);
    if (sol >= 8701 && sol <= 8771 && userName.trim()) {

      /* ----------  LOG TO GOOGLE SHEET via SheetBest  ---------- */
      fetch('https://api.sheetbest.com/sheets/23082146-1b44-445c-98e3-548981f48ea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userName,       //  ⇦ matches column A header “name”
          solId: solId,         //  ⇦ matches column B header “solId”
          timestamp: new Date().toLocaleString('en-IN') // column C “timestamp”
        })
      })
      .catch(err => console.error('Sheet log error:', err));
      /* --------------------------------------------------------- */

      onProceed(solId, userName);
    } else {
      alert('Enter valid SOL ID (8701–8771) and Name');
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-800 mb-6">OTS NIVARAN</h1>

      <input
        className="border p-2 rounded mb-4 w-64"
        placeholder="Enter your name"
        value={userName}
        onChange={e => setUserName(e.target.value)}
      />

      <input
        className="border p-2 rounded mb-4 w-64"
        placeholder="Enter SOL ID (8701–8771)"
        value={solId}
        onChange={e => setSolId(e.target.value)}
        type="number"
      />

      <button
        onClick={handleNext}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Proceed
      </button>

      <div className="mt-6 text-red-1800 font-bold">© P.Raa</div>
    </div>
  );
}
