'use client';

import { useEffect, useMemo, useState } from 'react';

type TabName = 'overview' | 'students' | 'teachers' | 'attendance' | 'fees' | 'exams';

type Student = {
  id: number;
  name: string;
  grade: string;
  guardian: string;
  phone: string;
  status: 'Present' | 'At Risk' | 'On Track';
  attendance: number;
  tuitionDue: number;
};

type Teacher = {
  id: number;
  name: string;
  subject: string;
  className: string;
  email: string;
  rating: number;
};

type AttendanceItem = {
  className: string;
  present: number;
  total: number;
  percentage: number;
};

type FeeRecord = {
  student: string;
  amount: number;
  paid: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  dueDate: string;
};

type ExamResult = {
  student: string;
  subject: string;
  exam: string;
  score: number;
  grade: string;
};

const defaultStudents: Student[] = [
  { id: 1, name: 'Aisha Mohammed', grade: 'Grade 8-A', guardian: 'Fatima Mohammed', phone: '+234 803 412 6789', status: 'On Track', attendance: 96, tuitionDue: 0 },
  { id: 2, name: 'David Johnson', grade: 'Grade 9-B', guardian: 'Mary Johnson', phone: '+1 415 789 1234', status: 'At Risk', attendance: 78, tuitionDue: 1200 },
  { id: 3, name: 'Mina Patel', grade: 'Grade 7-C', guardian: 'Rohan Patel', phone: '+44 7700 900123', status: 'Present', attendance: 92, tuitionDue: 250 },
  { id: 4, name: 'Isaac Mensah', grade: 'Grade 10-A', guardian: 'Grace Mensah', phone: '+233 555 145 097', status: 'On Track', attendance: 94, tuitionDue: 0 },
];

const defaultTeachers: Teacher[] = [
  { id: 1, name: 'Mrs. Sarah Lee', subject: 'Mathematics', className: 'Grade 8-10', email: 'sarah.lee@school.edu', rating: 4.9 },
  { id: 2, name: 'Mr. Daniel Okafor', subject: 'Biology', className: 'Grade 7-9', email: 'daniel.okafor@school.edu', rating: 4.8 },
  { id: 3, name: 'Ms. Priya Nair', subject: 'English', className: 'Grade 6-8', email: 'priya.nair@school.edu', rating: 4.7 },
  { id: 4, name: 'Mr. Lucas Carter', subject: 'Computer Science', className: 'Grade 9-12', email: 'lucas.carter@school.edu', rating: 4.9 },
];

const defaultAttendance: AttendanceItem[] = [
  { className: 'Grade 7', present: 126, total: 140, percentage: 90 },
  { className: 'Grade 8', present: 138, total: 150, percentage: 92 },
  { className: 'Grade 9', present: 110, total: 132, percentage: 83 },
  { className: 'Grade 10', present: 118, total: 124, percentage: 95 },
];

const defaultFees: FeeRecord[] = [
  { student: 'Aisha Mohammed', amount: 2400, paid: 2400, status: 'Paid', dueDate: '2026-10-18' },
  { student: 'David Johnson', amount: 2400, paid: 1200, status: 'Pending', dueDate: '2026-10-28' },
  { student: 'Mina Patel', amount: 2200, paid: 1950, status: 'Overdue', dueDate: '2026-10-07' },
  { student: 'Isaac Mensah', amount: 2600, paid: 2600, status: 'Paid', dueDate: '2026-10-20' },
];

const defaultExams: ExamResult[] = [
  { student: 'Aisha Mohammed', subject: 'Physics', exam: 'Mid-Term', score: 92, grade: 'A' },
  { student: 'David Johnson', subject: 'Mathematics', exam: 'Mid-Term', score: 68, grade: 'C' },
  { student: 'Mina Patel', subject: 'English', exam: 'Mid-Term', score: 84, grade: 'B' },
  { student: 'Isaac Mensah', subject: 'Chemistry', exam: 'Mid-Term', score: 95, grade: 'A' },
];

const tabs: { key: TabName; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'students', label: 'Students' },
  { key: 'teachers', label: 'Teachers' },
  { key: 'attendance', label: 'Attendance' },
  { key: 'fees', label: 'Fees' },
  { key: 'exams', label: 'Exams' },
];

export default function SchoolDashboard() {
  const [activeTab, setActiveTab] = useState<TabName>('overview');
  const [students, setStudents] = useState<Student[]>(defaultStudents);
  const [teachers] = useState<Teacher[]>(defaultTeachers);
  const [attendance] = useState<AttendanceItem[]>(defaultAttendance);
  const [fees] = useState<FeeRecord[]>(defaultFees);
  const [examResults] = useState<ExamResult[]>(defaultExams);
  const [newStudent, setNewStudent] = useState({
    name: '',
    grade: 'Grade 8-A',
    guardian: '',
    phone: '',
    status: 'On Track' as Student['status'],
  });

  useEffect(() => {
    const saved = localStorage.getItem('school-dashboard-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.students) setStudents(parsed.students);
      } catch (error) {
        console.warn('Could not parse saved dashboard state', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('school-dashboard-state', JSON.stringify({ students }));
  }, [students]);

  const stats = useMemo(() => {
    const totalStudents = students.length;
    const avgAttendance = Math.round(students.reduce((sum, student) => sum + student.attendance, 0) / totalStudents);
    const feeCollected = fees.reduce((sum, fee) => sum + fee.paid, 0);
    const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
    const collectionRate = Math.round((feeCollected / totalFees) * 100);

    return {
      totalStudents,
      totalTeachers: teachers.length,
      avgAttendance,
      feeCollection: collectionRate,
    };
  }, [fees, students, teachers.length]);

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.guardian || !newStudent.phone) return;

    const id = Date.now();
    const nextStudent: Student = {
      id,
      name: newStudent.name,
      grade: newStudent.grade,
      guardian: newStudent.guardian,
      phone: newStudent.phone,
      status: newStudent.status,
      attendance: 90,
      tuitionDue: 0,
    };

    setStudents((current) => [nextStudent, ...current]);
    setNewStudent({ name: '', grade: 'Grade 8-A', guardian: '', phone: '', status: 'On Track' });
    setActiveTab('students');
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-6 rounded-3xl bg-slate-900 p-6 text-white shadow-soft lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-sky-300">School management</p>
            <h1 className="mt-2 text-3xl font-bold">Greenfield Academy</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm">
              <p className="text-slate-300">Academic year</p>
              <p className="font-semibold">2026 / 2027</p>
            </div>
            <button className="rounded-xl bg-sky-500 px-4 py-2 font-medium text-white transition hover:bg-sky-400">
              Generate report
            </button>
          </div>
        </header>

        <nav className="mb-8 flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={[
                'rounded-xl px-4 py-2 text-sm font-medium transition',
                activeTab === tab.key ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100',
              ].join(' ')}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                { label: 'Total Students', value: stats.totalStudents, delta: '+8 this term', color: 'bg-sky-500' },
                { label: 'Teachers', value: stats.totalTeachers, delta: '4 departments', color: 'bg-violet-500' },
                { label: 'Avg Attendance', value: `${stats.avgAttendance}%`, delta: '+2.4% vs last month', color: 'bg-emerald-500' },
                { label: 'Fee Collection', value: `${stats.feeCollection}%`, delta: '$84,000 collected', color: 'bg-amber-500' },
              ].map((card) => (
                <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className={`mb-4 h-2.5 w-12 rounded-full ${card.color}`} />
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <div className="mt-3 flex items-baseline justify-between">
                    <h2 className="text-3xl font-bold">{card.value}</h2>
                    <span className="text-xs text-slate-500">{card.delta}</span>
                  </div>
                </div>
              ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Class performance</h3>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">On track</span>
                </div>
                <div className="space-y-5">
                  {attendance.map((item) => (
                    <div key={item.className}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">{item.className}</span>
                        <span className="text-slate-500">{item.present}/{item.total}</span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-500" style={{ width: `${item.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold">Recent notices</h3>
                <ul className="mt-5 space-y-4">
                  {[
                    'Parent orientation session scheduled for Friday at 9:00 AM.',
                    'Science lab inventory check is due by end of week.',
                    'School bus route optimization report has been shared with admin.',
                  ].map((notice, index) => (
                    <li key={notice} className="flex gap-3 rounded-2xl bg-slate-50 p-3">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500" />
                      <p className="text-sm text-slate-700">{notice}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold">Add new student</h3>
                <span className="text-sm text-slate-500">{students.length} active records</span>
              </div>

              <div className="grid gap-4 md:grid-cols-5">
                <input
                  value={newStudent.name}
                  onChange={(e) => setNewStudent((current) => ({ ...current, name: e.target.value }))}
                  placeholder="Student name"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500"
                />
                <select
                  value={newStudent.grade}
                  onChange={(e) => setNewStudent((current) => ({ ...current, grade: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500"
                >
                  <option>Grade 7-A</option>
                  <option>Grade 8-A</option>
                  <option>Grade 9-B</option>
                  <option>Grade 10-A</option>
                </select>
                <input
                  value={newStudent.guardian}
                  onChange={(e) => setNewStudent((current) => ({ ...current, guardian: e.target.value }))}
                  placeholder="Guardian"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500"
                />
                <input
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent((current) => ({ ...current, phone: e.target.value }))}
                  placeholder="Phone number"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={handleAddStudent}
                  className="rounded-xl bg-slate-900 px-4 py-2.5 font-medium text-white transition hover:bg-slate-700"
                >
                  Save student
                </button>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {students.map((student) => (
                <article key={student.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold">{student.name}</h4>
                      <p className="text-sm text-slate-500">{student.grade}</p>
                    </div>
                    <span
                      className={[
                        'rounded-full px-2.5 py-1 text-xs font-medium',
                        student.status === 'On Track' ? 'bg-emerald-100 text-emerald-700' :
                        student.status === 'Present' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700',
                      ].join(' ')}
                    >
                      {student.status}
                    </span>
                  </div>

                  <dl className="space-y-2 text-sm text-slate-600">
                    <div className="flex justify-between"><dt>Guardian</dt><dd>{student.guardian}</dd></div>
                    <div className="flex justify-between"><dt>Phone</dt><dd>{student.phone}</dd></div>
                    <div className="flex justify-between"><dt>Attendance</dt><dd>{student.attendance}%</dd></div>
                    <div className="flex justify-between"><dt>Tuition due</dt><dd>${student.tuitionDue || 0}</dd></div>
                  </dl>
                </article>
              ))}
            </section>
          </div>
        )}

        {activeTab === 'teachers' && (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {teachers.map((teacher) => (
              <article key={teacher.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-lg font-bold text-sky-700">
                    {teacher.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                  </div>
                  <span className="text-sm font-medium text-amber-600">★ {teacher.rating}</span>
                </div>
                <h4 className="text-lg font-semibold">{teacher.name}</h4>
                <p className="mt-1 text-sm text-slate-500">{teacher.subject}</p>
                <dl className="mt-4 space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between"><dt>Class</dt><dd>{teacher.className}</dd></div>
                  <div className="flex justify-between"><dt>Email</dt><dd className="truncate">{teacher.email}</dd></div>
                </dl>
              </article>
            ))}
          </section>
        )}

        {activeTab === 'attendance' && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-xl font-semibold">Daily attendance overview</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Class</th>
                    <th className="px-4 py-3 font-medium">Present</th>
                    <th className="px-4 py-3 font-medium">Total</th>
                    <th className="px-4 py-3 font-medium">Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((row) => (
                    <tr key={row.className} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-medium text-slate-700">{row.className}</td>
                      <td className="px-4 py-3">{row.present}</td>
                      <td className="px-4 py-3">{row.total}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-2.5 w-28 overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${row.percentage}%` }} />
                          </div>
                          <span>{row.percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'fees' && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-xl font-semibold">Fee collection</h3>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {fees.map((fee) => (
                <article key={fee.student} className="rounded-2xl border border-slate-200 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-semibold">{fee.student}</h4>
                    <span
                      className={[
                        'rounded-full px-2 py-1 text-xs font-medium',
                        fee.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                        fee.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700',
                      ].join(' ')}
                    >
                      {fee.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex justify-between"><span>Amount</span><strong>${fee.amount}</strong></div>
                    <div className="flex justify-between"><span>Paid</span><strong>${fee.paid}</strong></div>
                    <div className="flex justify-between"><span>Due date</span><strong>{fee.dueDate}</strong></div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'exams' && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-xl font-semibold">Exam results</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Student</th>
                    <th className="px-4 py-3 font-medium">Subject</th>
                    <th className="px-4 py-3 font-medium">Exam</th>
                    <th className="px-4 py-3 font-medium">Score</th>
                    <th className="px-4 py-3 font-medium">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {examResults.map((exam) => (
                    <tr key={`${exam.student}-${exam.subject}`} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-medium text-slate-700">{exam.student}</td>
                      <td className="px-4 py-3">{exam.subject}</td>
                      <td className="px-4 py-3">{exam.exam}</td>
                      <td className="px-4 py-3">{exam.score}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700">{exam.grade}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
