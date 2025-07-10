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

  const { sacrificeTotal, maxOTS } = useMemo(() => {
    return accountData.reduce(
      (acc, row) => {
        acc.sacrificeTotal += toNum(row['SACRIFICE']);
        acc.maxOTS = Math.max(acc.maxOTS, toNum(row['MINIMUM COMPROMISE AMOUNT']));
        return acc;
      },
      { sacrificeTotal: 0, maxOTS: 0 }
    );
  }, [accountData]);

  const fmt = n => `₹${Number(n).toLocaleString('en-IN')}`;

  return (
    <div className="min-h-screen bg-orange-100 p-6 text-gray-800">
      {/* Top bar */}
      <div className="flex justify-between mb-4">
        <button onClick={onBack} className="bg-gray-600 text-white px-4 py-2 rounded">Back</button>
        <div className="text-red-800 font-bold">© P.Raa</div>
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
        <p><strong>SACRIFICE (Total):</strong> {fmt(sacrificeTotal)}</p>
        <p><strong>MAXIMUM OTS AMOUNT:</strong> {fmt(maxOTS)}</p>
      </div>

      {/* Finish */}
      <button className="mt-6 bg-green-600 text-white px-4 py-2 rounded" onClick={onBack}>
        Finish
      </button>
    </div>
  );
}
