import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSubscription, subscriptionPlans } from '../../lib/stripe';
import { CheckCircle, CreditCard, Clock, Gift, Loader2 } from 'lucide-react';

interface SubscriptionPaywallProps {
  listingId: string;
  listingTitle: string;
  onCancel: () => void;
}

const SubscriptionPaywall: React.FC<SubscriptionPaywallProps> = ({
  listingId,
  listingTitle,
  onCancel
}) => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'quarterly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Temporary mock payment flow for temp listings (for testing)
      if (listingId === 'temp') {
        console.log('Using mock payment flow for temp listing');
        
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Redirect to payment success page
        window.location.href = `${window.location.origin}/payment-success?listing_id=temp`;
        return;
      }
      
      await createSubscription({
        listingId,
        planType: selectedPlan,
        successUrl: `${window.location.origin}/payment-success?listing_id=${listingId}`,
        cancelUrl: `${window.location.origin}/submit-listing`
      });
    } catch (err) {
      console.error('Subscription error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process payment');
      setIsProcessing(false);
    }
  };

  const selectedPlanData = subscriptionPlans.find(plan => plan.id === selectedPlan);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4f46e5] to-[#4338ca] text-white p-8 text-center">
        <h2 className="text-3xl font-bold mb-2">Choose Your Listing Plan</h2>
        <p className="text-xl opacity-90">
          Get your listing "{listingTitle}" live and start connecting with tenants
        </p>
      </div>

      <div className="p-8">
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                selectedPlan === plan.id
                  ? 'border-[#4f46e5] bg-[#4f46e5]/5 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedPlan(plan.id as 'monthly' | 'quarterly')}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === plan.id
                    ? 'border-[#4f46e5] bg-[#4f46e5]'
                    : 'border-gray-300'
                }`}>
                  {selectedPlan === plan.id && (
                    <CheckCircle className="h-4 w-4 text-white" />
                  )}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-500 ml-2">for {plan.duration} days</span>
                </div>
                {plan.id === 'quarterly' && (
                  <div className="text-green-600 text-sm font-medium mt-1">
                    Save $25 vs monthly plans
                  </div>
                )}
              </div>

              <p className="text-gray-600 mb-4">{plan.description}</p>

              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Pricing Timeline */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Our Fair Pricing Model
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="bg-[#4f46e5] text-white rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <CreditCard className="h-6 w-6" />
              </div>
              <div className="font-bold text-lg">$100</div>
              <div className="text-sm text-gray-600">First 30 days</div>
            </div>
            <div className="text-center">
              <div className="bg-blue-500 text-white rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <Clock className="h-6 w-6" />
              </div>
              <div className="font-bold text-lg">$50</div>
              <div className="text-sm text-gray-600">Next 30 days</div>
            </div>
            <div className="text-center">
              <div className="bg-green-500 text-white rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <Clock className="h-6 w-6" />
              </div>
              <div className="font-bold text-lg">$25</div>
              <div className="text-sm text-gray-600">Following 30 days</div>
            </div>
            <div className="text-center">
              <div className="bg-yellow-500 text-white rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <Gift className="h-6 w-6" />
              </div>
              <div className="font-bold text-lg">FREE</div>
              <div className="text-sm text-gray-600">After 90 days</div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-4">
            If your property hasn't rented after 90 days, we'll keep it listed for free!
          </p>
        </div>

        {/* Selected Plan Summary */}
        {selectedPlanData && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">Selected Plan Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Plan:</span>
                <div className="font-medium">{selectedPlanData.name}</div>
              </div>
              <div>
                <span className="text-gray-600">Duration:</span>
                <div className="font-medium">{selectedPlanData.duration} days</div>
              </div>
              <div>
                <span className="text-gray-600">Total Cost:</span>
                <div className="font-medium text-lg">${selectedPlanData.price}</div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubscribe}
            disabled={isProcessing}
            className="flex-1 px-6 py-3 bg-[#4f46e5] text-white font-semibold rounded-md hover:bg-[#4f46e5]/90 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5 mr-2" />
                Continue to Payment
              </>
            )}
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            🔒 Secure payment processing powered by Stripe. Your payment information is encrypted and secure.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPaywall;