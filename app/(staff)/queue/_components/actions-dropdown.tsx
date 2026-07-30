'use client'

import { useState } from 'react'

interface Props {
  isCancelled: boolean;
  onCancel: () => void;
  onRearrange: () => void;
  onRequest: () => void;
}

export default function ActionsDropdown({ isCancelled, onCancel, onRearrange, onRequest }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex-1">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full h-9 text-sm font-bold text-stone-600 bg-stone-50 border border-stone-200 rounded-lg active:scale-[0.97] transition-transform"
      >
        الإجراءات ▼
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full mb-1 left-0 right-0 bg-white border border-stone-200 rounded-xl shadow-lg z-50 overflow-hidden">
            {!isCancelled && (
              <button
                onClick={() => { setOpen(false); onCancel() }}
                className="w-full px-4 py-3 text-sm font-bold text-red-600 text-center border-b border-stone-100 active:bg-stone-50"
              >
                إلغاء
              </button>
            )}
            <button
              onClick={() => { setOpen(false); onRearrange() }}
              className="w-full px-4 py-3 text-sm font-bold text-stone-700 text-center border-b border-stone-100 active:bg-stone-50"
            >
              إعادة جدولة
            </button>
            <button
              onClick={() => { setOpen(false); onRequest() }}
              className="w-full px-4 py-3 text-sm font-bold text-stone-700 text-center active:bg-stone-50"
            >
              طلب إعادة
            </button>
          </div>
        </>
      )}
    </div>
  )
}
