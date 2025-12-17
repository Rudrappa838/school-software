import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, Save, Hash, Plus, Printer, Trash2, RefreshCw } from 'lucide-react';

const ExamSchedule = () => {
    // State
    const [loading, setLoading] = useState(false);
    const [examTypes, setExamTypes] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [selectedExam, setSelectedExam] = useState('');

    // Multi-select classes/sections
    const [targetClasses, setTargetClasses] = useState([]); // [{ class_id, section_id, class_name, section_name }]
    const [availableSubjects, setAvailableSubjects] = useState([]);

    // Schedule Data
    const [schedule, setSchedule] = useState([]);

    // Auto-Generate Configuration
    const [showAutoModal, setShowAutoModal] = useState(false);
    // subjectConfigs: { [subjectId]: { selected: boolean, date: string, startTime: string, endTime: string } }
    const [subjectConfigs, setSubjectConfigs] = useState({});

    // Add Exam Type Modal
    const [showAddExamModal, setShowAddExamModal] = useState(false);
    const [newExamName, setNewExamName] = useState('');

    useEffect(() => {
        fetchExamTypes();
        fetchClasses();
    }, []);

    useEffect(() => {
        if (targetClasses.length > 0) {
            fetchSubjects();
        }
    }, [targetClasses]);

    useEffect(() => {
        if (selectedExam) {
            fetchExistingSchedule();
        } else {
            setSchedule([]);
        }
    }, [selectedExam]);

    // Format time to 12-hour format
    const formatTime12Hour = (time24) => {
        if (!time24) return '';
        const [hours, minutes] = time24.split(':');
        const h = parseInt(hours);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${minutes} ${ampm}`;
    };

    const fetchExamTypes = async () => {
        try {
            const res = await api.get('/marks/exam-types');
            setExamTypes(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchClasses = async () => {
        try {
            const res = await api.get('/classes');
            setClasses(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchSections = async (classId) => {
        try {
            const res = await api.get(`/classes/${classId}/sections`);
            setSections(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchSubjects = async () => {
        // Collect all unique subjects for selected classes
        // For simplicity, we'll fetch subjects for the FIRST selected class and assume uniformity 
        // OR fetch all and deduplicate.
        if (targetClasses.length === 0) return;

        try {
            const uniqueSubjects = new Map();
            for (const target of targetClasses) {
                const res = await api.get(`/classes/${target.class_id}/sections/${target.section_id}/subjects`);
                res.data.forEach(sub => {
                    if (!uniqueSubjects.has(sub.id)) {
                        uniqueSubjects.set(sub.id, sub);
                    }
                });
            }
            setAvailableSubjects(Array.from(uniqueSubjects.values()));

            // Initialize subject configs
            const initialConfigs = {};
            Array.from(uniqueSubjects.values()).forEach(sub => {
                initialConfigs[sub.id] = {
                    selected: false,
                    date: '',
                    startTime: '09:00',
                    endTime: '12:00'
                };
            });
            setSubjectConfigs(initialConfigs);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddClass = (classId, sectionId) => {
        if (!classId || !sectionId) return;
        const cls = classes.find(c => c.id === parseInt(classId));
        // We need section name, which implies we need to fetch sections or have them
        // Let's assume sections are fetched when class is selected in a dropdown
        // Implementation detail: create a mini form for adding class
    };

    const fetchExistingSchedule = async () => {
        setLoading(true);
        try {
            const res = await api.get('/exam-schedule', {
                params: { exam_type_id: selectedExam }
            });
            // Map keys if necessary, but backend now returns matching keys
            // Need to ensure keys match state shape: id, class_id, section_id, class_name, section_name, subject_id, subject_name, exam_date, start_time, end_time
            // Backend returns: id, school_id, exam_type_id, class_id, section_id, subject_id, exam_date, start_time, end_time, created_at, subject_name, class_name, section_name
            const mapped = res.data.map(item => ({
                ...item,
                // Ensure date string is YYYY-MM-DD
                exam_date: item.exam_date.split('T')[0]
            }));
            setSchedule(mapped);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch existing schedule');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = () => {
        const selectedSubs = Object.entries(subjectConfigs)
            .filter(([_, cfg]) => cfg.selected)
            .map(([id, cfg]) => ({ id: parseInt(id), ...cfg }));

        if (selectedSubs.length === 0) {
            toast.error('Please select at least one subject');
            return;
        }

        const incomplete = selectedSubs.find(s => !s.date || !s.startTime || !s.endTime);
        if (incomplete) {
            toast.error('Please fill all date and time fields for selected subjects');
            return;
        }

        const newSchedule = [];

        selectedSubs.forEach(sub => {
            // Create schedule item for EACH target class
            targetClasses.forEach(target => {
                newSchedule.push({
                    id: Date.now() + Math.random(), // Temp ID
                    class_id: target.class_id,
                    section_id: target.section_id,
                    class_name: target.class_name,
                    section_name: target.section_name,
                    subject_id: sub.id,
                    subject_name: availableSubjects.find(s => s.id === sub.id)?.name,
                    exam_date: sub.date,
                    start_time: sub.startTime,
                    end_time: sub.endTime
                });
            });
        });

        setSchedule(newSchedule);
        setShowAutoModal(false);
        toast.success(`Generated ${newSchedule.length} schedule entries`);
    };

    const handleSave = async () => {
        if (!selectedExam) {
            toast.error('Select an exam first');
            return;
        }
        if (schedule.length === 0) return;

        setLoading(true);
        try {
            const payload = schedule.map(item => ({
                exam_type_id: parseInt(selectedExam),
                class_id: item.class_id,
                section_id: item.section_id,
                subject_id: item.subject_id,
                exam_date: item.exam_date,
                start_time: item.start_time,
                end_time: item.end_time
            }));

            await api.post('/exam-schedule/save', {
                schedules: payload,
                delete_existing: true // Overwrite for these classes
            });
            toast.success('Exam schedule saved!');
        } catch (error) {
            toast.error('Failed to save schedule');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddExamType = async () => {
        if (!newExamName.trim()) {
            toast.error('Please enter exam type name');
            return;
        }

        try {
            const res = await api.post('/marks/exam-types', {
                name: newExamName.trim(),
                max_marks: 100, // Default max marks
                weightage: 0
            });
            toast.success('Exam type added!');
            setExamTypes([...examTypes, res.data]);
            setSelectedExam(res.data.id);
            setNewExamName('');
            setShowAddExamModal(false);
        } catch (error) {
            toast.error('Failed to add exam type');
            console.error(error);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    // Helper to format Date
    const formatDate = (d) => new Date(d).toLocaleDateString();

    return (
        <div className="h-full flex flex-col space-y-4">
            {/* Header / Selection */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 print:hidden">
                <div className="flex flex-wrap items-end gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-bold text-slate-700 mb-1">Select Exam Type</label>
                        <div className="flex gap-2">
                            <select
                                value={selectedExam}
                                onChange={(e) => setSelectedExam(e.target.value)}
                                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">-- Select Exam --</option>
                                {examTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                            <button
                                onClick={() => setShowAddExamModal(true)}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-bold flex items-center gap-1"
                                title="Add New Exam Type"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Class Selector */}
                    <div className="flex-1 min-w-[300px]">
                        <label className="block text-sm font-bold text-slate-700 mb-1">Target Classes (Batch)</label>
                        <ClassMultiSelector
                            classes={classes}
                            onAdd={(cls) => setTargetClasses([...targetClasses, cls])}
                            onRemove={(idx) => setTargetClasses(targetClasses.filter((_, i) => i !== idx))}
                            selected={targetClasses}
                        />
                    </div>

                    <div className="flex gap-2 print:hidden">
                        <button
                            onClick={() => setShowAutoModal(true)}
                            disabled={!selectedExam || targetClasses.length === 0}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"
                        >
                            <RefreshCw size={18} /> Auto Generate
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={schedule.length === 0 || loading}
                            className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"
                        >
                            <Save size={18} /> Save
                        </button>
                        <button
                            onClick={handlePrint}
                            disabled={schedule.length === 0}
                            className="bg-slate-600 hover:bg-slate-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"
                        >
                            <Printer size={18} /> Download
                        </button>
                    </div>
                </div>
            </div>

            {/* Schedule View */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col print:shadow-none print:border-none">

                {/* Print Header */}
                <div className="hidden print:block text-center mb-6 pt-4">
                    <h1 className="text-2xl font-bold uppercase tracking-wider text-black">Exam Schedule</h1>
                    {selectedExam && (
                        <h2 className="text-xl font-semibold mt-2 text-black">
                            {examTypes.find(t => t.id === parseInt(selectedExam))?.name}
                        </h2>
                    )}
                </div>

                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 print:hidden">
                    <h3 className="font-bold text-slate-700">Exam Schedule Preview</h3>
                    <div className="text-sm text-slate-500">
                        {targetClasses.length > 0 ? (
                            <span>Showing {schedule.filter(s => targetClasses.some(t => t.class_id == s.class_id && t.section_id == s.section_id)).length} filtered entries</span>
                        ) : (
                            <span>{schedule.length} entries</span>
                        )}
                    </div>
                </div>

                <div className="overflow-auto flex-1 p-0">
                    {/* Screen View Table */}
                    <table className="w-full text-sm text-left print:hidden">
                        <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0">
                            <tr>
                                <th className="p-3 border-b">Class</th>
                                <th className="p-3 border-b">Date</th>
                                <th className="p-3 border-b">Time</th>
                                <th className="p-3 border-b">Subject</th>
                                <th className="p-3 border-b print:hidden">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {(targetClasses.length > 0
                                ? schedule.filter(s => targetClasses.some(t => t.class_id == s.class_id && t.section_id == s.section_id))
                                : schedule
                            ).map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 print:hover:bg-transparent">
                                    <td className="p-3 font-medium text-indigo-600 print:text-black">{item.class_name} - {item.section_name}</td>
                                    <td className="p-3">
                                        <div className="print:hidden">
                                            <input
                                                type="date"
                                                value={item.exam_date}
                                                onChange={(e) => {
                                                    setSchedule(prev => prev.map(s =>
                                                        s.id === item.id ? { ...s, exam_date: e.target.value } : s
                                                    ));
                                                }}
                                                className="border rounded px-2 py-1"
                                            />
                                        </div>
                                        <div className="hidden print:block">
                                            {formatDate(item.exam_date)}
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex flex-col gap-1 print:hidden">
                                            <div className="flex items-center gap-1">
                                                <input
                                                    type="time"
                                                    value={item.start_time}
                                                    onChange={(e) => {
                                                        setSchedule(prev => prev.map(s =>
                                                            s.id === item.id ? { ...s, start_time: e.target.value } : s
                                                        ));
                                                    }}
                                                    className="border rounded px-2 py-1 w-24 text-xs"
                                                />
                                                <span className="text-xs text-slate-500">
                                                    ({formatTime12Hour(item.start_time)})
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <input
                                                    type="time"
                                                    value={item.end_time}
                                                    onChange={(e) => {
                                                        setSchedule(prev => prev.map(s =>
                                                            s.id === item.id ? { ...s, end_time: e.target.value } : s
                                                        ));
                                                    }}
                                                    className="border rounded px-2 py-1 w-24 text-xs"
                                                />
                                                <span className="text-xs text-slate-500">
                                                    ({formatTime12Hour(item.end_time)})
                                                </span>
                                            </div>
                                        </div>
                                        <div className="hidden print:block">
                                            {formatTime12Hour(item.start_time)} - {formatTime12Hour(item.end_time)}
                                        </div>
                                    </td>
                                    <td className="p-3 font-bold">{item.subject_name}</td>
                                    <td className="p-3 print:hidden">
                                        <button onClick={() => setSchedule(prev => prev.filter(s => s.id !== item.id))} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {schedule.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-400">
                                        No schedule generated. Use Auto Generate to start.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Print View (Grouped by Class) */}
                    <div className="hidden print:block p-4">
                        {Object.values((targetClasses.length > 0
                            ? schedule.filter(s => targetClasses.some(t => t.class_id === s.class_id && t.section_id === s.section_id))
                            : schedule
                        ).reduce((acc, item) => {
                            const key = `${item.class_id}-${item.section_id}`;
                            if (!acc[key]) {
                                acc[key] = {
                                    className: item.class_name,
                                    sectionName: item.section_name,
                                    items: []
                                };
                            }
                            acc[key].items.push(item);
                            return acc;
                        }, {})).map((group, idx) => (
                            <div key={idx} className="mb-8 break-inside-avoid">
                                <h3 className="text-lg font-bold mb-2 border-b-2 border-slate-800 pb-1 text-black">
                                    Class: {group.className} - {group.sectionName}
                                </h3>
                                <table className="w-full text-sm text-left mb-4">
                                    <thead>
                                        <tr className="border-b border-slate-400">
                                            <th className="py-2 font-semibold text-black">Date</th>
                                            <th className="py-2 font-semibold text-black">Time</th>
                                            <th className="py-2 font-semibold text-black">Subject</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {group.items.sort((a, b) => new Date(a.exam_date) - new Date(b.exam_date)).map(item => (
                                            <tr key={item.id}>
                                                <td className="py-2 text-black">{formatDate(item.exam_date)}</td>
                                                <td className="py-2 text-black">
                                                    {formatTime12Hour(item.start_time)} - {formatTime12Hour(item.end_time)}
                                                </td>
                                                <td className="py-2 font-bold text-black">{item.subject_name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Auto Generate Modal */}
            {
                showAutoModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
                            <div className="px-6 py-4 border-b border-slate-200">
                                <h3 className="font-bold text-lg">Configure Exam Schedule</h3>
                                <p className="text-sm text-slate-500">Select subjects and set their exam date and timing</p>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 z-10">
                                        <tr>
                                            <th className="p-3 border-b w-10">
                                                <input
                                                    type="checkbox"
                                                    onChange={(e) => {
                                                        const newConfigs = { ...subjectConfigs };
                                                        Object.keys(newConfigs).forEach(id => {
                                                            newConfigs[id].selected = e.target.checked;
                                                        });
                                                        setSubjectConfigs(newConfigs);
                                                    }}
                                                />
                                            </th>
                                            <th className="p-3 border-b">Subject</th>
                                            <th className="p-3 border-b">Exam Date</th>
                                            <th className="p-3 border-b">Start Time</th>
                                            <th className="p-3 border-b">End Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {availableSubjects.map(sub => {
                                            const cfg = subjectConfigs[sub.id] || { selected: false, date: '', startTime: '09:00', endTime: '12:00' };
                                            return (
                                                <tr key={sub.id} className={cfg.selected ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}>
                                                    <td className="p-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={cfg.selected}
                                                            onChange={(e) => {
                                                                setSubjectConfigs({
                                                                    ...subjectConfigs,
                                                                    [sub.id]: { ...cfg, selected: e.target.checked }
                                                                });
                                                            }}
                                                            className="w-4 h-4 text-indigo-600 rounded"
                                                        />
                                                    </td>
                                                    <td className="p-3 font-medium">{sub.name}</td>
                                                    <td className="p-3">
                                                        <input
                                                            type="date"
                                                            disabled={!cfg.selected}
                                                            value={cfg.date}
                                                            onChange={(e) => setSubjectConfigs({
                                                                ...subjectConfigs,
                                                                [sub.id]: { ...cfg, date: e.target.value }
                                                            })}
                                                            className="border rounded px-2 py-1 w-full disabled:opacity-50 disabled:bg-slate-100"
                                                        />
                                                    </td>
                                                    <td className="p-3">
                                                        <input
                                                            type="time"
                                                            disabled={!cfg.selected}
                                                            value={cfg.startTime}
                                                            onChange={(e) => setSubjectConfigs({
                                                                ...subjectConfigs,
                                                                [sub.id]: { ...cfg, startTime: e.target.value }
                                                            })}
                                                            className="border rounded px-2 py-1 w-full disabled:opacity-50 disabled:bg-slate-100"
                                                        />
                                                    </td>
                                                    <td className="p-3">
                                                        <input
                                                            type="time"
                                                            disabled={!cfg.selected}
                                                            value={cfg.endTime}
                                                            onChange={(e) => setSubjectConfigs({
                                                                ...subjectConfigs,
                                                                [sub.id]: { ...cfg, endTime: e.target.value }
                                                            })}
                                                            className="border rounded px-2 py-1 w-full disabled:opacity-50 disabled:bg-slate-100"
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {availableSubjects.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="p-8 text-center text-slate-400">
                                                    No subjects found. Please select classes first.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-6 border-t border-slate-200 flex justify-end gap-2 bg-slate-50 rounded-b-xl">
                                <button onClick={() => setShowAutoModal(false)} className="text-slate-600 hover:bg-slate-200 px-4 py-2 rounded font-bold">Cancel</button>
                                <button onClick={handleGenerate} className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded font-bold">Generate Schedule</button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Add Exam Type Modal */}
            {
                showAddExamModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                            <div className="px-6 py-4 border-b border-slate-200">
                                <h3 className="font-bold text-lg">Add New Exam Type</h3>
                            </div>
                            <div className="p-6">
                                <label className="block text-sm font-bold mb-2">Exam Type Name</label>
                                <input
                                    type="text"
                                    value={newExamName}
                                    onChange={(e) => setNewExamName(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddExamType()}
                                    placeholder="e.g., Midterm, Final, Quiz"
                                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                                    autoFocus
                                />
                            </div>
                            <div className="p-6 border-t border-slate-200 flex justify-end gap-2 bg-slate-50 rounded-b-xl">
                                <button
                                    onClick={() => {
                                        setShowAddExamModal(false);
                                        setNewExamName('');
                                    }}
                                    className="text-slate-600 hover:bg-slate-200 px-4 py-2 rounded font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddExamType}
                                    className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded font-bold"
                                >
                                    Add Exam Type
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

// Subcomponent for Class Multi-Select
const ClassMultiSelector = ({ classes, onAdd, onRemove, selected }) => {
    const [selClass, setSelClass] = useState('');
    const [selSection, setSelSection] = useState('');
    const [sections, setSections] = useState([]);

    useEffect(() => {
        if (selClass) {
            // Fetch sections using api
            api.get(`/classes/${selClass}/sections`).then(res => setSections(res.data)).catch(console.error);
        } else {
            setSections([]);
        }
    }, [selClass]);

    const handleAdd = () => {
        if (!selClass || !selSection) return;

        // Prevent duplicates
        if (selected.some(s => s.class_id === parseInt(selClass) && s.section_id === parseInt(selSection))) {
            toast.error('Class already added');
            return;
        }

        const cls = classes.find(c => c.id === parseInt(selClass));
        const sec = sections.find(s => s.id === parseInt(selSection));

        onAdd({
            class_id: parseInt(selClass),
            section_id: parseInt(selSection),
            class_name: cls?.name,
            section_name: sec?.name
        });
        setSelSection('');
    };

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <select value={selClass} onChange={e => setSelClass(e.target.value)} className="w-1/3 px-2 py-1 text-sm border rounded">
                    <option value="">Class</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select value={selSection} onChange={e => setSelSection(e.target.value)} className="w-1/3 px-2 py-1 text-sm border rounded" disabled={!selClass}>
                    <option value="">Section</option>
                    {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <button onClick={handleAdd} disabled={!selSection} className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-2 py-1 rounded text-sm font-bold">
                    <Plus size={16} /> Add
                </button>
            </div>

            {/* Chips */}
            <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                {selected.map((item, idx) => (
                    <div key={idx} className="bg-slate-100 border border-slate-300 rounded-full px-3 py-1 text-xs flex items-center gap-1 font-bold text-slate-700">
                        {item.class_name} {item.section_name}
                        <button onClick={() => onRemove(idx)} className="hover:text-red-500"><Trash2 size={12} /></button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ExamSchedule;
