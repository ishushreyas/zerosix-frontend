import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CreditCard, User, DollarSign, Tag, MessageSquare } from 'lucide-react';
import api from '../api';
import MonthYearPicker from './MonthYearPicker';

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    payer_id: '',
    amount: '',
    members: [],
    remark: '',
    payment_method: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions(selectedDate.getMonth() + 1, selectedDate.getFullYear());
    fetchUsers();
  }, [selectedDate]);

  const fetchUsers = async () => {
    try {
      const response = await api.getUsers();
      setUsers(response.data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const fetchTransactions = async (month, year) => {
    try {
      setLoading(true);
      const response = await api.getTransactions(month, year);
      setTransactions(response.data.transactions || []);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({ ...prev, [name]: value }));
  };

  const handleMemberChange = (e) => {
    const { value, checked } = e.target;
    setNewTransaction((prev) => {
      if (checked) {
        return { ...prev, members: [...prev.members, value] };
      } else {
        return { ...prev, members: prev.members.filter((m) => m !== value) };
      }
    });
  };

  const handleAddTransaction = async () => {
    const { payer_id, amount, category, payment_method, remark } = newTransaction;
    if (!payer_id || !amount || !category || !payment_method || !remark) return;

    try {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 500));

      const newTx = {
        id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        ...newTransaction,
        amount: parseFloat(amount),
        created_at: new Date().toISOString(),
      };

      setTransactions((prev) => [newTx, ...prev]);
      setNewTransaction({
        payer_id: '',
        amount: '',
        members: [],
        remark: '',
        payment_method: '',
        category: '',
      });
    } catch (err) {
      console.error('Failed to add transaction:', err);
    } finally {
      setLoading(false);
    }
  };

  const getUsernameById = (id) => {
    const user = users.find((u) => u.id === id);
    return user ? user.username : `Unknown (${id})`;
  };

  const categories = [
    'Food & Dining', 'Groceries', 'Transportation', 'Entertainment', 'Shopping',
    'Health & Fitness', 'Travel', 'Bills & Utilities', 'Other',
  ];

  const paymentMethods = [
    'Credit Card', 'Debit Card', 'Cash', 'Digital Wallet', 'Bank Transfer',
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-gray-900 font-[San Francisco]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-semibold">Transactions</h1>
          <p className="text-sm text-gray-500">Track and manage your expenses seamlessly</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 grid lg:grid-cols-3 gap-6">
        {/* New Transaction Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-black rounded-full p-2">
              <Plus className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-medium">New Transaction</h2>
              <p className="text-sm text-gray-500">Add an expense</p>
            </div>
          </div>

          {/* Payer */}
          <div>
            <label className="text-sm block mb-1">
              <User className="inline w-4 h-4 mr-1" />
              Payer
            </label>
            <select
              name="payer_id"
              value={newTransaction.payer_id}
              onChange={handleInputChange}
              className="w-full h-11 px-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
            >
              <option value="">Select payer</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.username}</option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="text-sm block mb-1">
              <DollarSign className="inline w-4 h-4 mr-1" />
              Amount
            </label>
            <input
              type="number"
              name="amount"
              step="0.01"
              placeholder="0.00"
              value={newTransaction.amount}
              onChange={handleInputChange}
              className="w-full h-11 px-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm block mb-1">
              <Tag className="inline w-4 h-4 mr-1" />
              Category
            </label>
            <select
              name="category"
              value={newTransaction.category}
              onChange={handleInputChange}
              className="w-full h-11 px-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-sm block mb-1">
              <CreditCard className="inline w-4 h-4 mr-1" />
              Payment Method
            </label>
            <select
              name="payment_method"
              value={newTransaction.payment_method}
              onChange={handleInputChange}
              className="w-full h-11 px-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
            >
              <option value="">Select method</option>
              {paymentMethods.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm block mb-1">
              <MessageSquare className="inline w-4 h-4 mr-1" />
              Description
            </label>
            <input
              type="text"
              name="remark"
              placeholder="What was this for?"
              value={newTransaction.remark}
              onChange={handleInputChange}
              className="w-full h-11 px-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>

          {/* Members */}
          <div>
            <label className="text-sm block mb-2">Members (optional)</label>
            <div className="grid grid-cols-2 gap-2">
              {users.map((user) => (
                <label key={user.id} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    value={user.id}
                    checked={newTransaction.members.includes(user.id)}
                    onChange={handleMemberChange}
                    className="form-checkbox rounded text-black"
                  />
                  <span>{user.username}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddTransaction}
            disabled={loading}
            className="w-full h-12 bg-black text-white rounded-xl hover:bg-neutral-800 transition-all"
          >
            {loading ? 'Adding...' : 'Add Transaction'}
          </button>
        </div>

        {/* Transaction List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">Recent Transactions</h2>
              <p className="text-sm text-gray-500">View your transaction history</p>
            </div>
            <MonthYearPicker currentDate={selectedDate} onDateChange={setSelectedDate} />
          </div>
          <div className="bg-white rounded-2xl shadow-sm border divide-y">
            {transactions.length === 0 ? (
              <div className="text-center p-12 text-gray-500">No transactions found</div>
            ) : (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/transactions/${tx.id}`)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{tx.remark}</p>
                      <p className="text-sm text-gray-500">{tx.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${tx.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{getUsernameById(tx.payer_id)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;