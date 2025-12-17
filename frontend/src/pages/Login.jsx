import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { School, ShieldCheck, User, Users, GraduationCap, Briefcase, Bus } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('SCHOOL_ADMIN');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password, role);
        if (result.success) {
            toast.success('Welcome back!');
            switch (role) {
                case 'SCHOOL_ADMIN': navigate('/school-admin'); break;
                case 'TEACHER': navigate('/teacher'); break;
                case 'STUDENT': navigate('/student'); break;
                case 'STAFF': navigate('/staff'); break;
                default: navigate('/');
            }
        } else {
            toast.error(result.message);
        }
    };

    const roles = [
        { id: 'SCHOOL_ADMIN', label: 'School Admin', icon: School },
        { id: 'TEACHER', label: 'Teacher', icon: Users },
        { id: 'STUDENT', label: 'Student', icon: GraduationCap },
        { id: 'STAFF', label: 'Staff', icon: Briefcase },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">

            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2 animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            <div className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-2xl w-full max-w-sm border border-white/20 relative z-10 transition-all duration-300 hover:shadow-indigo-500/20">
                <div className="text-center mb-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30 transform rotate-3 hover:rotate-6 transition-transform">
                        <School className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome Back</h1>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Sign in to your dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Role Selection Grid */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">Select Your Role</label>
                        <div className="grid grid-cols-2 gap-2">
                            {roles.map((r) => (
                                <button
                                    key={r.id}
                                    type="button"
                                    onClick={() => setRole(r.id)}
                                    className={`p-2 rounded-lg text-[10px] font-bold transition-all flex flex-col items-center justify-center gap-1 h-16 border
                                        ${role === r.id
                                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm transform scale-105'
                                            : 'bg-slate-50 border-transparent text-slate-400 hover:bg-white hover:border-slate-200 hover:shadow-sm'}`}
                                >
                                    <r.icon size={20} className={role === r.id ? 'text-indigo-600' : 'text-slate-400'} />
                                    {r.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">
                                {['STUDENT', 'TEACHER', 'STAFF'].includes(role) ? 'Email / Attendance ID' : 'Email Address'}
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0 outline-none transition-all font-semibold text-sm text-slate-700 placeholder:text-slate-400"
                                placeholder={['STUDENT', 'TEACHER', 'STAFF'].includes(role) ? 'e.g. STU1234 or email@school.com' : 'admin@school.com'}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0 outline-none transition-all font-semibold text-sm text-slate-700 placeholder:text-slate-400"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 rounded-xl transition-all transform active:scale-[0.98] shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 text-sm"
                    >
                        Access Portal
                    </button>

                    <p className="text-center text-[10px] text-slate-400 mt-3">
                        Having trouble? <a href="#" className="text-indigo-600 font-bold hover:underline">Contact Support</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
