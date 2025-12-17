import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, Download, CheckCircle, Clock, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../api/axios';

const SalaryManagement = () => {
    const [salaryData, setSalaryData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [filterType, setFilterType] = useState('all'); // 'all', 'teacher', 'staff'
    const [paymentFilter, setPaymentFilter] = useState('all'); // 'all', 'paid', 'unpaid'
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [paymentData, setPaymentData] = useState({
        payment_mode: 'Cash',
        notes: ''
    });

    useEffect(() => {
        fetchSalaryData();
    }, [selectedMonth, selectedYear]);

    const fetchSalaryData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/salary/overview?month=${selectedMonth}&year=${selectedYear}`);
            setSalaryData(res.data);
        } catch (error) {
            toast.error('Failed to load salary data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkPaid = async () => {
        if (!selectedEmployee) return;

        try {
            await api.post('/salary/mark-paid', {
                employee_id: selectedEmployee.id,
                employee_type: selectedEmployee.type,
                month: selectedMonth,
                year: selectedYear,
                amount: selectedEmployee.calculated_salary,
                payment_mode: paymentData.payment_mode,
                notes: paymentData.notes
            });

            toast.success(`Salary marked as paid for ${selectedEmployee.name}`);
            setShowPaymentModal(false);
            setSelectedEmployee(null);
            setPaymentData({ payment_mode: 'Cash', notes: '' });
            fetchSalaryData();
        } catch (error) {
            toast.error('Failed to mark salary as paid');
            console.error(error);
        }
    };

    const filteredData = salaryData.filter(emp => {
        // Type filter
        if (filterType !== 'all' && emp.type.toLowerCase() !== filterType) return false;

        // Payment filter
        if (paymentFilter === 'paid' && !emp.is_paid) return false;
        if (paymentFilter === 'unpaid' && emp.is_paid) return false;

        return true;
    });

    const totalSalary = filteredData.reduce((sum, emp) => sum + parseFloat(emp.calculated_salary || 0), 0);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    return (
        <div className="space-y-6 animate-in fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <DollarSign size={28} />
                            Salary Management
                        </h2>
                        <p className="text-emerald-50 mt-1">Manage monthly salaries for Teachers and Staff</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 text-center">
                        <div className="text-emerald-50 text-xs uppercase tracking-wide">Total Payable</div>
                        <div className="text-3xl font-bold mt-1">₹{totalSalary.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <Calendar size={18} className="text-slate-500" />
                        <span className="font-semibold text-slate-700">Period:</span>
                    </div>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        className="px-4 py-2 border border-slate-300 rounded-lg font-medium text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                        {months.map((month, idx) => (
                            <option key={idx} value={idx + 1}>{month}</option>
                        ))}
                    </select>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="px-4 py-2 border border-slate-300 rounded-lg font-medium text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>

                    <div className="ml-auto flex gap-6 items-center">
                        <div className="flex gap-2">
                            {['all', 'teacher', 'staff'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all capitalize ${filterType === type
                                        ? 'bg-emerald-600 text-white shadow-md'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                        <div className="h-6 w-px bg-slate-300"></div>
                        <div className="flex gap-2">
                            {[
                                { key: 'all', label: 'All' },
                                { key: 'paid', label: 'Paid' },
                                { key: 'unpaid', label: 'Unpaid' }
                            ].map(filter => (
                                <button
                                    key={filter.key}
                                    onClick={() => setPaymentFilter(filter.key)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${paymentFilter === filter.key
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
                                        }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Salary Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-400">
                        <Clock size={48} className="mx-auto mb-4 animate-spin opacity-50" />
                        <p>Loading salary data...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-slate-100">
                                <tr>
                                    <th className="p-4 pl-6">Employee</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4">Role/Subject</th>
                                    <th className="p-4">Rate/Day</th>
                                    <th className="p-4">Present</th>
                                    <th className="p-4">Absent</th>
                                    <th className="p-4">Leave</th>
                                    <th className="p-4">Calculated Salary</th>
                                    <th className="p-4 text-right pr-6">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredData.map(emp => (
                                    <tr key={`${emp.type}-${emp.id}`} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 pl-6">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-700">{emp.name}</span>
                                                    {emp.is_paid && (
                                                        <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                                            <CheckCircle size={10} /> PAID
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-slate-400 font-mono">{emp.employee_id || '-'}</div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-lg text-xs font-bold ${emp.type === 'Teacher' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'
                                                }`}>
                                                {emp.type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-600">{emp.role || '-'}</td>
                                        <td className="p-4 font-semibold text-slate-700">₹{emp.salary_per_day || 0}</td>
                                        <td className="p-4">
                                            <span className="bg-green-50 text-green-700 px-2 py-1 rounded-lg font-bold text-xs">
                                                {emp.days_present || 0}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-red-50 text-red-700 px-2 py-1 rounded-lg font-bold text-xs">
                                                {emp.days_absent || 0}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg font-bold text-xs">
                                                {emp.days_leave || 0}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-lg text-emerald-600">
                                                ₹{parseFloat(emp.calculated_salary || 0).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                            {emp.is_paid ? (
                                                <div className="text-right">
                                                    <div className="text-xs text-slate-500 mb-1">Paid on</div>
                                                    <div className="text-xs font-bold text-emerald-600">
                                                        {new Date(emp.payment_date).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-[10px] text-slate-400">{emp.payment_mode}</div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setSelectedEmployee(emp);
                                                        setShowPaymentModal(true);
                                                    }}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ml-auto"
                                                >
                                                    <CheckCircle size={14} />
                                                    Mark Paid
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredData.length === 0 && (
                                    <tr>
                                        <td colSpan={9} className="p-12 text-center text-slate-400">
                                            No salary data found for the selected period.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Payment Modal */}
            {showPaymentModal && selectedEmployee && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 bg-emerald-50">
                            <h3 className="text-lg font-bold text-emerald-900">Mark Salary as Paid</h3>
                            <p className="text-sm text-emerald-700 mt-1">{selectedEmployee.name}</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="bg-slate-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-slate-600">Period</span>
                                    <span className="font-bold text-slate-800">{months[selectedMonth - 1]} {selectedYear}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-slate-600">Days Present</span>
                                    <span className="font-bold text-emerald-600">{selectedEmployee.days_present} days</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-slate-600">Rate per Day</span>
                                    <span className="font-bold text-slate-800">₹{selectedEmployee.salary_per_day}</span>
                                </div>
                                <div className="border-t border-slate-200 mt-3 pt-3 flex justify-between items-center">
                                    <span className="font-bold text-slate-700">Total Amount</span>
                                    <span className="text-2xl font-bold text-emerald-600">
                                        ₹{parseFloat(selectedEmployee.calculated_salary || 0).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Payment Mode</label>
                                <select
                                    value={paymentData.payment_mode}
                                    onChange={(e) => setPaymentData({ ...paymentData, payment_mode: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Cheque">Cheque</option>
                                    <option value="UPI">UPI</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Notes (Optional)</label>
                                <textarea
                                    value={paymentData.notes}
                                    onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    rows="3"
                                    placeholder="Add any notes..."
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => {
                                        setShowPaymentModal(false);
                                        setSelectedEmployee(null);
                                        setPaymentData({ payment_mode: 'Cash', notes: '' });
                                    }}
                                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleMarkPaid}
                                    className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                                >
                                    <CheckCircle size={18} />
                                    Confirm Payment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalaryManagement;
