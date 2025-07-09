import React, { useState, useEffect } from 'react';
import api from '../api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'; // Import Select components

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]); // New state for users
  const [newTransaction, setNewTransaction] = useState({
    payer_id: '',
    amount: '',
    members: [],
    remark: '',
    payment_method: '',
    category: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactions();
    fetchUsers(); // Fetch users when component mounts
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.getUsers();
      console.log('API Response for users:', response.data); // Log the API response
      setUsers(response.data.users || []);
      console.log('Users state after setting:', response.data.users || []); // Log the users state
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await api.getTransactions();
      setTransactions(response.data.transactions || []);
    } catch (err) {
      setError('Failed to fetch transactions.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.addTransaction({
        ...newTransaction,
        amount: parseFloat(newTransaction.amount),
        members: newTransaction.members.length > 0 ? newTransaction.members.split(',').map(m => m.trim()) : [],
      });
      setNewTransaction({
        payer_id: '',
        amount: '',
        members: [],
        remark: '',
        payment_method: '',
        category: '',
      });
      fetchTransactions(); // Re-fetch transactions after adding
    } catch (err) {
      setError('Failed to add transaction.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getUsernameById = (id) => {
    console.log('Looking up user for ID:', id);
    console.log('Available users:', users);
    const user = users.find((u) => u.id === id);
    return user ? user.username : `Unknown User (${id})`;
  };

  if (loading) {
    return <div className="p-4 text-center">Loading transactions...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Transaction Management</h1>

      {/* Add New Transaction Form */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Add New Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTransaction} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="payer_id">Payer</Label>
              <Select
                onValueChange={(value) => setNewTransaction((prev) => ({ ...prev, payer_id: value }))}
                value={newTransaction.payer_id}
                required
              >
                <SelectTrigger id="payer_id">
                  <SelectValue placeholder="Select a payer" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={newTransaction.amount}
                onChange={handleInputChange}
                placeholder="e.g., 50.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="members">Members (comma-separated IDs)</Label>
              <Input
                id="members"
                name="members"
                value={newTransaction.members}
                onChange={handleInputChange}
                placeholder="e.g., user_456, user_789"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remark">Remark</Label>
              <Input
                id="remark"
                name="remark"
                value={newTransaction.remark}
                onChange={handleInputChange}
                placeholder="e.g., Groceries"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment_method">Payment Method</Label>
              <Input
                id="payment_method"
                name="payment_method"
                value={newTransaction.payment_method}
                onChange={handleInputChange}
                placeholder="e.g., Credit Card"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={newTransaction.category}
                onChange={handleInputChange}
                placeholder="e.g., Food"
              />
            </div>
            <div className="col-span-full">
              <Button type="submit" className="w-full">
                Add Transaction
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Transaction History List */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-gray-600">No transactions found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remark</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.id.substring(0, 8)}...</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getUsernameById(transaction.payer_id)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${transaction.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.remark}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(transaction.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Transaction;
