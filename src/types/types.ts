
export type VehicleType = 'van-passageiro-tipo01' | 'servico-tipo01' | 'picape-tipo01' | 'van-carga-tipo01' | 'van-passageiro-tipo02' | 'picape-tipo02' | 'motocicleta-tipo02' | 'furgao-carga-tipo01' | 'caminhao-bau-34' | 'servico-tipo02' | 'pesado';

export interface Stop {
  id: string;
  destination: string;
  departureLocation: string;
  arrivalTime: string;
  departureTime: string;
  kilometersAtArrival: number;
  activity: string;
}

export interface Trip {
  id: string;
  vehicleType: VehicleType;
  vehiclePlate: string;
  date: string;
  startLocation: string;
  departureTime: string;
  initialKilometers: number;
  destination: string;
  arrivalTime: string;
  finalKilometers: number;
  activity: string;
  stops: Stop[];
  isSubstitution: boolean;
}
