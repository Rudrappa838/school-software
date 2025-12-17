import React, { useState, useEffect } from 'react';
import { DollarSign, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import api from '../../../api/axios';

const StudentFees = () => {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFees = async () => {
            try {
                const res = await api.get('/fees/my-status');
                setFees(res.data);
            } catch (error) {
                console.error("Failed to load fees", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFees();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading fee details...</div>;

    const totalDue = fees.reduce((sum, f) => sum + parseFloat(f.balance), 0);

    return (
        <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg flex justify-between items-center">
                <div>
                    <p className="text-slate-400 font-medium mb-1">Total Outstanding Fees</p>
                    <h2 className="text-4xl font-black">₹{totalDue.toLocaleString()}</h2>
                </div>
                <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                    <DollarSign size={32} className="text-emerald-400" />
                </div>
            </div>

            {/* Fee List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-800">Fee Structure & Status</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">Fee Title</th>
                                <th className="px-6 py-4">Due Date</th>
                                <th className="px-6 py-4 text-right">Total Amount</th>
                                <th className="px-6 py-4 text-right">Paid</th>
                                <th className="px-6 py-4 text-right">Balance</th>
                                <th className="px-6 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {fees.length > 0 ? (
                                fees.map((fee) => (
                                    <tr key={fee.fee_structure_id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-800">{fee.title}</div>
                                            <div className="text-xs text-slate-400">{fee.type === 'CLASS_DEFAULT' ? 'Class Fee' : 'Individual Fee'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 text-sm">
                                            {new Date(fee.due_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-slate-800">
                                            ₹{parseFloat(fee.total_amount).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-emerald-600">
                                            ₹{parseFloat(fee.paid_amount).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-rose-600">
                                            ₹{parseFloat(fee.balance).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${fee.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                                                fee.status === 'Partial' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-rose-100 text-rose-700'
                                                }`}>
                                                {fee.status === 'Paid' && <CheckCircle size={12} />}
                                                {fee.status === 'Partial' && <Clock size={12} />}
                                                {fee.status === 'Unpaid' && <AlertCircle size={12} />}
                                                {fee.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                                        No fee records found for the current session.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <p className="text-center text-xs text-slate-400 mt-4">
                Note: Online fee payment is currently disabled. Please visit the school office for payments.
            </p>
        </div>
    );
};

export default StudentFees;
