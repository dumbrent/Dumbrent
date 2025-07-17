import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { ArrowLeft, Send, MessageSquare, Star, CheckCircle, AlertCircle } from 'lucide-react';

const FeedbackPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    rating: 0,
    subject: '',
    message: '',
    allowContact: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    'General Feedback',
    'Bug Report',
    'Feature Request',
    'User Experience',
    'Listing Issues',
    'Payment & Billing',
    'Account Issues',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.name || !formData.email || !formData.category || !formData.subject || !formData.message) {
      setError('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    if (formData.rating === 0) {
      setError('Please provide a rating.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Send feedback email using the deployed edge function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-feedback-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit feedback');
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-2xl">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Success Message */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 text-center">
              <div className="inline-block p-3 bg-white/20 rounded-full mb-4">
                <CheckCircle className="h-12 w-12" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Thank You!</h2>
              <p className="text-xl opacity-90">
                Your feedback has been submitted successfully
              </p>
            </div>

            <div className="p-8 text-center">
              <p className="text-lg text-gray-600 mb-6">
                We appreciate you taking the time to share your thoughts with us. Your feedback helps us improve Dumb Rent NYC for everyone.
              </p>
              
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What happens next?</h3>
                <div className="text-left space-y-2 text-gray-700">
                  <p>• Our team will review your feedback within 2-3 business days</p>
                  <p>• If you requested a response, we'll get back to you via email</p>
                  <p>• Bug reports and feature requests are prioritized based on impact</p>
                  <p>• We may follow up if we need additional information</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/"
                  className="flex-1 px-6 py-3 bg-[#4f46e5] text-white font-semibold rounded-md hover:bg-[#4f46e5]/90 transition-colors text-center"
                >
                  Back to Home
                </Link>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      category: '',
                      rating: 0,
                      subject: '',
                      message: '',
                      allowContact: false
                    });
                  }}
                  className="flex-1 px-6 py-3 border border-[#4f46e5] text-[#4f46e5] font-semibold rounded-md hover:bg-[#4f46e5]/5 transition-colors"
                >
                  Submit More Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

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

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4f46e5]/10 rounded-full mb-6">
            <MessageSquare className="h-8 w-8 text-[#4f46e5]" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Share Your Feedback</h1>
          <p className="text-xl text-gray-600">
            Help us improve Dumb Rent NYC with your thoughts and suggestions
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Feedback Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Overall Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className={`p-1 transition-colors ${
                      star <= formData.rating
                        ? 'text-yellow-400 hover:text-yellow-500'
                        : 'text-gray-300 hover:text-yellow-300'
                    }`}
                  >
                    <Star className="h-8 w-8 fill-current" />
                  </button>
                ))}
                <span className="ml-4 text-gray-600">
                  {formData.rating > 0 && (
                    <>
                      {formData.rating} out of 5 stars
                      {formData.rating === 5 && ' - Excellent!'}
                      {formData.rating === 4 && ' - Very Good'}
                      {formData.rating === 3 && ' - Good'}
                      {formData.rating === 2 && ' - Fair'}
                      {formData.rating === 1 && ' - Poor'}
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent"
                placeholder="Brief summary of your feedback"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Your Feedback <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent resize-vertical"
                placeholder="Please share your detailed feedback, suggestions, or report any issues you've encountered..."
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Be as specific as possible to help us understand and address your feedback effectively.
              </p>
            </div>

            {/* Contact Permission */}
            <div className="flex items-start">
              <input
                type="checkbox"
                name="allowContact"
                checked={formData.allowContact}
                onChange={handleInputChange}
                className="h-4 w-4 text-[#4f46e5] rounded focus:ring-[#4f46e5] mt-1 mr-3"
              />
              <label className="text-gray-700">
                I allow Dumb Rent NYC to contact me via email regarding this feedback for follow-up questions or updates.
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#4f46e5] text-white py-3 px-6 rounded-md font-semibold hover:bg-[#4f46e5]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Submitting Feedback...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Submit Feedback
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Additional Information */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Ways to Reach Us</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p><strong>Email:</strong> info@dumbrent.com</p>
                <p><strong>Phone:</strong> (212) 555-1234</p>
              </div>
              <div>
                <p><strong>Response Time:</strong> 2-3 business days</p>
                <p><strong>Priority:</strong> Bug reports get fastest response</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FeedbackPage;