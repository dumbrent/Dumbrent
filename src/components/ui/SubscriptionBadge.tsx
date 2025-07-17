import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

interface SubscriptionStatus {
  status: 'active' | 'expired' | 'none';
  start_date?: string;
  end_date?: string;
  days_remaining: number;
  plan_type?: string;
  amount_paid?: number;
}

interface SubscriptionBadgeProps {
  listingId: string;
  className?: string;
  showDetails?: boolean;
}

const SubscriptionBadge: React.FC<SubscriptionBadgeProps> = ({ 
  listingId, 
  className = '', 
  showDetails = false 
}) => {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [listingId]);

  const fetchSubscriptionStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/subscription-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ listingId }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subscription status');
      }

      const data = await response.json();
      setStatus(data);
    } catch (err) {
      console.error('Error fetching subscription status:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${className}`}>
        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
        <span className="text-gray-600">Checking...</span>
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600 ${className}`}>
        <AlertTriangle className="h-4 w-4 mr-2" />
        <span>Status Unknown</span>
      </div>
    );
  }

  const getBadgeContent = () => {
    switch (status.status) {
      case 'active':
        return {
          icon: <CheckCircle className="h-4 w-4 mr-2" />,
          text: `🟢 Active – ${status.days_remaining} Days Left`,
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200'
        };
      case 'expired':
        return {
          icon: <AlertTriangle className="h-4 w-4 mr-2" />,
          text: '🔴 Expired – Renew Plan',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200'
        };
      case 'none':
        return {
          icon: <Clock className="h-4 w-4 mr-2" />,
          text: '⚪ No Subscription',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-600',
          borderColor: 'border-gray-200'
        };
      default:
        return {
          icon: <AlertTriangle className="h-4 w-4 mr-2" />,
          text: 'Unknown Status',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-600',
          borderColor: 'border-gray-200'
        };
    }
  };

  const badgeContent = getBadgeContent();

  return (
    <div className={`inline-flex flex-col ${className}`}>
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${badgeContent.bgColor} ${badgeContent.textColor} ${badgeContent.borderColor}`}>
        {badgeContent.icon}
        <span>{badgeContent.text}</span>
      </div>
      
      {showDetails && status.status !== 'none' && (
        <div className="mt-2 text-xs text-gray-500">
          {status.plan_type && (
            <div>Plan: {status.plan_type.charAt(0).toUpperCase() + status.plan_type.slice(1)}</div>
          )}
          {status.start_date && status.end_date && (
            <div>
              {new Date(status.start_date).toLocaleDateString()} - {new Date(status.end_date).toLocaleDateString()}
            </div>
          )}
          {status.amount_paid && (
            <div>Paid: ${status.amount_paid}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubscriptionBadge;