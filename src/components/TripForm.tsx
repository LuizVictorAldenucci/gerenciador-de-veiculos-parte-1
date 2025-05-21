
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { PlusCircle, Trash2, Car, Truck, Bus } from "lucide-react";
import { VehicleType, Stop, Trip } from '@/types/types';
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

interface TripFormProps {
  onSaveTrip: (trip: Trip) => void;
}

const TripForm: React.FC<TripFormProps> = ({ onSaveTrip }) => {
  const [driverName, setDriverName] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('carro');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [date, setDate] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [initialKilometers, setInitialKilometers] = useState<number>(0);
  const [destination, setDestination] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [finalKilometers, setFinalKilometers] = useState<number>(0);
  const [stops, setStops] = useState<Stop[]>([]);
  
  const handleAddStop = () => {
    const newStop: Stop = {
      id: uuidv4(),
      location: '',
      arrivalTime: '',
      departureTime: '',
      kilometersAtDeparture: 0,
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
    
    if (!driverName || !vehiclePlate || !date || !startLocation || !departureTime || 
        !initialKilometers || !destination || !arrivalTime || !finalKilometers) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    const newTrip: Trip = {
      id: uuidv4(),
      driverName,
      vehicleType,
      vehiclePlate,
      date,
      startLocation,
      departureTime,
      initialKilometers,
      destination,
      arrivalTime,
      finalKilometers,
      stops
    };
    
    onSaveTrip(newTrip);
    toast.success("Viagem registrada com sucesso!");
    
    // Reset form
    setDriverName('');
    setVehicleType('carro');
    setVehiclePlate('');
    setDate('');
    setStartLocation('');
    setDepartureTime('');
    setInitialKilometers(0);
    setDestination('');
    setArrivalTime('');
    setFinalKilometers(0);
    setStops([]);
  };
  
  const getVehicleIcon = () => {
    switch(vehicleType) {
      case 'caminhao': return <Truck className="h-5 w-5" />;
      case 'van': return <Bus className="h-5 w-5" />;
      case 'carro': return <Car className="h-5 w-5" />;
      default: return <Car className="h-5 w-5" />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="driverName">Nome do Motorista</Label>
          <Input
            id="driverName"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            placeholder="Digite o nome do motorista"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="vehiclePlate">Placa do Veículo</Label>
          <Input
            id="vehiclePlate"
            value={vehiclePlate}
            onChange={(e) => setVehiclePlate(e.target.value)}
            placeholder="ABC-1234"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicleType">Tipo de Veículo</Label>
          <Select value={vehicleType} onValueChange={(value: VehicleType) => setVehicleType(value)}>
            <SelectTrigger className="w-full">
              <SelectValue>
                <div className="flex items-center space-x-2">
                  {getVehicleIcon()}
                  <span>{vehicleType === 'caminhao' ? 'Caminhão' : vehicleType === 'van' ? 'Van' : 'Carro'}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="caminhao">
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4" />
                  <span>Caminhão</span>
                </div>
              </SelectItem>
              <SelectItem value="van">
                <div className="flex items-center space-x-2">
                  <Bus className="h-4 w-4" />
                  <span>Van</span>
                </div>
              </SelectItem>
              <SelectItem value="carro">
                <div className="flex items-center space-x-2">
                  <Car className="h-4 w-4" />
                  <span>Carro</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
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
            <Label htmlFor="arrivalTime">Horário de Chegada</Label>
            <Input
              id="arrivalTime"
              type="time"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
          
          <div className="space-y-2">
            <Label htmlFor="finalKilometers">Kilometragem Final</Label>
            <Input
              id="finalKilometers"
              type="number"
              value={finalKilometers}
              onChange={(e) => setFinalKilometers(Number(e.target.value))}
              placeholder="Km na chegada"
            />
          </div>
        </div>
      </div>
      
      {stops.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-4">Paradas Adicionais</h3>
          {stops.map((stop) => (
            <Card key={stop.id} className="p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Parada</h4>
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
                  <Label>Local</Label>
                  <Input
                    value={stop.location}
                    onChange={(e) => handleStopChange(stop.id, 'location', e.target.value)}
                    placeholder="Local da parada"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <Label>Kilometragem na Chegada</Label>
                  <Input
                    type="number"
                    value={stop.kilometersAtArrival}
                    onChange={(e) => handleStopChange(stop.id, 'kilometersAtArrival', Number(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Kilometragem na Saída</Label>
                  <Input
                    type="number"
                    value={stop.kilometersAtDeparture}
                    onChange={(e) => handleStopChange(stop.id, 'kilometersAtDeparture', Number(e.target.value))}
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
