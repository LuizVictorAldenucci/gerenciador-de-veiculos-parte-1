import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trip, VehicleType } from '@/types/types';
import { Car, Truck, Bus, ChevronDown, ChevronUp, Search, FileDown } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import RouteMap from './RouteMap';
import * as XLSX from 'xlsx';

interface TripTableProps {
  trips: Trip[];
  onDeleteTrip: (id: string) => void;
}

const TripTable: React.FC<TripTableProps> = ({ trips, onDeleteTrip }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Trip>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedTrip, setExpandedTrip] = useState<string | null>(null);

  const sortedTrips = [...trips].sort((a, b) => {
    if (sortField === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  const filteredTrips = sortedTrips.filter(trip => {
    const searchLower = searchTerm.toLowerCase();
    return (
      trip.driverName.toLowerCase().includes(searchLower) || 
      trip.vehiclePlate.toLowerCase().includes(searchLower) ||
      trip.startLocation.toLowerCase().includes(searchLower) ||
      trip.destination.toLowerCase().includes(searchLower)
    );
  });
  
  const handleSort = (field: keyof Trip) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const toggleExpand = (id: string) => {
    setExpandedTrip(expandedTrip === id ? null : id);
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return dateString;
    }
  };
  
  const getVehicleIcon = (type: VehicleType) => {
    switch(type) {
      case 'caminhao': return <Truck className="h-5 w-5" />;
      case 'van': return <Bus className="h-5 w-5" />;
      case 'carro': return <Car className="h-5 w-5" />;
    }
  };
  
  const calculateDistance = (trip: Trip) => {
    return trip.finalKilometers - trip.initialKilometers;
  };

  const exportToExcel = () => {
    const exportData = trips.map(trip => ({
      'Data': formatDate(trip.date),
      'Tipo de Veículo': trip.vehicleType,
      'Placa': trip.vehiclePlate,
      'Horário de Saída': trip.departureTime,
      'Km Inicial': trip.initialKilometers,
      'Local de Saída': trip.startLocation,
      'Destino': trip.destination,
      'Distância Total (km)': calculateDistance(trip),
      'Paradas': trip.stops.length
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Registros de Viagens');
    XLSX.writeFile(wb, 'registros_viagens.xlsx');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar por placa, origem ou destino..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Button onClick={exportToExcel} variant="outline" className="ml-4">
          <FileDown className="h-4 w-4 mr-2" />
          Exportar Excel
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead className="w-[50px]">Tipo</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('driverName')}>
                Motorista {sortField === 'driverName' && (sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
              </TableHead>
              <TableHead>Placa</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                Data {sortField === 'date' && (sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
              </TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead>Distância</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTrips.length > 0 ? (
              filteredTrips.map((trip) => (
                <React.Fragment key={trip.id}>
                  <TableRow>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleExpand(trip.id)}
                      >
                        {expandedTrip === trip.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                    <TableCell>
                      {getVehicleIcon(trip.vehicleType)}
                    </TableCell>
                    <TableCell className="font-medium">{trip.driverName}</TableCell>
                    <TableCell>{trip.vehiclePlate}</TableCell>
                    <TableCell>{formatDate(trip.date)}</TableCell>
                    <TableCell>{trip.startLocation}</TableCell>
                    <TableCell>{trip.destination}</TableCell>
                    <TableCell>{calculateDistance(trip)} km</TableCell>
                    <TableCell className="text-right">
                      <Button variant="destructive" size="sm" onClick={() => onDeleteTrip(trip.id)}>
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                  
                  {expandedTrip === trip.id && (
                    <TableRow>
                      <TableCell colSpan={9}>
                        <div className="p-4 bg-muted/50 rounded-md">
                          <h4 className="font-medium mb-4">Detalhes da Viagem</h4>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                            <div>
                              <h5 className="font-medium mb-2">Informações da Viagem</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Origem</p>
                                  <p>{trip.startLocation}</p>
                                  <p className="text-sm">Saída: {trip.departureTime}</p>
                                  <p className="text-sm">Km inicial: {trip.initialKilometers}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Destino</p>
                                  <p>{trip.destination}</p>
                                  <p className="text-sm">Distância: {calculateDistance(trip)} km</p>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h5 className="font-medium mb-2">Mapa da Rota</h5>
                              <RouteMap trip={trip} />
                            </div>
                          </div>
                          
                          {trip.stops.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Paradas ({trip.stops.length})</h4>
                              <div className="space-y-2">
                                {trip.stops.map((stop, index) => (
                                  <div key={stop.id} className="p-2 border rounded-md grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <div>
                                      <p className="text-sm font-medium">Parada {index + 1}: {stop.destination}</p>
                                      <p className="text-sm text-muted-foreground">Atividade: {stop.activity}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm">Chegada: {stop.arrivalTime} - {stop.kilometersAtArrival} km</p>
                                      <p className="text-sm">Saída: {stop.departureTime}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm">Saída de: {stop.departureLocation}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  {searchTerm ? "Nenhuma viagem encontrada com esses critérios." : "Nenhuma viagem registrada."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TripTable;
