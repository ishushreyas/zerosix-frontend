import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
          api.getUsers(),
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

  if (loading) return <div className="text-center py-8">Loading transaction details...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!transaction) return <div className="text-center py-8">Transaction not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
        >
          &larr; Back to Transactions
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900">Transaction Details</h2>
          </div>
          <div className="p-6 space-y-4">
            <Detail label="Remark" value={transaction.remark} />
            <Detail
              label="Amount"
              value={transaction.amount ? `$${transaction.amount.toFixed(2)}` : 'N/A'}
            />
            <Detail label="Category" value={transaction.category} />
            <Detail label="Payment Method" value={transaction.payment_method} />
            <Detail label="Payer" value={getUsernameById(transaction.payer_id)} />
            <Detail
              label="Members"
              value={
                transaction.members && transaction.members.length > 0
                  ? transaction.members.map(getUsernameById).join(', ')
                  : 'N/A'
              }
            />
            <Detail
              label="Date"
              value={
                transaction.created_at
                  ? new Date(transaction.created_at).toLocaleDateString()
                  : 'N/A'
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-lg font-semibold text-gray-900">{value}</p>
  </div>
);

export default TransactionDetail;