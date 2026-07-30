'use client';

import { Composer } from '@/context/composer';
import { ServiceProvider } from '@/context/providers/service-provider';
import { StaffProvider } from '@/context/providers/staff-provider';

const providers = [
  StaffProvider,
  ServiceProvider,
];

export function CustomerProviders({ children }: { children: React.ReactNode }) {
  return <Composer providers={providers}>{children}</Composer>;
}
