import React, { useState, useEffect } from 'react';
import { Filter, Plus, SortAsc, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../api/axios';

const StudentManagement = ({ config, prefillData }) => {
    const [students, setStudents] = useState([]);
    const [filterClass, setFilterClass] = useState('');
    const [filterSection, setFilterSection] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const [formData, setFormData] = useState({
        admission_no: '',
        name: '',
        gender: '',
        dob: '',
        age: '',
        class_id: '',
        section_id: '',
        father_name: '',
        mother_name: '',
        contact_number: '',
        email: '',
        address: '',
        attendance_id: '',
        admission_date: new Date().toISOString().split('T')[0]
    });

    // Check for prefill data (from Admissions CRM)
    useEffect(() => {
        if (prefillData && prefillData.action === 'add_student' && prefillData.data) {
            const data = prefillData.data;

            // Find Class ID from Name
            const foundClass = config.classes?.find(c => c.class_name === data.class_name); // Note: Assuming exact name match
            const classId = foundClass ? foundClass.class_id : '';

            setFormData(prev => ({
                ...prev,
                name: data.first_name || '',
                father_name: data.guardian_name || '',
                contact_number: data.guardian_phone || '',
                email: data.email || '',
                class_id: classId,
                attendance_id: Math.floor(100000 + Math.random() * 900000).toString(),
            }));

            // Auto open modal
            setIsEditing(false);
            setShowModal(true);
        }
    }, [prefillData, config.classes]);

    // Derived sections based on selected class
    const availableSections = config.classes?.find(c => c.class_id === parseInt(filterClass))?.sections || [];
    const formSections = config.classes?.find(c => c.class_id === parseInt(formData.class_id))?.sections || [];

    // Auto-select filter section
    useEffect(() => {
        if (filterClass && availableSections.length > 0) {
            setFilterSection(availableSections[0].id);
        } else {
            setFilterSection('');
        }
    }, [filterClass]);

    useEffect(() => {
        if (filterClass || filterSection) {
            fetchStudents(); // Only fetch if filters active, or rely on initial empty fetch?
        } else {
            fetchStudents();
        }
    }, [filterClass, filterSection]);

    // Auto-calculate Age
    useEffect(() => {
        if (formData.dob) {
            const birthDate = new Date(formData.dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            setFormData(prev => ({ ...prev, age: age >= 0 ? age : 0 }));
        }
    }, [formData.dob]);

    const fetchStudents = async () => {
        try {
            const params = {};
            if (filterClass) params.class_id = filterClass;
            if (filterSection) params.section_id = filterSection;
            const res = await api.get('/students', { params });
            setStudents(res.data);
        } catch (error) {
            toast.error('Failed to load students');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;
        try {
            await api.delete(`/students/${id}`);
            toast.success('Student deleted');
            fetchStudents();
        } catch (error) {
            toast.error('Failed to delete student');
        }
    };

    const handleEdit = (student) => {
        setIsEditing(true);
        setSelectedStudent(student);
        setFormData({
            admission_no: student.admission_no || '',
            name: student.name,
            gender: student.gender || '',
            dob: student.dob ? student.dob.split('T')[0] : '',
            age: student.age || '',
            class_id: student.class_id,
            section_id: student.section_id,
            father_name: student.father_name || '',
            mother_name: student.mother_name || '',
            contact_number: student.contact_number || '',
            email: student.email || '',
            address: student.address || '',
            attendance_id: student.attendance_id || '',
            admission_date: student.admission_date ? student.admission_date.split('T')[0] : ''
        });
        setShowModal(true);
    };

    const handleAdd = () => {
        setIsEditing(false);
        setSelectedStudent(null);
        // Generate random 6 digit Attendance ID
        const autoAttendanceId = Math.floor(100000 + Math.random() * 900000).toString();

        setFormData({
            admission_no: '',
            name: '',
            gender: '',
            dob: '',
            age: '',
            class_id: filterClass || '',
            section_id: filterSection || '',
            father_name: '',
            mother_name: '',
            contact_number: '',
            email: '',
            address: '',
            attendance_id: autoAttendanceId, // Auto preset
            admission_date: new Date().toISOString().split('T')[0]
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.contact_number && !/^\d{10}$/.test(formData.contact_number)) {
            return toast.error('Mobile number must be 10 digits');
        }

        try {
            if (isEditing) {
                await api.put(`/students/${selectedStudent.id}`, formData);
                toast.success('Student updated');
            } else {
                await api.post('/students', formData);
                toast.success('Student added successfully');
            }
            setShowModal(false);
            fetchStudents();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save student');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header & Filters */}
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                        <Filter size={18} className="text-slate-400" />
                        <select
                            className="bg-transparent text-sm outline-none text-slate-700 font-bold min-w-[140px] cursor-pointer"
                            value={filterClass}
                            onChange={e => { setFilterClass(e.target.value); setFilterSection(''); }}
                        >
                            <option value="">All Classes</option>
                            {config.classes?.map(c => <option key={c.class_id} value={c.class_id}>{c.class_name}</option>)}
                        </select>
                    </div>
                    {filterClass && (
                        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors animate-in fade-in slide-in-from-left-2">
                            <span className="text-slate-300 font-light">/</span>
                            <select
                                className="bg-transparent text-sm outline-none text-slate-700 font-bold min-w-[120px] cursor-pointer"
                                value={filterSection}
                                onChange={e => setFilterSection(e.target.value)}
                            >
                                <option value="">All Sections</option>
                                {availableSections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                    )}
                </div>
                <button onClick={handleAdd} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                    <Plus size={20} /> Add Student
                </button>
            </div>

            {filterClass && filterSection && (
                <div className="flex justify-end px-2">
                    <button
                        onClick={async () => {
                            if (!window.confirm('This will reassign roll numbers alphabetically for the selected section. Continue?')) return;
                            try {
                                await api.post('/students/roll-numbers', { class_id: filterClass, section_id: filterSection });
                                toast.success('Roll numbers updated');
                                fetchStudents();
                            } catch (error) {
                                toast.error('Failed to update roll numbers');
                            }
                        }}
                        className="text-indigo-600 text-xs font-bold hover:underline mb-2 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors"
                    >
                        <SortAsc size={14} /> Re-assign Roll Numbers Alphabetically
                    </button>
                </div>
            )}

            {/* Student List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                            <tr>
                                <th className="p-4 pl-6">Roll No.</th>
                                <th className="p-4">Admission Date</th>
                                <th className="p-4">Name & ID</th>
                                <th className="p-4">Class</th>
                                <th className="p-4">Demographics</th>
                                <th className="p-4">Parents / Contact</th>
                                <th className="p-4 text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {students.map(student => (
                                <tr key={student.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 pl-6">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold font-mono text-xs border border-slate-200">
                                            {student.roll_number || '-'}
                                        </div>
                                    </td>
                                    <td className="p-4 font-mono text-slate-500 text-xs">
                                        {student.admission_date ? new Date(student.admission_date).toLocaleDateString() : (student.created_at ? new Date(student.created_at).toLocaleDateString() : '-')}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-slate-700">{student.name}</div>
                                        <div className="text-[10px] text-indigo-500 font-mono font-medium bg-indigo-50 inline-block px-1.5 py-0.5 rounded mt-0.5 border border-indigo-100">ID: {student.admission_no}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="bg-white text-slate-600 px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-200 shadow-sm">
                                            {student.class_name} - {student.section_name}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-slate-600 text-xs font-medium">{student.gender}</div>
                                        <div className="text-slate-400 text-[10px]">{student.age} Years Old</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs font-bold text-slate-700">{student.father_name}</span>
                                            <span className="text-[10px] text-slate-400">{student.mother_name}</span>
                                            <span className="text-xs text-indigo-600 font-medium">{student.contact_number}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(student)} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
                                            <button onClick={() => handleDelete(student.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {students.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center justify-center">
                                            <p className="font-medium text-slate-500 mb-1">No students found</p>
                                            <p className="text-xs">Try changing filters or add a new student.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl sticky top-0 z-10">
                            <h2 className="text-lg font-bold text-gray-800">{isEditing ? 'Edit Student' : 'Add New Student'}</h2>
                            <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4 overflow-y-auto">

                            {/* Personal Details */}
                            <div className="col-span-2">
                                <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-3">Personal Details</h3>
                            </div>
                            <div className="col-span-1">
                                <label className="label">Student ID (Format: AA1234)</label>
                                <input
                                    className="input"
                                    placeholder="Auto-generates (e.g. SC1234) if empty"
                                    value={formData.admission_no}
                                    onChange={e => setFormData({ ...formData, admission_no: e.target.value })}
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="label">Full Name</label>
                                <input className="input" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="col-span-1">
                                <label className="label">Gender</label>
                                <select className="input" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div className="col-span-1">
                                <label className="label">Date of Birth</label>
                                <input type="date" className="input" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} />
                            </div>
                            <div className="col-span-1">
                                <label className="label">Age</label>
                                <input className="input bg-gray-50" readOnly value={formData.age} placeholder="Auto-calculated" />
                            </div>
                            <div className="col-span-1">
                                <label className="label">Admission Date</label>
                                <input type="date" className="input" value={formData.admission_date} onChange={e => setFormData({ ...formData, admission_date: e.target.value })} />
                            </div>

                            {/* Academic Details */}
                            <div className="col-span-2 mt-2">
                                <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-3">Academic Details</h3>
                            </div>
                            <div className="col-span-1">
                                <label className="label">Class</label>
                                <select className="input" required value={formData.class_id} onChange={e => setFormData({ ...formData, class_id: e.target.value, section_id: '' })}>
                                    <option value="">Select Class</option>
                                    {config.classes?.map(c => <option key={c.class_id} value={c.class_id}>{c.class_name}</option>)}
                                </select>
                            </div>
                            <div className="col-span-1">
                                <label className="label">Section</label>
                                <select
                                    className="input disabled:bg-gray-100 disabled:text-gray-400"
                                    required={formSections.length > 0}
                                    value={formData.section_id}
                                    onChange={e => setFormData({ ...formData, section_id: e.target.value })}
                                    disabled={formSections.length === 0}
                                >
                                    <option value="">{formSections.length === 0 ? 'No Sections' : 'Select Section'}</option>
                                    {formSections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            {/* <div className="col-span-1">
                                <label className="label">Attendance ID (Auto)</label>
                                <input className="input bg-gray-50 font-mono text-indigo-600 font-bold" readOnly value={formData.attendance_id} />
                            </div> */}

                            {/* Guardian & Contact */}
                            <div className="col-span-2 mt-2">
                                <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-3">Guardian & Contact</h3>
                            </div>
                            <div className="col-span-1">
                                <label className="label">Father's Name</label>
                                <input className="input" required value={formData.father_name} onChange={e => setFormData({ ...formData, father_name: e.target.value })} />
                            </div>
                            <div className="col-span-1">
                                <label className="label">Mother's Name</label>
                                <input className="input" required value={formData.mother_name} onChange={e => setFormData({ ...formData, mother_name: e.target.value })} />
                            </div>
                            <div className="col-span-1">
                                <label className="label">Mobile Number</label>
                                <input
                                    className="input"
                                    type="tel"
                                    required
                                    maxLength="10"
                                    placeholder="10 Digits"
                                    value={formData.contact_number}
                                    onChange={e => {
                                        const re = /^[0-9\b]+$/;
                                        if (e.target.value === '' || re.test(e.target.value)) {
                                            setFormData({ ...formData, contact_number: e.target.value })
                                        }
                                    }}
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="label">Email Address</label>
                                <input className="input" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div className="col-span-2">
                                <label className="label">Address</label>
                                <textarea className="input" rows="2" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}></textarea>
                            </div>

                            <div className="col-span-2 flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">{isEditing ? 'Save Changes' : 'Admit Student'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentManagement;
