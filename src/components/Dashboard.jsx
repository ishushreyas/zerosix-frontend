import React, { useState, useEffect } from 'react';
import api from '../api';
import MonthYearPicker from './MonthYearPicker';

const Dashboard = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError(null);
        const month = selectedDate.getMonth() + 1;
        const year = selectedDate.getFullYear();
        const response = await api.getSummary(month, year);
        setSummaryData(response.data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-[#F9F9F9] text-gray-800">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <p className="text-gray-500">Loading summary data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 bg-[#F9F9F9] text-gray-800">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <p className="text-red-600">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-[#F9F9F9] text-gray-900 font-[San Francisco]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <MonthYearPicker currentDate={selectedDate} onDateChange={handleDateChange} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border">
          <h2 className="text-sm text-gray-500 mb-1">Total Expenses</h2>
          <p className="text-2xl font-semibold text-blue-600">${summaryData.total_expenses?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border">
          <h2 className="text-sm text-gray-500 mb-1">Total Transactions</h2>
          <p className="text-2xl font-semibold text-green-600">{summaryData.transaction_count || 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border">
          <h2 className="text-sm text-gray-500 mb-1">Average Transaction</h2>
          <p className="text-2xl font-semibold text-purple-600">${summaryData.average_transaction?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border">
          <h2 className="text-sm text-gray-500 mb-1">Largest Transaction</h2>
          <p className="text-2xl font-semibold text-red-600">${summaryData.largest_transaction?.toFixed(2) || '0.00'}</p>
        </div>
      </div>

      {/* Details by Category & Payment Method */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Expenses */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border">
          <h2 className="text-base font-medium mb-3">Expenses by Category</h2>
          {summaryData.category_expenses && Object.keys(summaryData.category_expenses).length > 0 ? (
            <ul className="space-y-2">
              {Object.entries(summaryData.category_expenses).map(([category, amount]) => (
                <li key={category} className="flex justify-between text-sm">
                  <span className="text-gray-700">{category}</span>
                  <span className="font-medium">${amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No category expenses to display.</p>
          )}
        </div>

        {/* Payment Method Expenses */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border">
          <h2 className="text-base font-medium mb-3">Expenses by Payment Method</h2>
          {summaryData.payment_method_expenses && Object.keys(summaryData.payment_method_expenses).length > 0 ? (
            <ul className="space-y-2">
              {Object.entries(summaryData.payment_method_expenses).map(([method, amount]) => (
                <li key={method} className="flex justify-between text-sm">
                  <span className="text-gray-700">{method}</span>
                  <span className="font-medium">${amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No payment method data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;