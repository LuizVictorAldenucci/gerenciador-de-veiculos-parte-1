
import React from 'react';
import { Map } from 'lucide-react';

interface RouteMapProps {
  trip: any;
}

const RouteMap: React.FC<RouteMapProps> = ({ trip }) => {
  return (
    <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-center h-48">
      <div className="text-center">
        <Map className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
        <p className="text-muted-foreground">Mapa da Rota</p>
        <p className="text-sm text-muted-foreground">
          {trip.startLocation} → {trip.destination}
        </p>
      </div>
    </div>
  );
};

export default RouteMap;
