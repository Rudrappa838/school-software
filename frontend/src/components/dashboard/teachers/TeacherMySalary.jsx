import React, { useState, useEffect } from 'react';
import { CreditCard, Download, User, Calendar, DollarSign, CheckCircle } from 'lucide-react';
import api from '../../../api/axios';
import toast from 'react-hot-toast';

const TeacherMySalary = () => {
    const [salaryData, setSalaryData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSalary();
    }, []);

    const fetchSalary = async () => {
        try {
            const res = await api.get('/salary/my-salary');
            setSalaryData(res.data);
        } catch (error) {
            // If 403 or 404, maybe invalid role or profile
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-slate-400">Loading salary information...</div>;

    if (!salaryData) return (
        <div className="p-12 text-center border-2 border-dashed border-slate-300 rounded-2xl">
            <h3 className="text-lg font-bold text-slate-500">Salary Information Unavailable</h3>
            <p className="text-slate-400 text-sm mt-1">Please contact the admin if you believe this is an error.</p>
        </div>
    );

    const { profile, salary_history } = salaryData;

    return (
        <div className="space-y-6 animate-in fade-in">
            {/* Header / Current Status */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">My Salary Portal</h2>
                        <div className="flex items-center gap-4 text-indigo-100 text-sm font-medium">
                            <span className="flex items-center gap-1"><User size={14} /> ID: {profile.employee_id || 'N/A'}</span>
                            <span className="flex items-center gap-1"><User size={14} /> Type: {profile.employee_type}</span>
                        </div>
                    </div>

                    <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/20">
                        <div className="text-xs text-indigo-100 font-bold uppercase tracking-wider mb-1">Most Recent Payment</div>
                        {salary_history.length > 0 ? (
                            <div>
                                <div className="text-2xl font-bold">₹{salary_history[0].amount}</div>
                                <div className="text-xs text-indigo-100 mt-1 flex items-center gap-1">
                                    <CheckCircle size={10} /> Paid on {new Date(salary_history[0].payment_date).toLocaleDateString()}
                                </div>
                            </div>
                        ) : (
                            <div className="text-lg font-bold opacity-75">No payments yet</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Payment History List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                        <CreditCard className="text-indigo-500" size={18} /> Payment History
                    </h3>
                </div>

                {salary_history.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {salary_history.map((payment) => (
                            <div key={payment.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg shadow-sm">
                                        ₹
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800 text-lg">
                                            {new Date(payment.year, payment.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                                        </div>
                                        <div className="text-xs text-slate-500 font-medium mt-1">
                                            Processed on {new Date(payment.payment_date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-end md:items-center gap-6 w-full md:w-auto mt-2 md:mt-0">
                                    <div className="text-right">
                                        <div className="text-sm text-slate-400 font-medium mb-0.5 uppercase text-[10px]">Net Pay</div>
                                        <div className="font-bold text-emerald-600 text-xl">₹{payment.amount}</div>
                                    </div>

                                    <div className="hidden md:block w-px h-10 bg-slate-200"></div>

                                    <div className="text-right min-w-[100px]">
                                        <div className="text-sm text-slate-400 font-medium mb-0.5 uppercase text-[10px]">Mode</div>
                                        <div className="font-bold text-slate-700 text-sm capitalize">{payment.payment_mode || 'Bank Transfer'}</div>
                                    </div>

                                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Download Slip">
                                        <Download size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                        <div className="bg-slate-50 p-4 rounded-full mb-3">
                            <DollarSign className="w-6 h-6 text-slate-300" />
                        </div>
                        <p>No payment history found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherMySalary;
