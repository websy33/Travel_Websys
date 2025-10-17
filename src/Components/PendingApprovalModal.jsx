import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShield, FiClock, FiX } from 'react-icons/fi';

export default function PendingApprovalModal({ open, email, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div className="relative">
              <div className="absolute right-3 top-3">
                <button onClick={onClose} aria-label="Close" className="p-2 rounded-full hover:bg-gray-100">
                  <FiX className="text-gray-500" size={18} />
                </button>
              </div>
              <div className="bg-gradient-to-r from-rose-600 to-pink-600 px-6 py-8 text-white text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                  <FiShield size={22} />
                </div>
                <h3 className="text-xl font-bold">Approval Required</h3>
                <p className="mt-1 text-white/90 text-sm">Your account is pending admin review</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {email && (
                <div className="text-sm text-gray-700">
                  Signed in as <span className="font-medium">{email}</span>
                </div>
              )}
              <div className="flex items-start gap-3 text-gray-700">
                <FiClock className="mt-0.5 text-rose-600" />
                <p className="text-sm leading-relaxed">
                  An administrator needs to approve your access before you can continue. You’ll receive an update soon.
                </p>
              </div>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Keep this page open or come back later</li>
                <li>If urgent, contact support for faster approval</li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="w-full rounded-lg bg-rose-600 text-white py-2.5 font-medium hover:bg-rose-700 transition-colors"
                >
                  Got it
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
