import React, { useMemo } from 'react';

export default function Phase3({ accountData = [], onBack }) {
  if (!accountData.length) return (
    <div className="min-h-screen bg-orange-100 flex flex-col items-center justify-center">
      <p className="text-xl font-bold text-red-600 mb-4">No data to display.</p>
      <button onClick={onBack} className="bg-gray-600 text-white px-4 py-2 rounded">Back</button>
    </div>
  );

  /* ----------  Read first row for CIF-level fields already pre-totaled  ---------- */
  const first = accountData[0];
  const cifId       = first['CIF ID'];
  const npaDate     = first['Actual NPA Date'];
  const npaCategory = first['SUB CLASSIFICATION'];
  const numberOfAccounts = accountData.length;

  /* ----------  Totals: only sum Sacrifice / Max OTS  ---------- */
  const toNum = v => Number(v) || 0;

// 🔧 Use first account only
const sacrificeTotal = toNum(first['SACRIFICE']);
const maxOTS         = toNum(first['MINIMUM COMPROMISE AMOUNT']);


  const fmt = n => `₹${Number(n).toLocaleString('en-IN')}`;
    /* ----------  Finish: log to Google Sheet  ---------- */
  const handleFinish = () => {
    const timestamp = new Date().toLocaleString('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: true
    });

    fetch('https://api.sheetbest.com/sheets/23082146-1b44-445c-98e3-548981f48eaf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cifId: first['CIF ID'],
        borrowerName: first['BORROWER NAME'],
        principal: first['CIF Principal  O/S'],
        minimumCompromiseAmount: first['MINIMUM COMPROMISE AMOUNT'],
        timestamp: timestamp
      })
    })
    .catch(err => console.error('Sheet log error:', err));

    onBack();            // keep existing navigation behaviour
  };

  return (
    <div className="min-h-screen bg-orange-100 p-6 text-gray-800">
      {/* Top bar */}
      <div className="flex justify-between mb-4">
        <button onClick={onBack} className="bg-gray-600 text-white px-4 py-2 rounded">Back</button>
        <div className="text-red-1000 font-bold">© P.Raa</div>
      </div>

      {/* CIF Summary */}
      <h2 className="text-2xl font-bold mb-2">CIF ID: {cifId}</h2>
      <p><strong>Number of Accounts:</strong> {numberOfAccounts}</p>
      <p><strong>NPA Date:</strong> {npaDate}</p>
      <p><strong>NPA Category:</strong> {npaCategory}</p>

      {/* Vertical Financials */}
      <div className="bg-white shadow p-4 mt-4 rounded space-y-2">
        <p><strong>CIF CURRENT O/S:</strong> {fmt(first['CIF CURRENT O/S'])}</p>
        <p><strong>CIF PRINCIPAL O/S:</strong> {fmt(first['CIF PRINCIPAL O/S'])}</p>
       <p><strong>SACRIFICE:</strong> {fmt(sacrificeTotal)}</p>
        <p><strong>MINIMUM OTS AMOUNT:</strong> {fmt(maxOTS)}</p>
      </div>

      {/* Finish */}
      <button className="mt-6 bg-green-600 text-white px-4 py-2 rounded" onClick={onBack}>
        Finish
      </button>
    </div>
  );
}
