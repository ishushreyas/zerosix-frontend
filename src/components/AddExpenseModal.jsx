import { useState } from "react";
import { X, DollarSign, Users, Tag, CircleCheck, ArrowLeft, ArrowRight, Check, Pencil } from "lucide-react";
import api from "../api";

const PAYMENT_CATEGORIES = ["Food", "Transport", "Utilities", "Entertainment"];
const PAYMENT_TYPES = ["Cash", "Credit Card", "UPI", "Other"];

export default function AddExpenseModal() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPayerOpen, setIsPayerOpen] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([
    { id: 1, username: "Alice" },
    { id: 2, username: "Bob" },
    { id: 3, username: "Charlie" },
  ]);
  const [transaction, setTransaction] = useState({
    payerId: "",
    amount: "",
    remark: "",
    members: [],
    category: "",
    paymentType: "",
  });

  const selectedPayer = users.find((u) => u.id === transaction.payerId);

  const renderChipSelection = (items, selectedValue, onSelect, label, icon) => (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        {icon} {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const isSelected = Array.isArray(selectedValue)
            ? selectedValue.includes(item)
            : selectedValue === item;
          return (
            <div
              key={item}
              onClick={() => {
                if (Array.isArray(selectedValue)) {
                  onSelect(isSelected ? selectedValue.filter((v) => v !== item) : [...selectedValue, item]);
                } else {
                  onSelect(isSelected ? "" : item);
                }
              }}
              className={`px-4 py-2.5 rounded-2xl cursor-pointer text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                isSelected
                  ? "bg-blue-600 dark:bg-blue-500 text-white shadow-lg"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-md"
              }`}
            >
              {item}
              {isSelected && <CircleCheck size={16} />}
            </div>
          );
        })}
      </div>
    </div>
  );

  const canProceedStep2 = transaction.payerId && transaction.amount;
  const canProceedStep3 = transaction.members.length > 0;
  const canSubmit = transaction.category && transaction.paymentType;

  const stepHeaders = [
    { title: "Basic Details", subtitle: "Amount and payer", icon: <DollarSign size={20} /> },
    { title: "Split Among", subtitle: "Select participants", icon: <Users size={20} /> },
    { title: "Final Details", subtitle: "Category and payment type", icon: <Tag size={20} /> },
  ];

  const handleAddTransaction = async () => {
    if (!transaction.payerId || !transaction.amount || transaction.members.length === 0) {
      setError("Please fill all required fields");
      return;
    }
    try {
      await api.addTransaction(transaction);
      resetForm();
    } catch (err) {
      console.error(err);
      setError("Failed to add transaction");
    }
  };

  const resetForm = () => {
    setTransaction({ payerId: "", amount: "", remark: "", members: [], category: "", paymentType: "" });
    setCurrentStep(1);
    setError("");
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center z-50 p-4">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="font-semibold text-lg">Add Expense</h2>
          <button onClick={resetForm} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center mb-4">
            {stepHeaders.map((step, idx) => (
              <div key={idx} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                    currentStep > idx + 1
                      ? "bg-white text-black"
                      : currentStep === idx + 1
                      ? "bg-black text-white"
                      : "bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {currentStep > idx + 1 ? <Check size={16} /> : idx + 1}
                </div>
                {idx < stepHeaders.length - 1 && (
                  <div
                    className={`w-8 h-1 mx-2 rounded transition-all duration-300 ${
                      currentStep > idx + 1 ? "bg-white" : "bg-gray-200 dark:bg-gray-600"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              {stepHeaders[currentStep - 1].icon}
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{stepHeaders[currentStep - 1].title}</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stepHeaders[currentStep - 1].subtitle}</p>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Step 1 */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
              {/* Payer Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Who paid?</label>
                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={() => setIsPayerOpen(!isPayerOpen)}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-700 backdrop-blur-sm rounded-2xl flex items-center justify-between text-left hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition"
                  >
                    <span>{selectedPayer ? selectedPayer.username : "Select who paid"}</span>
                    <svg
                      className={`h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isPayerOpen ? "rotate-180" : ""}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </button>

                  {isPayerOpen && (
                    <ul className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-700 backdrop-blur-sm rounded-2xl shadow-lg max-h-48 overflow-auto border border-gray-200 dark:border-gray-600">
                      {users.map((u) => (
                        <li
                          key={u.id}
                          onClick={() => {
                            setTransaction({ ...transaction, payerId: u.id });
                            setIsPayerOpen(false);
                          }}
                          className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer flex items-center justify-between transition-colors first:rounded-t-2xl last:rounded-b-2xl text-gray-900 dark:text-gray-100"
                        >
                          <span>{u.username}</span>
                          {transaction.payerId === u.id && <Check className="text-blue-600 dark:text-blue-400" size={18} />}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-4 text-gray-400 dark:text-gray-500" size={20} />
                  <input
                    type="number"
                    value={transaction.amount}
                    onChange={(e) => setTransaction({ ...transaction, amount: e.target.value })}
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 backdrop-blur-sm rounded-2xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border border-gray-200 dark:border-gray-600 text-lg font-medium"
                  />
                </div>
              </div>

              {/* Remark */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Add a note (optional)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={transaction.remark}
                    onChange={(e) => setTransaction({ ...transaction, remark: e.target.value })}
                    placeholder="What was this for?"
                    className="w-full p-4 bg-gray-50 dark:bg-gray-700 backdrop-blur-sm rounded-2xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 border border-gray-200 dark:border-gray-600"
                  />
                  <Pencil className="absolute top-4 right-4 text-gray-400 dark:text-gray-500" size={18} />
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
              {renderChipSelection(
                users.map((u) => u.username),
                transaction.members.map((id) => users.find((u) => u.id === id)?.username),
                (selected) => {
                  const ids = selected.map((name) => users.find((u) => u.username === name)?.id).filter(Boolean);
                  setTransaction({ ...transaction, members: ids });
                },
                "Participants",
                <Users size={16} />
              )}
            </div>
          )}

          {/* Step 3 */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600">
                  {renderChipSelection(
                    PAYMENT_CATEGORIES,
                    transaction.category,
                    (cat) => setTransaction({ ...transaction, category: cat }),
                    "Category",
                    <Tag size={16} />
                  )}
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600">
                  {renderChipSelection(
                    PAYMENT_TYPES,
                    transaction.paymentType,
                    (type) => setTransaction({ ...transaction, paymentType: type }),
                    "Payment Method",
                    <DollarSign size={16} />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 pt-4">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
              >
                <ArrowLeft size={16} /> Back
              </button>
            )}
            <button
              type={currentStep === 3 ? "submit" : "button"}
              disabled={
                (currentStep === 1 && !canProceedStep2) ||
                (currentStep === 2 && !canProceedStep3) ||
                (currentStep === 3 && !canSubmit)
              }
              onClick={() => (currentStep === 3 ? handleAddTransaction() : setCurrentStep(currentStep + 1))}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                (currentStep === 1 && !canProceedStep2) ||
                (currentStep === 2 && !canProceedStep3) ||
                (currentStep === 3 && !canSubmit)
                  ? "bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  : "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-600 shadow-lg hover:shadow-xl"
              }`}
            >
              {currentStep === 3 ? "Add Transaction" : "Continue"}
              {currentStep < 3 && <ArrowRight size={16} />}
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800 mt-4">
              <p className="text-red-600 dark:text-red-400 text-center text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}