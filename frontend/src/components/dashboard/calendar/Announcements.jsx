import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, Tag, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../api/axios';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [targetRole, setTargetRole] = useState('All');
    const [priority, setPriority] = useState('Normal');
    const [validUntil, setValidUntil] = useState('');

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const res = await api.get('/calendar/announcements');
            setAnnouncements(res.data);
        } catch (error) {
            toast.error('Failed to load announcements');
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await api.post('/calendar/announcements', {
                title,
                message,
                target_role: targetRole,
                priority,
                valid_until: validUntil || null
            });
            toast.success('Announcement posted!');
            setTitle('');
            setMessage('');
            setValidUntil('');
            fetchAnnouncements();
        } catch (error) {
            toast.error('Failed to post announcement');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this announcement?')) return;
        try {
            await api.delete(`/calendar/announcements/${id}`);
            toast.success('Deleted');
            fetchAnnouncements();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
            {/* Form Section */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
                    <h3 className="font-bold text-lg mb-4 text-slate-800 flex items-center gap-2">
                        <Plus size={20} className="text-indigo-600" /> New Announcement
                    </h3>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
                            <input
                                required
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                placeholder="Important Notice"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Message</label>
                            <textarea
                                required
                                rows="4"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                placeholder="Details..."
                            ></textarea>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Audience</label>
                                <select
                                    value={targetRole}
                                    onChange={e => setTargetRole(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                >
                                    <option value="All">Everyone</option>
                                    <option value="Student">Students</option>
                                    <option value="Teacher">Teachers</option>
                                    <option value="Staff">Staff</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Priority</label>
                                <select
                                    value={priority}
                                    onChange={e => setPriority(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                >
                                    <option value="Normal">Normal</option>
                                    <option value="High">High</option>
                                    <option value="Urgent">Urgent</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Valid Until (Optional)</label>
                            <input
                                type="date"
                                value={validUntil}
                                onChange={e => setValidUntil(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                            />
                        </div>
                        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-bold transition-colors">
                            Post Announcement
                        </button>
                    </form>
                </div>
            </div>

            {/* List Section */}
            <div className="lg:col-span-2 space-y-4">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <Bell size={20} className="text-indigo-600" /> Active Announcements
                </h3>

                {announcements.length === 0 ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center text-slate-400">
                        No active announcements.
                    </div>
                ) : (
                    announcements.map(item => (
                        <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-200 transition-colors group relative">
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 size={18} />
                            </button>

                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-lg text-slate-800">{item.title}</h4>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${item.priority === 'Urgent' ? 'bg-red-100 text-red-600' :
                                    item.priority === 'High' ? 'bg-orange-100 text-orange-600' :
                                        'bg-blue-100 text-blue-600'
                                    }`}>
                                    {item.priority}
                                </span>
                            </div>

                            <p className="text-slate-600 mb-4 whitespace-pre-wrap">{item.message}</p>

                            <div className="flex items-center gap-4 text-xs text-slate-400 border-t border-slate-100 pt-3">
                                <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                                    <Tag size={12} /> Target: {item.target_role}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock size={12} /> Posted: {new Date(item.created_at).toLocaleDateString()}
                                </span>
                                {item.valid_until && (
                                    <span className="flex items-center gap-1 text-orange-400">
                                        Valid until: {new Date(item.valid_until).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Announcements;
