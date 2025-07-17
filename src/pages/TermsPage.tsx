import React from 'react';
import Layout from '../components/layout/Layout';
import { ArrowLeft, Shield, Users, Home, CreditCard, AlertTriangle, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsPage: React.FC = () => {
  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <Link 
            to="/"
            className="inline-flex items-center text-[#4f46e5] hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4f46e5]/10 rounded-full mb-6">
            <Scale className="h-8 w-8 text-[#4f46e5]" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
          <p className="text-xl text-gray-600">
            Please read these terms carefully before using Dumb Rent NYC
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Introduction */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-[#4f46e5] mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">1. Introduction</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to Dumb Rent NYC ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your use of our website and services located at dumbrent.com (the "Service") operated by Dumb Rent Inc.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Acceptance of Terms</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              By creating an account, accessing, or using Dumb Rent NYC, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions and our Privacy Policy.
            </p>
            <p className="text-gray-700 leading-relaxed">
              These Terms constitute a legally binding agreement between you and Dumb Rent Inc. If you do not agree to these Terms, you must not use our Service.
            </p>
          </section>

          {/* User Accounts */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-[#4f46e5] mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">3. User Accounts</h3>
            </div>
            <div className="space-y-4 text-gray-700">
              <p><strong>3.1 Account Creation:</strong> To access certain features of our Service, you must create an account. You agree to provide accurate, current, and complete information during registration.</p>
              <p><strong>3.2 Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
              <p><strong>3.3 Account Types:</strong> We offer different account types including tenant accounts and listing owner accounts, each with specific features and responsibilities.</p>
              <p><strong>3.4 Account Termination:</strong> We reserve the right to suspend or terminate your account at any time for violation of these Terms or for any other reason at our sole discretion.</p>
            </div>
          </section>

          {/* Listing Services */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Home className="h-6 w-6 text-[#4f46e5] mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">4. Listing Services</h3>
            </div>
            <div className="space-y-4 text-gray-700">
              <p><strong>4.1 Listing Accuracy:</strong> Listing owners must provide accurate, complete, and up-to-date information about their properties. False or misleading information is strictly prohibited.</p>
              <p><strong>4.2 Property Ownership:</strong> By submitting a listing, you represent and warrant that you are the owner of the property or have proper authorization to list it.</p>
              <p><strong>4.3 Listing Approval:</strong> All listings are subject to our review and approval process. We reserve the right to reject or remove any listing that violates these Terms or our community standards.</p>
              <p><strong>4.4 Listing Content:</strong> You retain ownership of the content you submit, but grant us a license to use, display, and distribute your listing content on our platform.</p>
            </div>
          </section>

          {/* Payment Terms */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <CreditCard className="h-6 w-6 text-[#4f46e5] mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">5. Payment Terms</h3>
            </div>
            <div className="space-y-4 text-gray-700">
              <p><strong>5.1 Subscription Fees:</strong> Listing owners must pay subscription fees to publish their listings. Our pricing structure is as follows:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>First 30 days: $100</li>
                <li>Second 30 days: $50</li>
                <li>Third 30 days: $25</li>
                <li>After 90 days: Free</li>
              </ul>
              <p><strong>5.2 Payment Processing:</strong> All payments are processed securely through our payment partners. We do not store your payment information.</p>
              <p><strong>5.3 Refunds:</strong> Subscription fees are generally non-refundable. However, we may provide refunds at our sole discretion in exceptional circumstances.</p>
              <p><strong>5.4 Cancellation:</strong> You may cancel your subscription at any time. Cancellation will take effect at the end of your current billing period.</p>
            </div>
          </section>

          {/* User Conduct */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-[#4f46e5] mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">6. User Conduct</h3>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>You agree not to use our Service to:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Post false, misleading, or fraudulent content</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Spam or send unsolicited communications</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of our Service</li>
                <li>Collect personal information from other users without consent</li>
                <li>Use our Service for any commercial purpose other than legitimate rental activities</li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h3>
            <div className="space-y-4 text-gray-700">
              <p><strong>7.1 Our Content:</strong> The Service and its original content, features, and functionality are owned by Dumb Rent Inc. and are protected by international copyright, trademark, and other intellectual property laws.</p>
              <p><strong>7.2 User Content:</strong> You retain ownership of content you submit to our Service. However, by submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content.</p>
              <p><strong>7.3 Trademark:</strong> "Dumb Rent NYC" and our logo are trademarks of Dumb Rent Inc. You may not use our trademarks without our prior written consent.</p>
            </div>
          </section>

          {/* Privacy */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">8. Privacy</h3>
            <p className="text-gray-700 leading-relaxed">
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our Service. By using our Service, you agree to the collection and use of information in accordance with our Privacy Policy.
            </p>
          </section>

          {/* Disclaimers */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">9. Disclaimers</h3>
            <div className="space-y-4 text-gray-700">
              <p><strong>9.1 Service Availability:</strong> We strive to maintain continuous service availability but cannot guarantee uninterrupted access. We may suspend or discontinue the Service at any time.</p>
              <p><strong>9.2 Third-Party Content:</strong> We are not responsible for the accuracy, completeness, or reliability of user-generated content or third-party information on our platform.</p>
              <p><strong>9.3 Rental Transactions:</strong> We facilitate connections between tenants and listing owners but are not a party to any rental agreements. All rental transactions are between users.</p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h3>
            <p className="text-gray-700 leading-relaxed">
              To the maximum extent permitted by law, Dumb Rent Inc. shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or relating to your use of the Service.
            </p>
          </section>

          {/* Indemnification */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">11. Indemnification</h3>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify, defend, and hold harmless Dumb Rent Inc. and its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising out of your use of the Service or violation of these Terms.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">12. Governing Law</h3>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of New York.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">13. Changes to Terms</h3>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or through our Service. Your continued use of the Service after changes become effective constitutes acceptance of the new Terms.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">14. Contact Information</h3>
            <div className="text-gray-700 space-y-2">
              <p>If you have any questions about these Terms and Conditions, please contact us:</p>
              <div className="bg-gray-50 p-4 rounded-md">
                <p><strong>Dumb Rent Inc.</strong></p>
                <p>123 Broadway, New York, NY 10001</p>
                <p>Email: info@dumbrent.com</p>
                <p>Phone: (212) 555-1234</p>
              </div>
            </div>
          </section>

          {/* Effective Date */}
          <section className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500 text-center">
              These Terms and Conditions are effective as of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} and were last updated on the same date.
            </p>
          </section>
        </div>

        {/* Back to Top */}
        <div className="text-center mt-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-6 py-3 bg-[#4f46e5] text-white rounded-md hover:bg-[#4f46e5]/90 transition-colors"
          >
            Back to Top
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default TermsPage;