'use client'

import { useState, useMemo, useCallback } from 'react'
import { toMinutes, fmt24, toAmPm, hourLabel } from '@/lib/time'
import { useStaff } from '@/context/providers/staff-provider';
import { useServices } from '@/context/providers/service-provider';

type TimeMode = 'asap' | 'pick' | null

const toggleStyle = (on: boolean) =>
  on ? 'bg-stone-800 text-neutral-100' : 'border border-stone-200 text-stone-700';

const btnBase = 'active:scale-[0.97] transition-transform';
const counterBtn = `w-8 h-8 rounded-full text-lg font-bold flex items-center justify-center ${btnBase}`;

export default function ReservePage() {
  const { barbers } = useStaff();
  const { services } = useServices();
  const [peopleCount, setPeopleCount] = useState(1);
  const [serviceCounts, setServiceCounts] = useState<Record<string, number>>({});
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);
  const [availability, setAvailability] = useState<{ queueEndTime: string; workEnd: string } | null>(null);
  const [loadingQueue, setLoadingQueue] = useState(false);
  const [timeMode, setTimeMode] = useState<TimeMode>(null);
  const [pickedHour, setPickedHour] = useState('');
  const [pickedMinute, setPickedMinute] = useState('');

  const selectedBarber = barbers.find((b) => b.id === selectedBarberId);
  const barberServices = useMemo(
    () => services.filter((s) => selectedBarber?.serviceIds.includes(s.id)),
    [selectedBarber, services]
  );

  const validSlots = useMemo(() => {
    if (!availability) return [];
    const end = toMinutes(availability.workEnd);
    const start = Math.ceil(toMinutes(availability.queueEndTime) / 30) * 30;
    const slots: string[] = [];
    for (let m = start; m <= end; m += 30) slots.push(fmt24(m));
    return slots;
  }, [availability]);

  const hourOptions = useMemo(() => {
    const hours = new Set(validSlots.map((s) => s.split(':')[0]));
    return Array.from(hours).sort();
  }, [validSlots]);

  const minuteOptions = useMemo(() => {
    if (!pickedHour) return [];
    const mins = new Set(validSlots.filter((s) => s.startsWith(pickedHour)).map((s) => s.split(':')[1]));
    return Array.from(mins).sort();
  }, [validSlots, pickedHour]);

  const hasServices = Object.values(serviceCounts).some((c) => c > 0);
  const pickedTime = pickedHour && pickedMinute ? `${pickedHour}:${pickedMinute}` : '';

  const handleSelectBarber = useCallback((id: string | null) => {
    setSelectedBarberId(id);
    setAvailability(null);
    setTimeMode(null);
    setPickedHour('');
    if (!id) return;

    setLoadingQueue(true);
    const barber = barbers.find((b) => b.id === id);
    if (!barber) { setLoadingQueue(false); return; }

    setServiceCounts((prev) => {
      const next = { ...prev };
      for (const sid of Object.keys(next)) {
        if (!barber.serviceIds.includes(sid)) delete next[sid];
      }
      return next;
    });

    fetch(`/api/queue/status?barber=${encodeURIComponent(barber.name)}`)
      .then((r) => r.json())
      .then((data) => setAvailability(data))
      .finally(() => setLoadingQueue(false));
  }, [barbers]);

  const adjustService = (serviceId: string, delta: number) => {
    setServiceCounts((prev) => {
      const current = prev[serviceId] ?? 0;
      const next = Math.max(0, Math.min(peopleCount, current + delta));
      if (next === 0) { const copy = { ...prev }; delete copy[serviceId]; return copy; }
      return { ...prev, [serviceId]: next };
    });
  };

  const serviceRow = (service: { id: string; name: string }) => {
    const count = serviceCounts[service.id] ?? 0;
    const isSelected = count > 0;
    const isMulti = peopleCount > 1;

    const toggle = () => adjustService(service.id, isSelected ? -count : 1);

    return (
      <div key={service.id}
        onClick={toggle}
        className={`flex items-center justify-between rounded-xl px-4 py-3 ${btnBase} cursor-pointer ${toggleStyle(isSelected)}`}>
        <span className="text-sm font-medium">{service.name}</span>

        {isMulti && isSelected && (
          <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => adjustService(service.id, 1)} disabled={count >= peopleCount}
              className="w-7 h-7 rounded-full bg-stone-700 text-neutral-200 text-sm font-bold flex items-center justify-center disabled:opacity-30 active:scale-[0.9] transition-transform">+</button>
            <span className="text-sm font-bold w-4 text-center">{count}</span>
            <button onClick={() => adjustService(service.id, -1)} disabled={count <= 1}
              className="w-7 h-7 rounded-full bg-stone-700 text-neutral-200 text-sm font-bold flex items-center justify-center disabled:opacity-30 active:scale-[0.9] transition-transform">-</button>
          </div>
        )}
      </div>
    )
  }

  const canSubmit = hasServices && selectedBarberId && timeMode && (timeMode === 'asap' || pickedTime);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-extrabold text-stone-700 text-center">حجز موعد</h1>

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-stone-500">اختر الحلاق</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {barbers.map((barber) => {
            const active = selectedBarberId === barber.id;
            return (
              <button key={barber.id} onClick={() => handleSelectBarber(barber.id)}
                className={`shrink-0 rounded-xl px-6 py-3 text-sm font-medium ${btnBase} ${toggleStyle(active)}`}>
                {barber.name}
              </button>
            )
          })}
        </div>
      </section>

      {selectedBarberId && (
        <>
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-stone-500">عدد الأشخاص <span className="text-red-500">*</span></h2>
              <div className="flex items-center gap-3">
                <button onClick={() => setPeopleCount((p) => p + 1)}
                  className={`${counterBtn} bg-stone-800 text-white`}>+</button>
                <span className="text-sm font-bold text-stone-700 w-4 text-center">{peopleCount}</span>
                {peopleCount > 1 && (
                  <button onClick={() => setPeopleCount((p) => {
                    const next = p - 1;
                    setServiceCounts((prev) => {
                      const copy = { ...prev };
                      for (const [k, v] of Object.entries(copy)) if (v > next) copy[k] = next;
                      return copy;
                    });
                    return next;
                  })}
                    className={`${counterBtn} border border-red-300 text-red-500`}>-</button>
                )}
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-stone-500">{peopleCount > 1 ? 'الخدمات' : 'اختر الخدمة'}</h2>
            <div className="space-y-2">{barberServices.map(serviceRow)}</div>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-stone-500">اختر الوقت <span className="text-red-500">*</span></h2>

            {loadingQueue ? (
              <p className="text-sm text-stone-400 text-center py-4">جاري التحميل...</p>
            ) : availability ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { setTimeMode('asap'); setPickedHour(''); setPickedMinute('') }}
                    className={`rounded-xl p-4 text-center ${btnBase} ${toggleStyle(timeMode === 'asap')}`}>
                    <span className="text-sm font-bold">في أسرع وقت</span>
                    {timeMode === 'asap' && <p className="text-xs mt-1 text-neutral-300">{toAmPm(availability.queueEndTime)}</p>}
                  </button>
                  <button onClick={() => setTimeMode('pick')}
                    className={`rounded-xl p-4 text-center ${btnBase} ${toggleStyle(timeMode === 'pick')}`}>
                    <span className="text-sm font-bold">تقريبًا</span>
                    {timeMode === 'pick' && pickedHour && pickedMinute && <p className="text-xs mt-1 text-neutral-300">{toAmPm(pickedTime)}</p>}
                  </button>
                </div>

                {timeMode === 'pick' && (
                  <div className="flex gap-2">
                    <select value={pickedHour} onChange={(e) => { setPickedHour(e.target.value); setPickedMinute(''); }}
                      className="flex-1 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-700 text-center appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-stone-400">
                      <option value="" disabled>ساعة</option>
                      {hourOptions.map((h) => <option key={h} value={h}>{hourLabel(h)}</option>)}
                    </select>
                    <select value={pickedMinute} onChange={(e) => setPickedMinute(e.target.value)} disabled={!pickedHour}
                      className="flex-1 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-700 text-center appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-stone-400 disabled:opacity-40">
                      <option value="" disabled>دقيقة</option>
                      {minuteOptions.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                )}
              </>
            ) : null}
          </section>

          <button disabled={!canSubmit}
            className={`w-full py-4 text-lg font-bold rounded-2xl ${btnBase} ${canSubmit ? 'bg-stone-800 text-neutral-100' : 'bg-stone-200 text-stone-400 cursor-not-allowed'}`}>
            تأكيد الحجز
          </button>
        </>
      )}
    </div>
  )
}
