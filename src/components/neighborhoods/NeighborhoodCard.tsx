import React from 'react';
import { Link } from 'react-router-dom';
import { Neighborhood } from '../../types';
import { MapPin } from 'lucide-react';

interface NeighborhoodCardProps {
  neighborhood: Neighborhood;
  borough: string;
}

const NeighborhoodCard: React.FC<NeighborhoodCardProps> = ({ neighborhood, borough }) => {
  return (
    <Link 
      to={`/neighborhood/${neighborhood.id}`}
      className="group bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={neighborhood.imageUrl} 
          alt={neighborhood.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800 mb-1">{neighborhood.name}</h3>
        
        <div className="flex items-center text-gray-500 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <p className="text-sm">{borough}</p>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{neighborhood.description}</p>
        
        <div className="text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
          Explore Neighborhood
        </div>
      </div>
    </Link>
  );
};

export default NeighborhoodCard;