import { AdminProviders } from '@/context/admin-providers';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProviders>
      <div className="w-screen h-screen bg-neutral-700 flex justify-center">
        <main className="w-screen landscape:w-[50vh] max-w-[50vh] h-screen bg-white overflow-y-auto">
          {children}
        </main>
      </div>
    </AdminProviders>
  )
}
