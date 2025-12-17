import React, { useState, useEffect } from 'react';
import { FileText, Download, DollarSign, Calendar, CheckCircle } from 'lucide-react';
import api from '../../../api/axios';

const StaffSalarySlips = () => {
    const [slips, setSlips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSlips();
    }, []);

    const fetchSlips = async () => {
        try {
            const res = await api.get('/staff/salary/history');
            setSlips(res.data);
        } catch (error) {
            console.error("Failed to load salary slips", error);
        } finally {
            setLoading(false);
        }
    };

    const getMonthName = (m) => new Date(0, m - 1).toLocaleString('default', { month: 'long' });

    return (
        <div className="space-y-6 animate-in fade-in">
            {/* Header / Summary */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold flex items-center gap-3">
                            <DollarSign className="w-8 h-8 opacity-80" /> My Salary Slips
                        </h2>
                        <p className="text-emerald-100 mt-2 font-medium">View and download your monthly payment records.</p>
                    </div>
                    <div className="hidden md:block bg-white/20 p-4 rounded-xl backdrop-blur-sm">
                        <div className="text-xs font-bold text-emerald-100 uppercase mb-1">Last Payment</div>
                        <div className="text-2xl font-black">{slips.length > 0 ? `₹${slips[0].amount.toLocaleString()}` : '-'}</div>
                        <div className="text-xs text-emerald-200 mt-1">
                            {slips.length > 0 ? `${getMonthName(slips[0].month)} ${slips[0].year}` : 'No records'}
                        </div>
                    </div>
                </div>
                {/* Decorative Circles */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs border-b border-slate-100">
                            <tr>
                                <th className="p-5 pl-8">Month/Year</th>
                                <th className="p-5">Base Salary</th>
                                <th className="p-5">Deductions</th>
                                <th className="p-5">Net Pay</th>
                                <th className="p-5">Status</th>
                                <th className="p-5 text-right pr-8">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={6} className="p-8 text-center text-slate-400">Loading records...</td></tr>
                            ) : slips.length === 0 ? (
                                <tr><td colSpan={6} className="p-12 text-center flex flex-col items-center justify-center text-slate-400">
                                    <FileText size={48} className="mb-4 opacity-20" />
                                    No salary slips found.
                                </td></tr>
                            ) : (
                                slips.map((slip) => (
                                    <tr key={slip.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="p-5 pl-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                                                    {getMonthName(slip.month).substring(0, 3)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-700">{getMonthName(slip.month)} {slip.year}</div>
                                                    <div className="text-xs text-slate-400 font-mono">ID: #{slip.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5 font-mono text-slate-600">₹{slip.amount.toLocaleString()}</td>
                                        <td className="p-5 font-mono text-red-500">-₹0.00</td>
                                        <td className="p-5 font-mono font-bold text-emerald-700">₹{slip.amount.toLocaleString()}</td>
                                        <td className="p-5">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                <CheckCircle size={12} /> {slip.status}
                                            </span>
                                        </td>
                                        <td className="p-5 text-right pr-8">
                                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-xs font-bold rounded-lg transition-all shadow-sm">
                                                <Download size={14} /> Download PDF
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StaffSalarySlips;
