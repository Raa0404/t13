import React, { useState, useEffect } from 'react';

export default function Phase2({ solId, userName, onBack, onProceed }) {
  const [accountNumber, setAccountNumber] = useState('');
  const [allAccounts, setAllAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);

  useEffect(() => {
    fetch('/mock_accounts.json')
      .then(res => res.json())
      .then(data => setAllAccounts(data))
      .catch(() => alert('Unable to load account data.'));
  }, []);

  const handleSearch = () => {
    const match = allAccounts.find(
      acc => acc['ACCOUNT NUMBER'] === accountNumber
    );
    if (match) {
      const related = allAccounts.filter(
        acc => acc['CIF ID'] === match['CIF ID']
      );
      setFilteredAccounts(related);
    } else {
      setFilteredAccounts([]);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-100 p-6">
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="bg-gray-600 text-white px-3 py-1 rounded"
        >
          Back
        </button>
        <div className="text-red-900 font-bold">© P.Raa</div>
      </div>

      <h2 className="text-xl font-bold mt-4">
        Hello, {userName} (SOL: {solId})
      </h2>

      <input
        className="border p-2 rounded mt-6 w-full"
        placeholder="Enter Account Number"
        value={accountNumber}
        onChange={e => setAccountNumber(e.target.value)}
      />
      <button
        onClick={handleSearch}
        className="mt-2 bg-orange-600 text-white px-4 py-2 rounded"
      >
        Search
      </button>

      {filteredAccounts.length > 0 && (
        <div className="mt-6 bg-white rounded shadow p-4">
          <h3 className="text-lg font-bold mb-2">
            Accounts under CIF {filteredAccounts[0]['CIF ID']}:
          </h3>
          <ul>
            {filteredAccounts.map((acc, idx) => (
              <li key={idx} className="border-b py-2">
                <p><strong>Account Number:</strong> {acc['ACCOUNT NUMBER']}</p>
                <p><strong>Borrower Name:</strong> {acc['BORROWER NAME']}</p>
                <p><strong>NPA Date:</strong> {new Date(acc['Actual NPA Date']).toLocaleDateString('en-GB')}</p>
                <p><strong>NPA Category:</strong> {acc['SUB CLASSIFICATION']}</p>
              </li>
            ))}
          </ul>
          <button
            onClick={() => onProceed(filteredAccounts)}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Proceed
          </button>
        </div>
      )}

      {filteredAccounts.length === 0 && accountNumber && (
        <p className="mt-6 text-red-600">No matching accounts found.</p>
      )}
    </div>
  );
}