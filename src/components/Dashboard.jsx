import React, { useState, useEffect } from 'react';
import api from '../api';
import MonthYearPicker from './MonthYearPicker'; // Import MonthYearPicker

const Dashboard = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date()); // State for selected date

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError(null);
        const month = selectedDate.getMonth() + 1; // Month is 0-indexed
        const year = selectedDate.getFullYear();

        const response = await api.getSummary(month, year); // Pass month and year
        const data = await response.data;
        setSummaryData(data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [selectedDate]); // Re-fetch when selectedDate changes

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
        <p>Loading summary data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
        <p>Error loading summary data: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <MonthYearPicker currentDate={selectedDate} onDateChange={handleDateChange} />
      </div>

      {summaryData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Expenses</h2>
            <p className="text-3xl font-bold text-blue-600">${summaryData.total_expenses?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Transactions</h2>
            <p className="text-3xl font-bold text-green-600">{summaryData.transaction_count || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Average Transaction</h2>
            <p className="text-3xl font-bold text-purple-600">${summaryData.average_transaction?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Largest Transaction</h2>
            <p className="text-3xl font-bold text-red-600">${summaryData.largest_transaction?.toFixed(2) || '0.00'}</p>
          </div>
        </div>
      )}

      {summaryData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Expenses by Category</h2>
            {Object.keys(summaryData.category_expenses || {}).length > 0 ? (
              <ul className="list-disc pl-5">
                {Object.entries(summaryData.category_expenses).map(([category, amount]) => (
                  <li key={category} className="text-gray-800">
                    {category}: <span className="font-medium">${amount.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No category expenses to display.</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Expenses by Payment Method</h2>
            {Object.keys(summaryData.payment_method_expenses || {}).length > 0 ? (
              <ul className="list-disc pl-5">
                {Object.entries(summaryData.payment_method_expenses).map(([method, amount]) => (
                  <li key={method} className="text-gray-800">
                    {method}: <span className="font-medium">${amount.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No payment method expenses to display.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
