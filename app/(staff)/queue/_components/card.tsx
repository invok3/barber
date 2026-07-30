'use client'

import { useState } from 'react'
import { toAmPm } from '@/lib/time'
import type { Reservation } from '@/types'
import { useServices } from '@/context/providers/service-provider';
import { useStaff } from '@/context/providers/staff-provider';
import CancelModal from '@/components/modals/cancel-modal'
import RearrangeModal from '@/components/modals/rearrange-modal'
import RequestModal from '@/components/modals/request-modal'
import ActionsDropdown from '@/app/(staff)/queue/_components/actions-dropdown'

interface Props {
  reservation: Reservation;
  hasCurrent: boolean;
  onUpdateStatus: (id: string, status: Reservation['status']) => void;
  onUpdateTime: (id: string, time: string) => void;
}

type Modal = null | 'cancel' | 'rearrange' | 'request'

const STATUS: Record<string, { label: string; style: string }> = {
  'in-progress': { label: 'جاري', style: 'text-stone-800 bg-stone-100' },
  cancelled: { label: 'ملغي', style: 'text-red-700 bg-red-100' },
  completed: { label: 'منتهي', style: 'text-green-700 bg-green-100' },
}

export default function Card({ reservation: r, hasCurrent, onUpdateStatus, onUpdateTime }: Props) {
  const { services } = useServices();
  const { barbers } = useStaff();
  const [modal, setModal] = useState<Modal>(null);

  const serviceName = (id: string) => services.find((s) => s.id === id)?.name ?? id;
  const barber = barbers.find((b) => b.id === r.barberId);
  const isLive = r.status === 'confirmed';
  const isCurrent = r.status === 'in-progress';
  const isCancelled = r.status === 'cancelled';

  const closeModal = () => setModal(null);

  return (
    <>
      <div className="rounded-xl border border-stone-200 bg-white overflow-hidden">
        <div className="px-4 pt-4 pb-3 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <p className="font-bold text-stone-800 text-base leading-tight">{r.customerName}</p>
              <p className="text-xs text-stone-400" dir="ltr">{r.customerPhone}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              {STATUS[r.status] && (
                <span className={`text-[11px] font-bold rounded-full px-2.5 py-0.5 ${STATUS[r.status].style}`}>
                  {STATUS[r.status].label}
                </span>
              )}
              <p className="text-[13px] text-stone-500 font-medium">{toAmPm(r.startTime)}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {r.serviceIds.map((id) => (
              <span key={id} className="text-[11px] bg-stone-100 text-stone-600 rounded-full px-2.5 py-1">
                {serviceName(id)}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-stone-100 px-4 py-2.5 space-y-2">
          <div className="flex gap-2">
            <a href={`https://wa.me/${r.customerPhone}`} target="_blank" rel="noopener noreferrer"
              className="flex-1 h-9 flex items-center justify-center text-sm font-bold bg-green-50 text-green-700 border border-green-200 rounded-lg no-underline active:scale-[0.97] transition-transform">
              واتساب
            </a>
            <a href={`tel:${r.customerPhone}`}
              className="flex-1 h-9 flex items-center justify-center text-sm font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-lg no-underline active:scale-[0.97] transition-transform">
              اتصال
            </a>
          </div>

          {(isLive || isCurrent || isCancelled) && (
            <div className="flex gap-2">
              {isLive && (
                <button
                  onClick={() => onUpdateStatus(r.id, 'in-progress')}
                  disabled={hasCurrent}
                  className="flex-1 h-9 text-sm font-bold bg-stone-800 text-white rounded-lg active:scale-[0.97] transition-transform disabled:opacity-30"
                >
                  بدء
                </button>
              )}
              {isCurrent && (
                <button
                  onClick={() => onUpdateStatus(r.id, 'completed')}
                  className="flex-1 h-9 text-sm font-bold bg-green-600 text-white rounded-lg active:scale-[0.97] transition-transform"
                >
                  إنهاء
                </button>
              )}

              <ActionsDropdown
                isCancelled={isCancelled}
                onCancel={() => setModal('cancel')}
                onRearrange={() => setModal('rearrange')}
                onRequest={() => setModal('request')}
              />
            </div>
          )}
        </div>
      </div>

      {modal === 'cancel' && (
        <CancelModal
          customerName={r.customerName}
          onConfirm={() => { onUpdateStatus(r.id, 'cancelled'); closeModal() }}
          onClose={closeModal}
        />
      )}

      {modal === 'rearrange' && barber && (
        <RearrangeModal
          customerName={r.customerName}
          workStart={barber.workStart}
          workEnd={barber.workEnd}
          onConfirm={(hour, minute) => { onUpdateTime(r.id, `${hour}:${minute}`); closeModal() }}
          onClose={closeModal}
        />
      )}

      {modal === 'request' && (
        <RequestModal
          customerName={r.customerName}
          onConfirm={() => closeModal()}
          onClose={closeModal}
        />
      )}
    </>
  )
}
