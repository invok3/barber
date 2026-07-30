'use client';

import { Composer } from '@/context/composer';
import { AuthProvider } from '@/context/providers/auth-provider';
import { QueueProvider } from '@/context/providers/queue-provider';
import { ServiceProvider } from '@/context/providers/service-provider';
import { StaffProvider } from '@/context/providers/staff-provider';

const providers = [
  AuthProvider,
  QueueProvider,
  ServiceProvider,
  StaffProvider,
];

export function StaffProviders({ children }: { children: React.ReactNode }) {
  return <Composer providers={providers}>{children}</Composer>;
}
