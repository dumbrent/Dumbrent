import React from 'react';
import { X, Scale, Shield, Users, Home, CreditCard, AlertTriangle } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Scale className="h-6 w-6 text-[#4f46e5] mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Terms and Conditions</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <p className="text-sm text-gray-500 mb-6">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          {/* Introduction */}
          <section className="mb-6">
            <div className="flex items-center mb-3">
              <Shield className="h-5 w-5 text-[#4f46e5] mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">1. Introduction</h3>
            </div>
            <p className="text-gray-700 leading-relaxed mb-3">
              Welcome to Dumb Rent NYC ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your use of our website and services located at dumbrent.com (the "Service") operated by Dumb Rent Inc.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service.
            </p>
          </section>

          {/* User Accounts */}
          <section className="mb-6">
            <div className="flex items-center mb-3">
              <Users className="h-5 w-5 text-[#4f46e5] mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">2. User Accounts</h3>
            </div>
            <div className="space-y-3 text-gray-700">
              <p><strong>2.1 Account Creation:</strong> To access certain features of our Service, you must create an account. You agree to provide accurate, current, and complete information during registration.</p>
              <p><strong>2.2 Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
              <p><strong>2.3 Account Types:</strong> We offer different account types including tenant accounts and listing owner accounts, each with specific features and responsibilities.</p>
            </div>
          </section>

          {/* Listing Services */}
          <section className="mb-6">
            <div className="flex items-center mb-3">
              <Home className="h-5 w-5 text-[#4f46e5] mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">3. Listing Services</h3>
            </div>
            <div className="space-y-3 text-gray-700">
              <p><strong>3.1 Listing Accuracy:</strong> Listing owners must provide accurate, complete, and up-to-date information about their properties. False or misleading information is strictly prohibited.</p>
              <p><strong>3.2 Property Ownership:</strong> By submitting a listing, you represent and warrant that you are the owner of the property or have proper authorization to list it.</p>
              <p><strong>3.3 Listing Approval:</strong> All listings are subject to our review and approval process. We reserve the right to reject or remove any listing that violates these Terms.</p>
            </div>
          </section>

          {/* Payment Terms */}
          <section className="mb-6">
            <div className="flex items-center mb-3">
              <CreditCard className="h-5 w-5 text-[#4f46e5] mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">4. Payment Terms</h3>
            </div>
            <div className="space-y-3 text-gray-700">
              <p><strong>4.1 Subscription Fees:</strong> Listing owners must pay subscription fees to publish their listings. Our pricing structure is as follows:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>First 30 days: $100</li>
                <li>Second 30 days: $50</li>
                <li>Third 30 days: $25</li>
                <li>After 90 days: Free</li>
              </ul>
              <p><strong>4.2 Payment Processing:</strong> All payments are processed securely through our payment partners. We do not store your payment information.</p>
              <p><strong>4.3 Refunds:</strong> Subscription fees are generally non-refundable. However, we may provide refunds at our sole discretion in exceptional circumstances.</p>
            </div>
          </section>

          {/* User Conduct */}
          <section className="mb-6">
            <div className="flex items-center mb-3">
              <AlertTriangle className="h-5 w-5 text-[#4f46e5] mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">5. User Conduct</h3>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>You agree not to use our Service to:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Violate any applicable laws or regulations</li>
                <li>Post false, misleading, or fraudulent content</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Spam or send unsolicited communications</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of our Service</li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">6. Intellectual Property</h3>
            <div className="space-y-3 text-gray-700">
              <p><strong>6.1 Our Content:</strong> The Service and its original content, features, and functionality are owned by Dumb Rent Inc. and are protected by international copyright, trademark, and other intellectual property laws.</p>
              <p><strong>6.2 User Content:</strong> You retain ownership of content you submit to our Service. However, by submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content.</p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">7. Limitation of Liability</h3>
            <p className="text-gray-700 leading-relaxed">
              To the maximum extent permitted by law, Dumb Rent Inc. shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or relating to your use of the Service.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">8. Governing Law</h3>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">9. Contact Information</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p><strong>Dumb Rent Inc.</strong></p>
              <p>123 Broadway, New York, NY 10001</p>
              <p>Email: legal@dumbrent.com</p>
              <p>Phone: (212) 555-1234</p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              By using our service, you agree to these terms and conditions.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#4f46e5] text-white rounded-md hover:bg-[#4f46e5]/90 transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;