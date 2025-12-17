import React, { useState, useEffect } from 'react';
import { Check, X, Clock, Filter, User } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../api/axios';

const LeaveManagement = () => {
    const [leaves, setLeaves] = useState([]);
    const [filterStatus, setFilterStatus] = useState('Pending'); // Pending, Approved, Rejected, All
    const [filterRole, setFilterRole] = useState('All'); // All, Student, Teacher, Staff
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchLeaves();
    }, [filterStatus, filterRole]);

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/leaves?status=${filterStatus}&role=${filterRole}`);
            setLeaves(res.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load leave requests');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        if (!window.confirm(`Mark this leave as ${newStatus}?`)) return;
        try {
            await api.put(`/leaves/${id}`, { status: newStatus });
            toast.success(`Leave ${newStatus}`);
            fetchLeaves();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-700';
            case 'Rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Leave Management</h2>
                    <p className="text-slate-500">Review and manage leave requests</p>
                </div>

                <div className="flex gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                    {['Pending', 'Approved', 'Rejected', 'All'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filterStatus === status
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex gap-4 items-center">
                    <Filter size={16} className="text-slate-400" />
                    <select
                        value={filterRole}
                        onChange={e => setFilterRole(e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                        <option value="All">All Roles</option>
                        <option value="Teacher">Teachers</option>
                        <option value="Staff">Staff</option>
                        <option value="Student">Students</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Applicant</th>
                                <th className="px-6 py-4 font-semibold">Role</th>
                                <th className="px-6 py-4 font-semibold">Dates</th>
                                <th className="px-6 py-4 font-semibold">Type & Reason</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {leaves.length > 0 ? (
                                leaves.map((leave) => (
                                    <tr key={leave.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-800">{leave.applicant_name || 'Unknown'}</div>
                                            <div className="text-xs text-slate-500">ID: {leave.applicant_id_code || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                                <User size={12} /> {leave.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-700">
                                                {new Date(leave.start_date).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                to {new Date(leave.end_date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs">
                                            <div className="font-bold text-indigo-600 mb-1">{leave.leave_type}</div>
                                            <p className="text-slate-600 truncate" title={leave.reason}>{leave.reason}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(leave.status)}`}>
                                                {leave.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {leave.status === 'Pending' && (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleStatusUpdate(leave.id, 'Approved')}
                                                        className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                                        title="Approve"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(leave.id, 'Rejected')}
                                                        className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                        title="Reject"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <Clock size={48} className="text-slate-200" />
                                            <p>No leave requests found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LeaveManagement;
