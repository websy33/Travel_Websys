import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { FiShield, FiUserCheck, FiUserX, FiClock } from 'react-icons/fi';

export default function AdminApprovalDashboard() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
		const unsub = onSnapshot(q, (snap) => {
			const list = [];
			snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
			setUsers(list);
			setLoading(false);
		});
		return () => unsub();
	}, []);

	const toggleApproval = async (id, current) => {
		await updateDoc(doc(db, 'users', id), { approved: !current });
	};

	const setRole = async (id, role) => {
		await updateDoc(doc(db, 'users', id), { role });
	};

	if (loading) return (
		<div className="min-h-[60vh] flex items-center justify-center bg-slate-950">
			<div className="text-slate-200">Loading admin console…</div>
		</div>
	);

	return (
		<div className="min-h-screen bg-slate-950 text-slate-100">
			<div className="max-w-6xl mx-auto px-4 py-8">
				<div className="flex items-center justify-between mb-8">
					<div className="flex items-center gap-3">
						<div className="h-10 w-10 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-400/40">
							<FiShield className="text-cyan-300" />
						</div>
						<div>
							<h1 className="text-xl font-extrabold tracking-wide">Admin Approvals Console</h1>
							<p className="text-xs text-slate-400">Isolated management surface • Experimental theme</p>
						</div>
					</div>
				</div>

				<div className="grid gap-4">
					{users.map((u) => (
						<div key={u.id} className="rounded-xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
							<div className="flex items-center justify-between gap-4">
								<div className="space-y-1">
									<div className="font-semibold text-slate-100">{u.displayName || u.email}</div>
									<div className="text-xs text-slate-400">{u.email}</div>
									<div className="flex items-center gap-3 text-xs">
										<span className="px-2 py-0.5 rounded-full border border-slate-700 text-slate-300">Role: <span className="font-mono">{u.role || 'hotel'}</span></span>
										<span className={`px-2 py-0.5 rounded-full border ${u.approved ? 'border-green-600 text-green-300' : 'border-yellow-600 text-yellow-300'}`}>Status: {u.approved ? 'Approved' : 'Pending'}</span>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<button
										onClick={() => toggleApproval(u.id, u.approved)}
										className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border ${u.approved ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/20' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'}`}
									>
										{u.approved ? (<><FiUserX /> Revoke</>) : (<><FiUserCheck /> Approve</>)}
									</button>
									<select
										value={u.role || 'hotel'}
										onChange={(e) => setRole(u.id, e.target.value)}
										className="bg-slate-900/60 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200"
									>
										<option value="hotel">hotel</option>
										<option value="admin">admin</option>
									</select>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
