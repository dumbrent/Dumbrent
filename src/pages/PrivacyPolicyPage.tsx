import React from 'react';
import Layout from '../components/layout/Layout';
import { ArrowLeft, Shield, Eye, Lock, Database, Users, Globe, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage: React.FC = () => {
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
            <Shield className="h-8 w-8 text-[#4f46e5]" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600">
            How we collect, use, and protect your personal information
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Introduction */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Eye className="h-6 w-6 text-[#4f46e5] mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">1. Introduction</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              At Dumb Rent NYC ("we," "our," or "us"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By using our Service, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with our policies and practices, please do not use our Service.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Database className="h-6 w-6 text-[#4f46e5] mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">2. Information We Collect</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Personal Information</h3>
                <p className="text-gray-700 mb-3">We may collect the following personal information:</p>
                <ul className="list-disc list-inside ml-4 space-y-2 text-gray-700">
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Account credentials (username, password)</li>
                  <li>Profile information (display name, preferences)</li>
                  <li>Property listing information (for landlords)</li>
                  <li>Application information (for tenants)</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                  <li>Communication records (messages, support inquiries)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Automatically Collected Information</h3>
                <p className="text-gray-700 mb-3">When you use our Service, we automatically collect:</p>
                <ul className="list-disc list-inside ml-4 space-y-2 text-gray-700">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data (pages visited, time spent, features used)</li>
                  <li>Location information (general geographic location)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 Information from Third Parties</h3>
                <p className="text-gray-700 mb-3">We may receive information from:</p>
                <ul className="list-disc list-inside ml-4 space-y-2 text-gray-700">
                  <li>Social media platforms (if you choose to connect your accounts)</li>
                  <li>Payment processors (transaction information)</li>
                  <li>Analytics providers (usage statistics)</li>
                  <li>Public records (property information verification)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-[#4f46e5] mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">3. How We Use Your Information</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <p><strong>3.1 Service Provision:</strong> To provide, maintain, and improve our rental platform services.</p>
              <p><strong>3.2 Account Management:</strong> To create and manage your account, authenticate users, and provide customer support.</p>
              <p><strong>3.3 Communication:</strong> To send you service-related notifications, updates, and respond to your inquiries.</p>
              <p><strong>3.4 Matching Services:</strong> To connect tenants with suitable rental properties and landlords with qualified tenants.</p>
              <p><strong>3.5 Payment Processing:</strong> To process subscription payments and manage billing (through secure third-party processors).</p>
              <p><strong>3.6 Safety and Security:</strong> To verify identities, prevent fraud, and ensure platform safety.</p>
              <p><strong>3.7 Analytics and Improvement:</strong> To analyze usage patterns and improve our services.</p>
              <p><strong>3.8 Legal Compliance:</strong> To comply with applicable laws and regulations.</p>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Globe className="h-6 w-6 text-[#4f46e5] mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">4. Information Sharing and Disclosure</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <p><strong>4.1 With Other Users:</strong> Listing information is shared with potential tenants; tenant application information is shared with relevant landlords.</p>
              <p><strong>4.2 Service Providers:</strong> We share information with trusted third-party service providers who assist in operating our platform (payment processors, hosting providers, analytics services).</p>
              <p><strong>4.3 Legal Requirements:</strong> We may disclose information when required by law, court order, or to protect our rights and safety.</p>
              <p><strong>4.4 Business Transfers:</strong> Information may be transferred in connection with mergers, acquisitions, or asset sales.</p>
              <p><strong>4.5 Consent:</strong> We may share information with your explicit consent for specific purposes.</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mt-6">
              <h4 className="font-semibold text-gray-900 mb-2">We Do NOT:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Sell your personal information to third parties</li>
                <li>Share your information for marketing purposes without consent</li>
                <li>Provide access to your private messages or personal data to unauthorized parties</li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Lock className="h-6 w-6 text-[#4f46e5] mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">5. Data Security</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <p><strong>5.1 Security Measures:</strong> We implement industry-standard security measures including encryption, secure servers, and access controls to protect your information.</p>
              <p><strong>5.2 Data Transmission:</strong> All data transmission is encrypted using SSL/TLS protocols.</p>
              <p><strong>5.3 Access Controls:</strong> We limit access to personal information to authorized personnel who need it for business purposes.</p>
              <p><strong>5.4 Regular Monitoring:</strong> We regularly monitor our systems for potential vulnerabilities and attacks.</p>
              <p><strong>5.5 Incident Response:</strong> We have procedures in place to respond to data breaches and will notify affected users as required by law.</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
              <p className="text-yellow-800 text-sm">
                <strong>Important:</strong> While we strive to protect your information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.
              </p>
            </div>
          </section>

          {/* Your Rights and Choices */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights and Choices</h2>
            
            <div className="space-y-4 text-gray-700">
              <p><strong>6.1 Account Information:</strong> You can update your account information at any time through your profile settings.</p>
              <p><strong>6.2 Communication Preferences:</strong> You can opt out of non-essential communications through your account settings or unsubscribe links.</p>
              <p><strong>6.3 Data Access:</strong> You can request access to the personal information we have about you.</p>
              <p><strong>6.4 Data Correction:</strong> You can request correction of inaccurate personal information.</p>
              <p><strong>6.5 Data Deletion:</strong> You can request deletion of your personal information, subject to legal and business requirements.</p>
              <p><strong>6.6 Data Portability:</strong> You can request a copy of your personal information in a portable format.</p>
              <p><strong>6.7 Account Deletion:</strong> You can delete your account at any time, which will remove your personal information from our active systems.</p>
            </div>
          </section>

          {/* Cookies and Tracking */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking Technologies</h2>
            
            <div className="space-y-4 text-gray-700">
              <p><strong>7.1 Cookies:</strong> We use cookies to enhance your experience, remember your preferences, and analyze site usage.</p>
              <p><strong>7.2 Types of Cookies:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Essential cookies (required for site functionality)</li>
                <li>Performance cookies (analytics and site improvement)</li>
                <li>Functional cookies (user preferences and settings)</li>
                <li>Targeting cookies (personalized content and advertising)</li>
              </ul>
              <p><strong>7.3 Cookie Control:</strong> You can control cookies through your browser settings, though disabling certain cookies may affect site functionality.</p>
              <p><strong>7.4 Third-Party Tracking:</strong> We may use third-party analytics services that use their own cookies and tracking technologies.</p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our Service is not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us, and we will delete such information from our files.
            </p>
          </section>

          {/* International Users */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Users</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our services are primarily intended for users in the United States, specifically New York City. If you are accessing our Service from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By using our Service, you consent to the transfer of your information to the United States and the application of United States privacy laws.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2 text-gray-700 mb-4">
              <li>Posting the updated Privacy Policy on our website</li>
              <li>Sending you an email notification (if you have an account)</li>
              <li>Displaying a prominent notice on our platform</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Your continued use of our Service after the effective date of the updated Privacy Policy constitutes acceptance of the changes.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Mail className="h-6 w-6 text-[#4f46e5] mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">11. Contact Us</h2>
            </div>
            <div className="text-gray-700 space-y-2">
              <p>If you have any questions about this Privacy Policy or our privacy practices, please contact us:</p>
              <div className="bg-gray-50 p-4 rounded-md">
                <p><strong>Dumb Rent Inc.</strong></p>
                <p>123 Broadway, New York, NY 10001</p>
                <p>Email: info@dumbrent.com</p>
                <p>Phone: (212) 555-1234</p>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                For data protection inquiries specifically, please use the subject line "Privacy Inquiry" in your email.
              </p>
            </div>
          </section>

          {/* Effective Date */}
          <section className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500 text-center">
              This Privacy Policy is effective as of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} and was last updated on the same date.
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

export default PrivacyPolicyPage;