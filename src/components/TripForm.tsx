
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { PlusCircle, Trash2, Car, Truck, Bus, Bike } from "lucide-react";
import { VehicleType, Stop, Trip } from '@/types/types';
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

interface TripFormProps {
  onSaveTrip: (trip: Trip) => void;
}

const TripForm: React.FC<TripFormProps> = ({ onSaveTrip }) => {
  const [vehicleType, setVehicleType] = useState<VehicleType>('van-passageiro-tipo01');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [date, setDate] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [initialKilometers, setInitialKilometers] = useState<number>(0);
  const [destination, setDestination] = useState('');
  const [stops, setStops] = useState<Stop[]>([]);
  
  const vehicleOptions = [
    { value: 'van-passageiro-tipo01', label: 'VAN PASSAGEIRO (TIPO 01)' },
    { value: 'servico-tipo01', label: 'SERVIÇO (TIPO 01)' },
    { value: 'picape-tipo01', label: 'PICAPE (TIPO 01)' },
    { value: 'van-carga-tipo01', label: 'VAN DE CARGA (TIPO 01)' },
    { value: 'van-passageiro-tipo02', label: 'VAN PASSAGEIRO (TIPO 02)' },
    { value: 'picape-tipo02', label: 'PICAPE (TIPO 02)' },
    { value: 'motocicleta-tipo02', label: 'Motocicleta (Tipo 2)' },
    { value: 'furgao-carga-tipo01', label: 'FURGÃO DE CARGA (TIPO 01)' },
    { value: 'caminhao-bau-34', label: 'CAMINHÃO BAÚ 3/4' },
    { value: 'servico-tipo02', label: 'SERVIÇO (TIPO 02)' },
    { value: 'pesado', label: 'PESADO' }
  ];
  
  const handleAddStop = () => {
    const previousDestination = stops.length > 0 ? stops[stops.length - 1].destination : destination;
    
    const newStop: Stop = {
      id: uuidv4(),
      destination: '',
      departureLocation: previousDestination,
      arrivalTime: '',
      departureTime: '',
      kilometersAtArrival: 0
    };
    setStops([...stops, newStop]);
  };
  
  const handleStopChange = (id: string, field: keyof Stop, value: string | number) => {
    setStops(stops.map(stop => 
      stop.id === id ? { ...stop, [field]: value } : stop
    ));
  };
  
  const handleRemoveStop = (id: string) => {
    setStops(stops.filter(stop => stop.id !== id));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vehiclePlate || !date || !startLocation || !departureTime || 
        !initialKilometers || !destination) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    const newTrip: Trip = {
      id: uuidv4(),
      vehicleType,
      vehiclePlate,
      date,
      startLocation,
      departureTime,
      initialKilometers,
      destination,
      stops
    };
    
    onSaveTrip(newTrip);
    toast.success("Viagem registrada com sucesso!");
    
    // Reset form
    setVehicleType('van-passageiro-tipo01');
    setVehiclePlate('');
    setDate('');
    setStartLocation('');
    setDepartureTime('');
    setInitialKilometers(0);
    setDestination('');
    setStops([]);
  };
  
  const getVehicleIcon = () => {
    if (vehicleType.includes('motocicleta')) return <Bike className="h-5 w-5" />;
    if (vehicleType.includes('caminhao') || vehicleType.includes('pesado')) return <Truck className="h-5 w-5" />;
    if (vehicleType.includes('van') || vehicleType.includes('furgao')) return <Bus className="h-5 w-5" />;
    return <Car className="h-5 w-5" />;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehiclePlate">Placa do Veículo</Label>
          <Input
            id="vehiclePlate"
            value={vehiclePlate}
            onChange={(e) => setVehiclePlate(e.target.value)}
            placeholder="ABC-1234"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="vehicleType">Tipo de Veículo</Label>
        <Select value={vehicleType} onValueChange={(value: VehicleType) => setVehicleType(value)}>
          <SelectTrigger className="w-full">
            <SelectValue>
              <div className="flex items-center space-x-2">
                {getVehicleIcon()}
                <span>{vehicleOptions.find(opt => opt.value === vehicleType)?.label}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {vehicleOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center space-x-2">
                  {option.value.includes('motocicleta') ? <Bike className="h-4 w-4" /> :
                   option.value.includes('caminhao') || option.value.includes('pesado') ? <Truck className="h-4 w-4" /> :
                   option.value.includes('van') || option.value.includes('furgao') ? <Bus className="h-4 w-4" /> :
                   <Car className="h-4 w-4" />}
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-4">Origem e Destino Principal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startLocation">Local de Saída</Label>
            <Input
              id="startLocation"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              placeholder="Local de origem"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="destination">Destino</Label>
            <Input
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Local de destino"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="departureTime">Horário de Saída</Label>
            <Input
              id="departureTime"
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="initialKilometers">Kilometragem Inicial</Label>
            <Input
              id="initialKilometers"
              type="number"
              value={initialKilometers}
              onChange={(e) => setInitialKilometers(Number(e.target.value))}
              placeholder="Km na saída"
            />
          </div>
        </div>
      </div>
      
      {stops.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-4">Paradas Adicionais</h3>
          {stops.map((stop, index) => (
            <Card key={stop.id} className="p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Parada {index + 1}</h4>
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleRemoveStop(stop.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div className="space-y-2">
                  <Label>Local de Saída</Label>
                  <Input
                    value={stop.departureLocation}
                    onChange={(e) => handleStopChange(stop.id, 'departureLocation', e.target.value)}
                    placeholder="Local de saída"
                    readOnly
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Destino</Label>
                  <Input
                    value={stop.destination}
                    onChange={(e) => handleStopChange(stop.id, 'destination', e.target.value)}
                    placeholder="Destino da parada"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Horário de Chegada</Label>
                  <Input
                    type="time"
                    value={stop.arrivalTime}
                    onChange={(e) => handleStopChange(stop.id, 'arrivalTime', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Horário de Saída</Label>
                  <Input
                    type="time"
                    value={stop.departureTime}
                    onChange={(e) => handleStopChange(stop.id, 'departureTime', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Kilometragem na Chegada</Label>
                  <Input
                    type="number"
                    value={stop.kilometersAtArrival}
                    onChange={(e) => handleStopChange(stop.id, 'kilometersAtArrival', Number(e.target.value))}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={handleAddStop}>
          <PlusCircle className="h-4 w-4 mr-2" /> Adicionar Parada
        </Button>
        
        <Button type="submit">Registrar Viagem</Button>
      </div>
    </form>
  );
};

export default TripForm;
