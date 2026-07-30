import { CustomerProviders } from '@/context/customer-providers';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CustomerProviders>
      <div className="w-screen h-screen bg-neutral-700 flex justify-center">
        <main className="w-screen landscape:w-[50vh] max-w-[50vh] h-screen bg-white overflow-y-auto">
          {children}
        </main>
      </div>
    </CustomerProviders>
  )
}
