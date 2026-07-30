'use client';

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import type { Reservation } from '@/types';
import mockReservations from '@/data/reservations';

interface QueueContextValue {
  reservations: Reservation[];
  accepting: boolean;
  setAccepting: Dispatch<SetStateAction<boolean>>;
  addReservation: (r: Reservation) => void;
  updateStatus: (id: string, status: Reservation['status']) => void;
  updateTime: (id: string, time: string) => void;
  cancelReservation: (id: string) => void;
  getByBarber: (barberId: string) => Reservation[];
  hasCurrent: (barberId: string) => boolean;
  refresh: () => void;
}

const QueueContext = createContext<QueueContextValue | null>(null);

export function QueueProvider({ children }: { children: ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [accepting, setAccepting] = useState(true);

  const addReservation = (r: Reservation) => {
    setReservations((prev) => [...prev, r]);
  };

  const updateStatus = (id: string, status: Reservation['status']) => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const updateTime = (id: string, time: string) => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, startTime: time } : r)));
  };

  const cancelReservation = (id: string) => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' as const } : r)));
  };

  const getByBarber = (barberId: string) =>
    reservations.filter((r) => r.barberId === barberId && r.status !== 'cancelled');

  const hasCurrent = (barberId: string) =>
    reservations.some((r) => r.barberId === barberId && r.status === 'in-progress');

  const refresh = () => {
  };

  return (
    <QueueContext.Provider value={{
      reservations, accepting, setAccepting,
      addReservation, updateStatus, updateTime,
      cancelReservation, getByBarber, hasCurrent, refresh,
    }}>
      {children}
    </QueueContext.Provider>
  );
}

export function useQueue() {
  const ctx = useContext(QueueContext);
  if (!ctx) throw new Error('useQueue must be used within QueueProvider');
  return ctx;
}
