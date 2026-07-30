'use client'

import { useState } from 'react'
import { toAmPm } from '@/lib/time'
import { useStaff } from '@/context/providers/staff-provider';
import CancelModal from '@/components/modals/cancel-modal'
import RearrangeModal from '@/components/modals/rearrange-modal'

interface MyReservation {
  id: string;
  barberId: string;
  barberName: string;
  startTime: string;
  endTime: string;
  serviceNames: string[];
}

const mockReservation: MyReservation = {
  id: 'res-1',
  barberId: 'barber-1',
  barberName: 'ياسر',
  startTime: '10:30',
  endTime: '11:00',
  serviceNames: ['قصة شعر'],
}

type Modal = null | 'cancel' | 'rearrange'

export default function QueuePage() {
  const { barbers } = useStaff();
  const [reservation, setReservation] = useState<MyReservation | null>(mockReservation);
  const [modal, setModal] = useState<Modal>(null);

  const closeModal = () => setModal(null);

  const barber = reservation ? barbers.find((b) => b.id === reservation.barberId) : undefined;

  if (!reservation) {
    return (
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-extrabold text-stone-700 text-center">
          حالة الدور
        </h1>
        <p className="text-center text-stone-400 py-10">ليس لديك حجز حالياً</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-extrabold text-stone-700 text-center">
        حالة الدور
      </h1>

      <div className="bg-stone-800 text-neutral-100 rounded-2xl p-6 text-center space-y-3">
        <p className="text-sm text-neutral-400">موعدك</p>
        <p className="text-3xl font-extrabold">{toAmPm(reservation.startTime)}</p>
        <p className="text-sm text-neutral-300">عند {reservation.barberName}</p>
        <p className="text-xs text-neutral-400">
          {reservation.serviceNames.join(' - ')}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setModal('cancel')}
          className="flex-1 py-3 border border-red-300 text-red-600 rounded-xl text-sm font-bold active:scale-[0.97] transition-transform"
        >
          إلغاء
        </button>
        <button
          onClick={() => setModal('rearrange')}
          className="flex-1 py-3 border border-stone-300 text-stone-700 rounded-xl text-sm font-bold active:scale-[0.97] transition-transform"
        >
          إعادة جدولة
        </button>
      </div>

      {modal === 'cancel' && (
        <CancelModal
          customerName={reservation.barberName}
          onConfirm={() => { setReservation(null); closeModal() }}
          onClose={closeModal}
        />
      )}

      {modal === 'rearrange' && barber && (
        <RearrangeModal
          customerName={reservation.barberName}
          workStart={barber.workStart}
          workEnd={barber.workEnd}
          onConfirm={(hour, minute) => {
            setReservation((prev) =>
              prev ? { ...prev, startTime: `${hour}:${minute}` } : prev
            )
            closeModal()
          }}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
