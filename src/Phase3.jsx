import React, { useMemo } from 'react';

/**
 * Phase3 expects:
 *   - accountData  → array of rows (all accounts for one CIF)
 *   - onBack       → callback to return to Phase-2
 */
export default function Phase3({ accountData = [], onBack }) {
  if (accountData.length === 0) {
    return (
      <div className="min-h-screen bg-orange-100 flex flex-col items-center justify-center">
        <p className="text-xl font-bold text-red-600 mb-4">No data to display.</p>
        <button onClick={onBack} className="bg-gray-600 text-white px-4 py-2 rounded">
          Back
        </button>
      </div>
    );
  }

  // ► Derive CIF-level facts
  const cifId            = accountData[0]['CIF ID'];
  const npaDate          = accountData[0]['Actual NPA Date'];
  const npaCategory      = accountData[0]['SUB CLASSIFICATION'];
  const numberOfAccounts = accountData.length;

  // Sum / max helpers
  const toNum = v => Number(String(v).replace(/[^0-9.-]/g, '')) || 0;

  const totals = useMemo(() => {
    return accountData.reduce((acc, row) => {
      acc.currentOS   += toNum(row['CIF CURRENT O/S']);
      acc.principalOS += toNum(row['CIF PRINCIPAL O/S']);
      acc.notional    += toNum(row['NOTIONAL DUES'] || 0);
      acc.writeOff    += toNum(row['WRITE OFF']      || 0);
      acc.waiver      += toNum(row['CIF WAIVER']     || 0);
      acc.sacrifice   += toNum(row['SACRIFICE']);
      acc.minSettle   = Math.max(acc.minSettle, toNum(row['MINIMUM COMPROMISE AMOUNT']));
      return acc;
    }, { currentOS:0, principalOS:0, notional:0, writeOff:0, waiver:0, sacrifice:0, minSettle:0 });
  }, [accountData]);

  const fmt = n => totals.minSettle === 0 ? n : `₹${n.toLocaleString('en-IN')}`;

  return (
    <div className="min-h-screen bg-orange-100 p-6 text-gray-800">
      {/* top bar */}
      <div className="flex justify-between mb-4">
        <button onClick={onBack} className="bg-gray-600 text-white px-4 py-2 rounded">Back</button>
        <div className="text-red-900 font-bold">© P.Raa</div>
      </div>

      {/* CIF summary */}
      <h2 className="text-2xl font-bold mb-2">CIF ID: {cifId}</h2>
      <p><strong>Number of Accounts:</strong> {numberOfAccounts}</p>
      <p><strong>NPA Date:</strong> {new Date(npaDate).toLocaleDateString('en-GB')}</p>
      <p><strong>NPA Category:</strong> {npaCategory}</p>

      {/* Vertical financials */}
      <div className="bg-white shadow p-4 mt-4 rounded space-y-2 text-sm sm:text-base">
        <p><strong>CIF CURRENT O/S:</strong> {fmt(totals.currentOS)}</p>
        <p><strong>CIF PRINCIPAL O/S:</strong> {fmt(totals.principalOS)}</p>
        <p><strong>NOTIONAL DUES:</strong> {fmt(totals.notional)}</p>
        <p><strong>WRITE OFF:</strong> {fmt(totals.writeOff)}</p>
        <p><strong>WAIVER:</strong> {fmt(totals.waiver)}</p>
        <p><strong>SACRIFICE:</strong> {fmt(totals.sacrifice)}</p>
        <p><strong>MAXIMUM OTS AMOUNT:</strong> {fmt(totals.minSettle)}</p>
      </div>

      {/* finish */}
      <button
        className="mt-6 bg-green-600 text-white px-4 py-2 rounded"
        onClick={onBack}
      >
        Finish
      </button>
    </div>
  );
}
How to wire it up
Pass the filtered accounts from Phase 2:
In App.jsx, when you call setPhase(3), also store filteredAccounts to state and pass it down:

jsx
Copy
Edit
const [cifData, setCifData] = useState([]);
...
<Phase2 ... onProceed={data => { setCifData(data); setPhase(3); }} />
...
{phase === 3 && <Phase3 accountData={cifData} onBack={() => setPhase(2)} />}