'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Barber } from '@/types';
import mockBarbers from '@/data/barbers';

interface StaffContextValue {
  barbers: Barber[];
  selectedBarberId: string | null;
  selectBarber: (id: string) => void;
  getBarber: (id: string) => Barber | undefined;
}

const StaffContext = createContext<StaffContextValue | null>(null);

export function StaffProvider({ children }: { children: ReactNode }) {
  const [barbers] = useState<Barber[]>(mockBarbers);
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);

  const selectBarber = (id: string) => setSelectedBarberId(id);
  const getBarber = (id: string) => barbers.find((b) => b.id === id);

  return (
    <StaffContext.Provider value={{ barbers, selectedBarberId, selectBarber, getBarber }}>
      {children}
    </StaffContext.Provider>
  );
}

export function useStaff() {
  const ctx = useContext(StaffContext);
  if (!ctx) throw new Error('useStaff must be used within StaffProvider');
  return ctx;
}
