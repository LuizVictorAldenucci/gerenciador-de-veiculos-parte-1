
export type VehicleType = 'caminhao' | 'van' | 'carro';

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
  driverName: string;
  date: string;
  startLocation: string;
  departureTime: string;
  initialKilometers: number;
  finalKilometers: number;
  destination: string;
  stops: Stop[];
}
