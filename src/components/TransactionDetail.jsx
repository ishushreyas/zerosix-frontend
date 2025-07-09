import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import api from '../api';

const TransactionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [transactionResponse, usersResponse] = await Promise.all([
          api.getSingleTransaction(id),
          api.getUsers()
        ]);
        setTransaction(transactionResponse.data);
        setUsers(usersResponse.data || []);
      } catch (err) {
        setError('Failed to fetch transaction details or users.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getUsernameById = (id) => {
    const user = users.find((u) => u.id === id);
    return user ? user.username : `Unknown User (${id})`;
  };

  if (loading) {
    return <div className="text-center py-8">Loading transaction details...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!transaction) {
    return <div className="text-center py-8">Transaction not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button onClick={() => navigate(-1)} className="mb-4 bg-black hover:bg-gray-800 text-white">
          &larr; Back to Transactions
        </Button>
        <Card className="rounded-2xl shadow-sm border border-gray-200">
          <CardHeader className="px-6 py-5 border-b border-gray-200">
            <CardTitle className="text-2xl font-semibold text-gray-900">Transaction Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Remark</p>
              <p className="text-lg font-semibold text-gray-900">{transaction.remark}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Amount</p>
              <p className="text-lg font-semibold text-gray-900">${transaction.amount ? transaction.amount.toFixed(2) : 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Category</p>
              <p className="text-lg font-semibold text-gray-900">{transaction.category}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Payment Method</p>
              <p className="text-lg font-semibold text-gray-900">{transaction.payment_method}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Payer</p>
              <p className="text-lg font-semibold text-gray-900">{getUsernameById(transaction.payer_id)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Members</p>
              <p className="text-lg font-semibold text-gray-900">
                {transaction.members && transaction.members.length > 0
                  ? transaction.members.map(memberId => getUsernameById(memberId)).join(', ')
                  : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {transaction.created_at ? new Date(transaction.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionDetail;