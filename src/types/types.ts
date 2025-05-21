
export type VehicleType = 'caminhao' | 'van' | 'carro';

export interface Stop {
  id: string;
  location: string;
  arrivalTime: string;
  departureTime: string;
  kilometersAtDeparture: number;
  kilometersAtArrival: number;
}

export interface Trip {
  id: string;
  driverName: string;
  vehicleType: VehicleType;
  vehiclePlate: string;
  date: string;
  startLocation: string;
  departureTime: string;
  initialKilometers: number;
  destination: string;
  arrivalTime: string;
  finalKilometers: number;
  stops: Stop[];
}
