
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trip } from '@/types/types';
import TripForm from '@/components/TripForm';
import TripTable from '@/components/TripTable';

const Index = () => {
  const [trips, setTrips] = useState<Trip[]>(() => {
    const savedTrips = localStorage.getItem('fleetTrips');
    return savedTrips ? JSON.parse(savedTrips) : [];
  });

  const handleSaveTrip = (trip: Trip) => {
    const updatedTrips = [...trips, trip];
    setTrips(updatedTrips);
    localStorage.setItem('fleetTrips', JSON.stringify(updatedTrips));
  };

  const handleDeleteTrip = (id: string) => {
    const updatedTrips = trips.filter(trip => trip.id !== id);
    setTrips(updatedTrips);
    localStorage.setItem('fleetTrips', JSON.stringify(updatedTrips));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Gestão de Frota de Veículos</h1>
      
      <Tabs defaultValue="view" className="max-w-5xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="view">Visualizar Registros</TabsTrigger>
          <TabsTrigger value="add">Adicionar Registro</TabsTrigger>
        </TabsList>
        
        <TabsContent value="view">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Registros de Viagens</h2>
            <TripTable trips={trips} onDeleteTrip={handleDeleteTrip} />
          </div>
        </TabsContent>
        
        <TabsContent value="add">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Novo Registro de Viagem</h2>
            <TripForm onSaveTrip={handleSaveTrip} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
