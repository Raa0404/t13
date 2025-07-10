import React, { useMemo } from 'react';

/**
 * Phase3 expects:
 *   - accountData → array of rows (all accounts for one CIF)
 *   - onBack      → callback to return to Phase-2
 */
export default function Phase3({ accountData = [], onBack }) {
  if (accountData.length === 0) {
    return (
      <div className="min-h-screen bg-orange-100 flex flex-col items-center justify-center">
        <p className="text-xl font-bold text-red-600 mb-4">
          No data to display.
        </p>
        <button
          onClick={onBack}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Back
        </button>
      </div>
    );
  }

  /* ----------  CIF-level facts  ---------- */
  const cifId            = accountData[0]['CIF ID'];
  const npaDate          = accountData[0]['Actual NPA Date'];
  const npaCategory      = accountData[0]['SUB CLASSIFICATION'];
  const numberOfAccounts = accountData.length;

  /* ----------  Totals & helpers  ---------- */
  const toNum = (v) =>
    Number(String(v).replace(/[^0-9.-]/g, '')) || 0;

  const totals = useMemo(() => {
    return accountData.reduce(
      (acc, row) => {
        acc.currentOS   += toNum(row['CIF CURRENT O/S']);
        acc.principalOS += toNum(row['CIF PRINCIPAL O/S']);
        acc.sacrifice   += toNum(row['SACRIFICE']);
        acc.minSettle   = Math.max(
          acc.minSettle,
          toNum(row['MINIMUM COMPROMISE AMOUNT'])
        );
        return acc;
      },
      {
        currentOS: 0,
        principalOS: 0,
        sacrifice: 0,
        minSettle: 0,
      }
    );
  }, [accountData]);

  const fmt = (n) =>
    totals.minSettle === 0 ? n : `₹${n.toLocaleString('en-IN')}`;

  /* ----------  Render  ---------- */
  return (
    <div className="min-h-screen bg-orange-100 p-6 text-gray-800">
      {/* top bar */}
      <div className="flex justify-between mb-4">
        <button
          onClick={onBack}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Back
        </button>
        <div className="text-red-800 font-bold">© P.Raa</div>
      </div>

      {/* summary */}
      <h2 className="text-2xl font-bold mb-2">CIF ID: {cifId}</h2>
      <p>
        <strong>Number of Accounts:</strong> {numberOfAccounts}
      </p>
      <p>
        <strong>NPA Date:</strong>{' '}
        {new Date(npaDate).toLocaleDateString('en-GB')}
      </p>
      <p>
        <strong>NPA Category:</strong> {npaCategory}
      </p>

      {/* financials */}
      <div className="bg-white shadow p-4 mt-4 rounded space-y-2">
        <p>
          <strong>CIF CURRENT O/S:</strong> {fmt(totals.currentOS)}
        </p>
        <p>
          <strong>CIF PRINCIPAL O/S:</strong> {fmt(totals.principalOS)}
        </p>
        <p>
          <strong>SACRIFICE:</strong> {fmt(totals.sacrifice)}
        </p>
        <p>
          <strong>MAXIMUM OTS AMOUNT:</strong> {fmt(totals.minSettle)}
        </p>
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
