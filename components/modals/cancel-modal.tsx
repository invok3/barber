'use client'

import { useState } from 'react'

interface Props {
  customerName: string;
  onConfirm: (reason: string) => void;
  onClose: () => void;
}

export default function CancelModal({ customerName, onConfirm, onClose }: Props) {
  const [reason, setReason] = useState('');

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-screen landscape:w-[50vh] max-w-[50vh] mx-4 p-6 space-y-4">
        <p className="text-lg font-bold text-stone-700 text-center">إلغاء الحجز</p>
        <p className="text-sm text-stone-500 text-center">{customerName}</p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="اذكر سبب الإلغاء..."
          rows={3}
          className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-stone-400"
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-stone-200 rounded-xl text-sm font-medium text-stone-600">
            تراجع
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={!reason}
            className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-bold disabled:opacity-40"
          >
            تأكيد الإلغاء
          </button>
        </div>
      </div>
    </div>
  )
}
