import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from 'firebase/firestore';

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

	if (loading) return <div className="p-6">Loading...</div>;

	return (
		<div className="p-6 max-w-5xl mx-auto">
			<h1 className="text-2xl font-bold mb-4">User Approvals</h1>
			<div className="grid gap-4">
				{users.map((u) => (
					<div key={u.id} className="border rounded p-4 flex items-center justify-between">
						<div>
							<div className="font-semibold">{u.displayName || u.email}</div>
							<div className="text-sm text-gray-600">{u.email}</div>
							<div className="text-sm">Role: <span className="font-mono">{u.role || 'hotel'}</span></div>
							<div className="text-sm">Approved: {u.approved ? 'Yes' : 'No'}</div>
						</div>
						<div className="flex items-center gap-2">
							<button onClick={() => toggleApproval(u.id, u.approved)} className={`px-3 py-1 rounded ${u.approved ? 'bg-yellow-500 text-white' : 'bg-green-600 text-white'}`}>
								{u.approved ? 'Revoke' : 'Approve'}
							</button>
							<select value={u.role || 'hotel'} onChange={(e) => setRole(u.id, e.target.value)} className="border p-1 rounded">
								<option value="hotel">hotel</option>
								<option value="admin">admin</option>
							</select>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
