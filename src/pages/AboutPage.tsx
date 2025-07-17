import React from 'react';
import Layout from '../components/layout/Layout';
import { Building2, Users, MapPin, Shield, DollarSign, CheckCircle, Clock, Gift } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#4f46e5] to-[#4338ca] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About Dumb Rent NYC
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Your trusted partner in finding the perfect NYC apartment, with detailed neighborhood insights and transparent pricing that gets better over time.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-8">
              We're on a mission to make apartment hunting in New York City simpler, more transparent, and more enjoyable. By combining comprehensive listings with local insights and fair pricing, we help both renters find their perfect home and landlords connect with quality tenants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <div className="text-center">
              <div className="bg-[#4f46e5]/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-[#4f46e5]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Quality Listings</h3>
              <p className="text-gray-600">
                Curated rental listings from verified landlords across all five boroughs
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#4f46e5]/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-[#4f46e5]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Community Driven</h3>
              <p className="text-gray-600">
                Local insights and recommendations from real New Yorkers
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#4f46e5]/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-[#4f46e5]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Neighborhood Focus</h3>
              <p className="text-gray-600">
                Detailed guides and information about NYC's diverse neighborhoods
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#4f46e5]/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-[#4f46e5]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Trusted Platform</h3>
              <p className="text-gray-600">
                Verified listings and secure communication with landlords
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What You Can Expect</h2>
            <p className="text-lg text-gray-600">
              Whether you're searching for your next home or listing your property, here's what makes Dumb Rent NYC different.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* For Renters */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">For Renters</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">No Hidden Fees</h4>
                    <p className="text-gray-600">Browse and apply to listings completely free</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Detailed Neighborhood Guides</h4>
                    <p className="text-gray-600">Get insider knowledge about local amenities, transportation, and culture</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Direct Communication</h4>
                    <p className="text-gray-600">Message landlords directly without intermediaries</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Save & Track Applications</h4>
                    <p className="text-gray-600">Keep track of your favorite listings and application status</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Landlords */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">For Landlords</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Quality Tenant Pool</h4>
                    <p className="text-gray-600">Connect with serious renters actively searching for homes</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Easy Listing Management</h4>
                    <p className="text-gray-600">Simple tools to create, edit, and manage your property listings</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Application Tracking</h4>
                    <p className="text-gray-600">Review and manage tenant applications in one place</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Fair Pricing Model</h4>
                    <p className="text-gray-600">Transparent pricing that decreases over time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Simple, Fair Pricing for Landlords</h2>
            <p className="text-lg text-gray-600 mb-12">
              Our pricing gets better over time. The longer your listing stays active, the less you pay.
            </p>

            <div className="bg-gradient-to-r from-[#4f46e5] to-[#4338ca] rounded-2xl p-8 text-white mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-white/20 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">$100</h3>
                  <p className="text-white/90">First 30 days</p>
                </div>

                <div className="text-center">
                  <div className="bg-white/20 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">$50</h3>
                  <p className="text-white/90">Next 30 days</p>
                </div>

                <div className="text-center">
                  <div className="bg-white/20 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">$25</h3>
                  <p className="text-white/90">Following 30 days</p>
                </div>

                <div className="text-center">
                  <div className="bg-white/20 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Gift className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">FREE</h3>
                  <p className="text-white/90">After 90 days</p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-white/10 rounded-lg">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 mr-2" />
                  <span className="text-lg font-semibold">Cancel anytime!</span>
                </div>
                <p className="text-white/90 text-center">
                  No long-term contracts or hidden fees. Your listing stays free until it's rented or you remove it.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-gray-50 rounded-lg p-6">
                <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
                <h4 className="text-lg font-semibold text-gray-800 mb-2">No Setup Fees</h4>
                <p className="text-gray-600">Get started immediately with no upfront costs or hidden charges.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Flexible Cancellation</h4>
                <p className="text-gray-600">Cancel your listing subscription at any time without penalties.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Free After 90 Days</h4>
                <p className="text-gray-600">If your property hasn't rented in 90 days, we'll list it for free.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of New Yorkers who have found their perfect home or connected with quality tenants through Dumb Rent NYC.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/signup" 
                className="inline-block px-8 py-3 bg-[#4f46e5] text-white font-semibold rounded-md hover:bg-[#4f46e5]/90 transition-colors"
              >
                Start Browsing Listings
              </a>
              <a 
                href="/submit-listing" 
                className="inline-block px-8 py-3 border-2 border-[#4f46e5] text-[#4f46e5] font-semibold rounded-md hover:bg-[#4f46e5]/5 transition-colors"
              >
                List Your Property
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;