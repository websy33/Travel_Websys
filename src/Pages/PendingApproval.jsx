import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { FiClock, FiShield } from 'react-icons/fi';

export default function PendingApproval() {
  const { user } = useAuth();
  const email = user?.email || '';

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-rose-50 to-sky-50">
      <div className="w-full max-w-lg bg-white border border-rose-100 shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 p-6 text-white text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <FiShield size={22} />
          </div>
          <h1 className="text-xl font-extrabold tracking-wide">Approval in Progress</h1>
          <p className="text-sm text-white/90 mt-1">Thanks for signing up! We’re reviewing your access.</p>
        </div>
        <div className="p-6 space-y-4 text-gray-700">
          {email && <p className="text-sm">Signed in as <span className="font-medium">{email}</span></p>}
          <div className="flex items-start gap-3">
            <FiClock className="mt-0.5 text-rose-600" />
            <p className="text-sm leading-relaxed">An administrator must approve your account before you can continue. You'll get access automatically once approved.</p>
          </div>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>Approvals typically complete within a few hours</li>
            <li>You can safely close this page and return later</li>
            <li>Click Refresh after you receive an approval message</li>
          </ul>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 rounded-lg bg-rose-600 text-white py-2.5 font-medium hover:bg-rose-700 transition-colors"
            >
              Refresh
            </button>
            <a
              href="mailto:support@yourdomain.com?subject=Approval%20Request"
              className="flex-1 text-center rounded-lg border border-rose-200 text-rose-700 py-2.5 font-medium hover:bg-rose-50 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
