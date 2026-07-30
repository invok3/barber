import type { Barber } from '@/types';

const barbers: Barber[] = [
  { id: 'barber-1', name: 'ياسر', workStart: '09:00', workEnd: '17:00', serviceIds: ['svc-1', 'svc-2', 'svc-3', 'svc-4'] },
  { id: 'barber-2', name: 'أحمد', workStart: '11:00', workEnd: '21:00', serviceIds: ['svc-1', 'svc-2', 'svc-3'] },
  { id: 'barber-3', name: 'محمد', workStart: '09:00', workEnd: '22:00', serviceIds: ['svc-1', 'svc-2'] },
]

export default barbers
