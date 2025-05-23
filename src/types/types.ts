
export type VehicleType = 'van-passageiro-01' | 'servico-01' | 'picape-01' | 'van-carga-01' | 'van-passageiro-02' | 'picape-02' | 'motocicleta-02' | 'furgao-carga-01' | 'caminhao-bau' | 'servico-02' | 'pesado' | 'caminhao' | 'van' | 'carro';

export interface Stop {
  id: string;
  destination: string;
  departureLocation: string;
  activity: string;
  arrivalTime: string;
  departureTime: string;
  kilometersAtArrival: number;
}

export interface Trip {
  id: string;
  vehicleType: VehicleType;
  vehiclePlate: string;
  driverName: string; // Mantemos por enquanto para compatibilidade com dados existentes
  date: string;
  startLocation: string;
  departureTime: string;
  initialKilometers: number;
  finalKilometers: number; // Mantemos por enquanto para compatibilidade com dados existentes
  destination: string;
  stops: Stop[];
}
