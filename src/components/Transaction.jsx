import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CreditCard, Calendar, User, DollarSign, Tag, MessageSquare } from 'lucide-react';
import api from '../api';
import MonthYearPicker from './MonthYearPicker'; 
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

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
  const [error, setError] = useState(null);
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
      setError('Failed to fetch transactions.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
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
        return { ...prev, members: prev.members.filter((member) => member !== value) };
      }
    });
  };

  const handleAddTransaction = async () => {
    if (!newTransaction.payer_id || !newTransaction.amount || !newTransaction.category || !newTransaction.payment_method || !newTransaction.remark) {
      return;
    }
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      const newTx = {
        id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        payer_id: newTransaction.payer_id,
        amount: parseFloat(newTransaction.amount),
        remark: newTransaction.remark,
        category: newTransaction.category,
        payment_method: newTransaction.payment_method,
        created_at: new Date().toISOString(),
        members: newTransaction.members,
      };
      setTransactions(prev => [newTx, ...prev]);
      setNewTransaction({
        payer_id: '',
        amount: '',
        members: [],
        remark: '',
        payment_method: '',
        category: '',
      });
    } catch (err) {
      setError('Failed to add transaction.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getUsernameById = (id) => {
    const user = users.find((u) => u.id === id);
    return user ? user.username : `Unknown User (${id})`;
  };

  const categories = [
    'Food & Dining',
    'Groceries',
    'Transportation',
    'Entertainment',
    'Shopping',
    'Health & Fitness',
    'Travel',
    'Bills & Utilities',
    'Other'
  ];

  const paymentMethods = [
    'Credit Card',
    'Debit Card',
    'Cash',
    'Digital Wallet',
    'Bank Transfer'
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-gray-900 font-[San Francisco]">
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-semibold">Transactions</h1>
          <p className="text-sm text-gray-500">Track and manage your expenses seamlessly</p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-6 grid lg:grid-cols-3 gap-6">
        {/* New Transaction Form */}
        <div className="col-span-1 bg-white p-6 rounded-2xl shadow-sm border space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-black rounded-full p-2">
              <Plus className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-medium">New Transaction</h2>
              <p className="text-sm text-gray-500">Add an expense</p>
            </div>
          </div>

          {/* Input fields and selects */}
          {/* Repeat pattern using Label, Input, Select with Apple UI styles (rounded-xl, subtle shadows, etc.) */}

          {/* Submit Button */}
          <Button
            onClick={handleAddTransaction}
            disabled={loading}
            className="w-full h-12 bg-black text-white rounded-xl hover:bg-neutral-800 transition-all"
          >
            {loading ? 'Adding...' : 'Add Transaction'}
          </Button>
        </div>

        {/* Transactions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">Recent Transactions</h2>
              <p className="text-sm text-gray-500">View your transaction history</p>
            </div>
            <MonthYearPicker currentDate={selectedDate} onDateChange={handleDateChange} />
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
                    <div className="space-y-1">
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
