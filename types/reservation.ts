export interface Reservation {
  id: string;
  barberId: string;
  serviceIds: string[];
  customerName: string;
  customerPhone: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
}
