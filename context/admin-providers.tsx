'use client';

import { Composer } from '@/context/composer';
import { AuthProvider } from '@/context/providers/auth-provider';
import { QueueProvider } from '@/context/providers/queue-provider';

const providers = [
  AuthProvider,
  QueueProvider,
];

export function AdminProviders({ children }: { children: React.ReactNode }) {
  return <Composer providers={providers}>{children}</Composer>;
}
