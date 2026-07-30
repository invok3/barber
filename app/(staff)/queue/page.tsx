'use client';

import { useStaff } from '@/context/providers/staff-provider';
import { useQueue } from '@/context/providers/queue-provider';
import Card from '@/app/(staff)/queue/_components/card';

export default function StaffQueuePage() {
  const { barbers } = useStaff();
  const { accepting, setAccepting, updateStatus, updateTime, getByBarber, hasCurrent: hasCurrentFn } = useQueue();
  const barber = barbers[0] ?? { id: '', name: '...', workStart: '', workEnd: '', serviceIds: [] };

  const list = getByBarber(barber.id)
    .sort((a, b) => (a.startTime > b.startTime ? 1 : -1));

  const hasCurrent = hasCurrentFn(barber.id);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-extrabold text-stone-700 text-center">
        طابور {barber.name}
      </h1>

      <div className="flex items-center justify-between bg-stone-100 rounded-2xl px-4 py-3">
        <span className="text-sm font-bold text-stone-600">قبول الطلبات</span>
        <button
          onClick={() => setAccepting((p) => !p)}
          className={`w-12 h-6 rounded-full transition-colors px-0.5 flex items-center ${
            accepting ? 'bg-stone-800 justify-start' : 'bg-stone-300 justify-end'
          }`}
        >
          <span className="w-5 h-5 bg-white rounded-full shadow" />
        </button>
      </div>

      {list.length === 0 && (
        <p className="text-center text-stone-400 py-10">لا يوجد حجوزات اليوم</p>
      )}

      <div className="space-y-3">
        {list.map((r) => (
          <Card
            key={r.id}
            reservation={r}
            hasCurrent={hasCurrent}
            onUpdateStatus={updateStatus}
            onUpdateTime={updateTime}
          />
        ))}
      </div>
    </div>
  );
}
