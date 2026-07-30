'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Service } from '@/types';
import mockServices from '@/data/services';

interface ServiceContextValue {
  services: Service[];
  addService: (service: Service) => void;
  updateService: (id: string, data: Partial<Service>) => void;
  removeService: (id: string) => void;
}

const ServiceContext = createContext<ServiceContextValue | null>(null);

export function ServiceProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>(mockServices);

  const addService = (service: Service) => {
    setServices((prev) => [...prev, service]);
  };

  const updateService = (id: string, data: Partial<Service>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
  };

  const removeService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <ServiceContext.Provider value={{ services, addService, updateService, removeService }}>
      {children}
    </ServiceContext.Provider>
  );
}

export function useServices() {
  const ctx = useContext(ServiceContext);
  if (!ctx) throw new Error('useServices must be used within ServiceProvider');
  return ctx;
}
