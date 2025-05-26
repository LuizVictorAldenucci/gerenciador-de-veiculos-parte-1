
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trip, VehicleType } from '@/types/types';
import { Car, Truck, Bus, Bike, ChevronDown, ChevronUp, Search, FileSpreadsheet } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

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
      (trip.vehiclePlate || '').toLowerCase().includes(searchLower) ||
      (trip.startLocation || '').toLowerCase().includes(searchLower) ||
      (trip.destination || '').toLowerCase().includes(searchLower)
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

  const calculateDistance = (trip: Trip) => {
    return trip.finalKilometers - trip.initialKilometers;
  };

  const calculateDuration = (trip: Trip) => {
    try {
      const [depHour, depMin] = trip.departureTime.split(':').map(Number);
      const [arrHour, arrMin] = trip.arrivalTime.split(':').map(Number);
      
      const depMinutes = depHour * 60 + depMin;
      const arrMinutes = arrHour * 60 + arrMin;
      
      let duration = arrMinutes - depMinutes;
      if (duration < 0) duration += 24 * 60; // Handle next day arrival
      
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      
      return `${hours}h ${minutes}m`;
    } catch {
      return 'N/A';
    }
  };

  const exportToExcel = () => {
    const data = filteredTrips.map(trip => ({
      'Data': formatDate(trip.date),
      'Tipo de Veículo': getVehicleLabel(trip.vehicleType),
      'Placa': trip.vehiclePlate,
      'Origem': trip.startLocation,
      'Destino': trip.destination,
      'Saída': trip.departureTime,
      'Chegada': trip.arrivalTime,
      'Km Inicial': trip.initialKilometers,
      'Km Final': trip.finalKilometers,
      'Total Rodado (km)': calculateDistance(trip),
      'Duração': calculateDuration(trip),
      'Atividade': trip.activity,
      'Paradas': trip.stops.length
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Registros de Viagens');
    
    XLSX.writeFile(wb, `registros-viagens-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    toast.success('Arquivo Excel exportado com sucesso!');
  };
  
  const getVehicleIcon = (type: VehicleType) => {
    if (type.includes('motocicleta')) return <Bike className="h-5 w-5" />;
    if (type.includes('caminhao') || type.includes('pesado')) return <Truck className="h-5 w-5" />;
    if (type.includes('van') || type.includes('furgao')) return <Bus className="h-5 w-5" />;
    return <Car className="h-5 w-5" />;
  };
  
  const getVehicleLabel = (type: VehicleType) => {
    const vehicleOptions = {
      'van-passageiro-tipo01': 'VAN PASSAGEIRO (TIPO 01)',
      'servico-tipo01': 'SERVIÇO (TIPO 01)',
      'picape-tipo01': 'PICAPE (TIPO 01)',
      'van-carga-tipo01': 'VAN DE CARGA (TIPO 01)',
      'van-passageiro-tipo02': 'VAN PASSAGEIRO (TIPO 02)',
      'picape-tipo02': 'PICAPE (TIPO 02)',
      'motocicleta-tipo02': 'Motocicleta (Tipo 2)',
      'furgao-carga-tipo01': 'FURGÃO DE CARGA (TIPO 01)',
      'caminhao-bau-34': 'CAMINHÃO BAÚ 3/4',
      'servico-tipo02': 'SERVIÇO (TIPO 02)',
      'pesado': 'PESADO'
    };
    return vehicleOptions[type] || type;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar por placa, origem ou destino..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={exportToExcel} variant="outline" className="ml-4">
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Exportar Excel
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead className="w-[50px]">Tipo</TableHead>
              <TableHead>Placa</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                Data {sortField === 'date' && (sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
              </TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead>Total Rodado</TableHead>
              <TableHead>Duração</TableHead>
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
                    <TableCell className="font-medium">{trip.vehiclePlate}</TableCell>
                    <TableCell>{formatDate(trip.date)}</TableCell>
                    <TableCell>{trip.startLocation}</TableCell>
                    <TableCell>{trip.destination}</TableCell>
                    <TableCell>{calculateDistance(trip)} km</TableCell>
                    <TableCell>{calculateDuration(trip)}</TableCell>
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
                          <h4 className="font-medium mb-2">Detalhes da Viagem</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Veículo</p>
                              <p>{getVehicleLabel(trip.vehicleType)}</p>
                              <p className="text-sm">Placa: {trip.vehiclePlate}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Origem</p>
                              <p>{trip.startLocation}</p>
                              <p className="text-sm">Saída: {trip.departureTime}</p>
                              <p className="text-sm">Km inicial: {trip.initialKilometers}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Destino</p>
                              <p>{trip.destination}</p>
                              <p className="text-sm">Chegada: {trip.arrivalTime}</p>
                              <p className="text-sm">Km final: {trip.finalKilometers}</p>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <p className="text-sm font-medium text-muted-foreground">Atividade Principal</p>
                            <p>{trip.activity}</p>
                          </div>
                          
                          {trip.stops.length > 0 && (
                            <div className="mt-4">
                              <h4 className="font-medium mb-2">Paradas ({trip.stops.length})</h4>
                              <div className="space-y-2">
                                {trip.stops.map((stop, index) => (
                                  <div key={stop.id} className="p-2 border rounded-md grid grid-cols-1 md:grid-cols-4 gap-2">
                                    <div>
                                      <p className="text-sm font-medium">Parada {index + 1}</p>
                                      <p className="text-sm">De: {stop.departureLocation}</p>
                                      <p className="text-sm">Para: {stop.destination}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm">Chegada: {stop.arrivalTime}</p>
                                      <p className="text-sm">Saída: {stop.departureTime}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm">Km chegada: {stop.kilometersAtArrival}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">Atividade:</p>
                                      <p className="text-sm">{stop.activity}</p>
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
