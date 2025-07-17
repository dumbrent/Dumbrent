import React from 'react';
import { NeighborhoodHighlight } from '../../types';
import { Clock, User } from 'lucide-react';
import { featureTypeLabels } from '../../data/mockData';

interface NeighborhoodHighlightCardProps {
  highlight: NeighborhoodHighlight;
}

const NeighborhoodHighlightCard: React.FC<NeighborhoodHighlightCardProps> = ({ highlight }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {highlight.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img 
            src={highlight.imageUrl} 
            alt={highlight.name} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-800">{highlight.name}</h3>
          <span className="px-3 py-1 bg-[#4f46e5]/10 text-[#4f46e5] text-sm rounded-full">
            {featureTypeLabels[highlight.type]}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4">{highlight.description}</p>
        
        <div className="flex justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>Added by {highlight.addedBy}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{formatDate(highlight.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeighborhoodHighlightCard;