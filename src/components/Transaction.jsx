import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, CreditCard, Calendar, User, DollarSign, Tag, MessageSquare } from 'lucide-react';
import api from '../api';
import MonthYearPicker from './MonthYearPicker'; // Import MonthYearPicker

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
  const [selectedDate, setSelectedDate] = useState(new Date()); // State for selected date
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions(selectedDate.getMonth() + 1, selectedDate.getFullYear());
    fetchUsers(); // Fetch users when component mounts
  }, [selectedDate]); // Re-fetch transactions when selectedDate changes

  const fetchUsers = async () => {
    try {
      const response = await api.getUsers();
      console.log('API Response for users:', response.data); // Log the API response
      setUsers(response.data || []);
      console.log('Users state after setting:', response.data.users || []); // Log the users state
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
      // Simulate API call
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Transactions</h1>
            <p className="mt-2 text-sm text-gray-600">Manage your expenses and track spending</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add New Transaction Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">New Transaction</h3>
                    <p className="text-sm text-gray-500">Add a new expense</p>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-6">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="payer_id" className="text-sm font-medium text-gray-700 mb-2 block">
                      <User className="w-4 h-4 inline mr-2" />
                      Payer
                    </Label>
                    <Select
                      onValueChange={(value) => setNewTransaction((prev) => ({ ...prev, payer_id: value }))}
                      value={newTransaction.payer_id}
                    >
                      <SelectTrigger className="w-full h-12 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent">
                        <SelectValue placeholder="Select payer" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-gray-200">
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id} className="rounded-lg">
                            {user.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="amount" className="text-sm font-medium text-gray-700 mb-2 block">
                      <DollarSign className="w-4 h-4 inline mr-2" />
                      Amount
                    </Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      step="0.01"
                      value={newTransaction.amount}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="h-12 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-sm font-medium text-gray-700 mb-2 block">
                      <Tag className="w-4 h-4 inline mr-2" />
                      Category
                    </Label>
                    <Select
                      onValueChange={(value) => setNewTransaction((prev) => ({ ...prev, category: value }))}
                      value={newTransaction.category}
                    >
                      <SelectTrigger className="w-full h-12 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-gray-200">
                        {categories.map((category) => (
                          <SelectItem key={category} value={category} className="rounded-lg">
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="payment_method" className="text-sm font-medium text-gray-700 mb-2 block">
                      <CreditCard className="w-4 h-4 inline mr-2" />
                      Payment Method
                    </Label>
                    <Select
                      onValueChange={(value) => setNewTransaction((prev) => ({ ...prev, payment_method: value }))}
                      value={newTransaction.payment_method}
                    >
                      <SelectTrigger className="w-full h-12 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-gray-200">
                        {paymentMethods.map((method) => (
                          <SelectItem key={method} value={method} className="rounded-lg">
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="remark" className="text-sm font-medium text-gray-700 mb-2 block">
                      <MessageSquare className="w-4 h-4 inline mr-2" />
                      Description
                    </Label>
                    <Input
                      id="remark"
                      name="remark"
                      value={newTransaction.remark}
                      onChange={handleInputChange}
                      placeholder="What was this for?"
                      className="h-12 border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>

                  <div>
                    <Label htmlFor="members" className="text-sm font-medium text-gray-700 mb-2 block">
                      Members (optional)
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {users.map((user) => (
                        <div key={user.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`member-${user.id}`}
                            name="members"
                            value={user.id}
                            checked={newTransaction.members.includes(user.id)}
                            onChange={handleMemberChange}
                            className="form-checkbox h-4 w-4 text-black transition duration-150 ease-in-out rounded"
                          />
                          <Label htmlFor={`member-${user.id}`} className="text-sm font-medium text-gray-700">
                            {user.username}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={handleAddTransaction}
                    disabled={loading}
                    className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium rounded-xl transition-colors duration-200 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Adding...
                      </div>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 mr-2" />
                        Add Transaction
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
                      <p className="text-sm text-gray-500">Your expense history</p>
                    </div>
                    <MonthYearPicker currentDate={selectedDate} onDateChange={handleDateChange} />
                  </div>
                  <div className="text-sm text-gray-500">
                    {transactions.length} transactions
                  </div>
                </div>
              </div>
              
              <div className="overflow-hidden">
                {transactions.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No transactions yet</p>
                    <p className="text-sm text-gray-400">Add your first transaction to get started</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {transactions.map((transaction, index) => (
                      <div 
                        key={transaction.id} 
                        className={`px-6 py-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${index === 0 ? 'bg-gray-50' : ''}`}
                        onClick={() => navigate(`/transactions/${transaction.id}`)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <Tag className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{transaction.remark}</div>
                              <div className="text-sm text-gray-500">{transaction.category}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">
                              ${transaction.amount.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500">{transaction.category}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;