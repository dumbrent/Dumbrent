import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ListingPreview from '../components/listings/ListingPreview';
import TermsModal from '../components/ui/TermsModal';
import { generateListingTitle, generateListingDescription, AIGenerationError } from '../lib/ai';
import { neighborhoods, boroughs, amenities } from '../data/mockData';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Wand2, 
  AlertCircle, 
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { ListingFormData, ListingPreview as ListingPreviewType } from '../types';
import { supabase } from '../lib/supabase';
import AddressAutocomplete from '../components/ui/AddressAutocomplete';
import { clearAuthState, getFreshSupabaseClient, getRedirectUrl } from '../lib/supabase';

const SubmitListingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [titleGenerationError, setTitleGenerationError] = useState<string | null>(null);
  const [descriptionGenerationError, setDescriptionGenerationError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [preview, setPreview] = useState<ListingPreviewType | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailConfirmationNeeded, setEmailConfirmationNeeded] = useState(false);

  const [formData, setFormData] = useState<ListingFormData>({
    title: '',
    price: 0,
    deposit: 0,
    bedrooms: 0,
    bathrooms: 0,
    squareFeet: 0,
    address: '',
    boroughId: '',
    neighborhoodId: '',
    keyFeature: '',
    zipCode: '',
    description: '',
    amenities: [],
    images: [],
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    preferredContact: 'email',
    phone: '',
    availableDate: new Date(),
    agreeToTerms: false,
    notificationConsent: false
  });

  const filteredNeighborhoods = neighborhoods.filter(n => 
    !formData.boroughId || n.boroughId === formData.boroughId
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      const uploadPromises = files.map(async (file, index) => {
        try {
          // Create a local object URL for preview
          const imageUrl = URL.createObjectURL(file);
          
          return imageUrl;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Upload failed';
          
          return null;
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const successfulUploads = uploadedUrls.filter(url => url !== null) as string[];
      
      if (successfulUploads.length > 0) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...successfulUploads]
        }));
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    }

    // Clear the input
    e.target.value = '';
  };

  const removeImage = async (index: number) => {
    const imageUrl = formData.images[index];
    
    // Revoke the object URL to free memory
    if (imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl);
    }
    
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const generateTitle = async () => {
    if (!formData.neighborhoodId || !formData.boroughId || !formData.bedrooms || !formData.bathrooms || !formData.keyFeature) {
      setTitleGenerationError('Please fill in neighborhood, bedrooms, bathrooms, and key feature first');
      return;
    }

    setIsGeneratingTitle(true);
    setTitleGenerationError(null);

    // Debug logging
    console.log('Generate Title Debug:');
    console.log('- OpenAI API Key exists:', !!import.meta.env.VITE_OPENAI_API_KEY);
    console.log('- OpenAI API Key length:', import.meta.env.VITE_OPENAI_API_KEY?.length);
    console.log('- Form data:', {
      neighborhoodId: formData.neighborhoodId,
      boroughId: formData.boroughId,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      keyFeature: formData.keyFeature
    });

    try {
      const neighborhood = neighborhoods.find(n => n.id === formData.neighborhoodId);
      const borough = boroughs.find(b => b.id === formData.boroughId);
      
      if (!neighborhood || !borough) {
        throw new Error('Invalid neighborhood or borough selection');
      }

      console.log('- Found neighborhood:', neighborhood.name);
      console.log('- Found borough:', borough.name);

      const generatedTitle = await generateListingTitle(
        neighborhood.name,
        borough.name,
        formData.bedrooms,
        formData.bathrooms,
        formData.keyFeature
      );

      console.log('- Generated title:', generatedTitle);

      if (generatedTitle) {
        setFormData(prev => ({ ...prev, title: generatedTitle }));
      }
    } catch (error) {
      console.error('Title generation error:', error);
      if (error instanceof AIGenerationError) {
        setTitleGenerationError(error.message);
      } else {
        setTitleGenerationError('Failed to generate title. Please try again or enter manually.');
      }
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  const generateDescription = async () => {
    if (!formData.neighborhoodId || !formData.bedrooms || !formData.bathrooms || !formData.keyFeature) {
      setDescriptionGenerationError('Please fill in neighborhood, bedrooms, bathrooms, and key feature first');
      return;
    }

    setIsGeneratingDescription(true);
    setDescriptionGenerationError(null);

    // Debug logging
    console.log('Generate Description Debug:');
    console.log('- OpenAI API Key exists:', !!import.meta.env.VITE_OPENAI_API_KEY);
    console.log('- OpenAI API Key length:', import.meta.env.VITE_OPENAI_API_KEY?.length);
    console.log('- Form data:', {
      neighborhoodId: formData.neighborhoodId,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      keyFeature: formData.keyFeature,
      amenities: formData.amenities
    });

    try {
      const neighborhood = neighborhoods.find(n => n.id === formData.neighborhoodId);
      
      if (!neighborhood) {
        throw new Error('Invalid neighborhood selection');
      }

      console.log('- Found neighborhood:', neighborhood.name);

      const generatedDescription = await generateListingDescription(
        neighborhood.name,
        formData.bedrooms,
        formData.bathrooms,
        formData.keyFeature,
        formData.amenities
      );

      console.log('- Generated description:', generatedDescription);

      if (generatedDescription) {
        setFormData(prev => ({ ...prev, description: generatedDescription }));
      }
    } catch (error) {
      console.error('Description generation error:', error);
      if (error instanceof AIGenerationError) {
        setDescriptionGenerationError(error.message);
      } else {
        setDescriptionGenerationError('Failed to generate description. Please try again or enter manually.');
      }
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const validateStep1 = () => {
    const errors: string[] = [];

    console.log('Validating form data:', formData); // Debug log

    if (!formData.title.trim()) {
      errors.push('Title is required');
    }
    if (!formData.price || formData.price <= 0) {
      errors.push('Monthly rent must be greater than 0');
    }
    if (!formData.deposit || formData.deposit <= 0) {
      errors.push('Security deposit must be greater than 0');
    }
    if (formData.bedrooms < 0) {
      errors.push('Please select number of bedrooms');
    }
    if (!formData.bathrooms || formData.bathrooms <= 0) {
      errors.push('Please select number of bathrooms');
    }
    if (!formData.address.trim()) {
      errors.push('Address is required');
    }
    if (!formData.zipCode || !formData.zipCode.trim()) {
      errors.push('Zip code is required. Please enter the 5-digit zip code for the property.');
    }
    if (!formData.neighborhoodId) {
      errors.push('Please select a neighborhood');
    }
    if (!formData.boroughId) {
      errors.push('Please select a borough');
    }
    if (!formData.keyFeature) {
      errors.push('Please select a key feature');
    }
    if (!formData.description.trim()) {
      errors.push('Description is required');
    }
    if (!formData.availableDate) {
      errors.push('Available date is required');
    }
    if (formData.images.length === 0) {
      errors.push('At least one image is required');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const validateStep2 = () => {
    const errors: string[] = [];

    if (!formData.displayName.trim()) {
      errors.push('Display name is required');
    }
    if (!formData.email.trim()) {
      errors.push('Email is required');
    }
    if (!formData.password) {
      errors.push('Password is required');
    }
    if (!formData.confirmPassword) {
      errors.push('Please confirm your password');
    }
    if (formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match');
    }
    if (formData.password && formData.password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!formData.agreeToTerms) {
      errors.push('You must agree to the terms and conditions');
    }
    if ((formData.preferredContact === 'phone' || formData.preferredContact === 'text') && !(formData.phone?.trim() || '')) {
      errors.push('Phone number is required for phone or text message contact.');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
        setValidationErrors([]);
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        // Create preview
        const previewData: ListingPreviewType = {
          listing: {
            id: 'preview',
            title: formData.title,
            description: formData.description,
            price: formData.price,
            deposit: formData.deposit,
            bedrooms: formData.bedrooms,
            bathrooms: formData.bathrooms,
            square_feet: formData.squareFeet || 0,
            address: formData.address,
            neighborhood_id: formData.neighborhoodId,
            borough_id: formData.boroughId,
            key_feature: formData.keyFeature,
            amenities: formData.amenities,
            images: formData.images,
            landlord_id: 'preview',
            available_date: formData.availableDate,
            created_at: new Date(),
            updated_at: new Date(),
            status: 'draft'
          },
          landlord: {
            displayName: formData.displayName,
            email: formData.email,
            preferredContact: formData.preferredContact,
            phone: formData.phone
          }
        };
        
        setPreview(previewData);
        setCurrentStep(3);
        setValidationErrors([]);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setPreview(null);
      setValidationErrors([]);
    }
  };

  const handleEdit = () => {
    setCurrentStep(1);
    setPreview(null);
    setValidationErrors([]);
  };

  const handlePublish = async () => {
    if (!preview) return;

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      console.log('SubmitListingPage: Starting payment-first flow...');
      
      // Store listing data in sessionStorage for after payment
      const formDataWithStatus = { ...formData, status: formData.status || 'pending' };
      const storageData = {
        formData: formDataWithStatus,
        preview,
        step: currentStep
      };
      console.log('SubmitListingPage: Storing listing data for payment flow:', storageData);
      sessionStorage.setItem('pending_listing_data', JSON.stringify(storageData));
      
      // Redirect to payment page with a temporary listing ID
      console.log('SubmitListingPage: Redirecting to payment page...');
      navigate('/payment?listing_id=temp', { replace: true });
      
    } catch (error) {
      console.error('Error preparing payment flow:', error);
      setSubmitError('Failed to prepare payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const user = supabase.auth.getUser();
  if (!user) {
    // Save listing data as backup
    sessionStorage.setItem('pending_listing_data', JSON.stringify({ formData, preview, step: currentStep }));
    // Redirect to login/signup
    navigate('/signup');
    return;
  }

  useEffect(() => {
    const saved = sessionStorage.getItem('pending_listing_data');
    if (saved) {
      const { formData, preview, step } = JSON.parse(saved);
      setFormData(formData);
      setPreview(preview);
      setCurrentStep(step || 1);
      // Optionally, show a message to the user
    }
  }, []);

  if (currentStep === 3 && preview) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          {emailConfirmationNeeded && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-blue-400 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Email Confirmation Required</h3>
                  <p className="text-blue-700 mb-3">
                    We've sent a confirmation email to <strong>{formData.email}</strong>. Please check your inbox and click the confirmation link to continue.
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => navigate(`/payment?listing_id=${preview?.listing.id}`)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      I've Confirmed My Email - Continue
                    </button>
                    <button
                      onClick={() => setEmailConfirmationNeeded(false)}
                      className="block px-4 py-2 text-blue-600 text-sm hover:underline"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center text-[#4f46e5] hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-[#4f46e5]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? 'bg-[#4f46e5] text-white' : 'bg-gray-200'
              }`}>
                {currentStep > 1 ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  '1'
                )}
              </div>
              <span className="ml-2 font-medium">Listing Details</span>
            </div>
            
            <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-[#4f46e5]' : 'bg-gray-200'}`}></div>
            
            <div className={`flex items-center ${currentStep >= 2 ? 'text-[#4f46e5]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? 'bg-[#4f46e5] text-white' : 'bg-gray-200'
              }`}>
                {currentStep > 2 ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  '2'
                )}
              </div>
              <span className="ml-2 font-medium">Account Setup</span>
            </div>
            
            <div className={`w-16 h-1 ${currentStep >= 3 ? 'bg-[#4f46e5]' : 'bg-gray-200'}`}></div>
            
            <div className={`flex items-center ${currentStep >= 3 ? 'text-[#4f46e5]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 3 ? 'bg-[#4f46e5] text-white' : 'bg-gray-200'
              }`}>
                3
              </div>
              <span className="ml-2 font-medium">Preview & Payment</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h3>
                  <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                    {validationErrors.map(error => (
                      <li>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Debug Info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs">
              <strong>Debug:</strong> Address: "{formData.address}", Zip: "{formData.zipCode}", Key Feature: "{formData.keyFeature}"
            </div>
          )}

          {currentStep === 1 && (
            <>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Step 1 of 3: Listing Details</h1>
              <p className="text-gray-600 mb-8">Tell us about your property. The more details you provide, the better your chances of finding the right tenant.</p>
              
              {/* Helpful Tips */}
              <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">💡 Helpful Tips:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Use the AI generator to create compelling titles and descriptions</li>
                  <li>• Upload high-quality photos to attract more tenants</li>
                  <li>• Be specific about amenities and key features</li>
                  <li>• Accurate pricing helps you find qualified tenants faster</li>
                </ul>
              </div>
              <form className="space-y-8">
                {/* Basic Information */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Listing Title *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent"
                          placeholder="e.g., Beautiful 2BR Apartment in Manhattan"
                          required
                        />
                        <button
                          type="button"
                          onClick={generateTitle}
                          disabled={isGeneratingTitle}
                          className="px-4 py-3 bg-[#4f46e5] text-white rounded-md hover:bg-[#4f46e5]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          title="Generate title with AI"
                        >
                          {isGeneratingTitle ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Wand2 className="h-4 w-4" />
                          )}
                          {isGeneratingTitle ? 'Generating...' : 'AI Generate'}
                        </button>
                      </div>
                      {titleGenerationError && (
                        <p className="mt-2 text-sm text-red-600">{titleGenerationError}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Monthly Rent *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500">$</span>
                        <input
                          type="number"
                          name="price"
                          value={formData.price || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent"
                          placeholder="3000"
                          min="1"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Security Deposit *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500">$</span>
                        <input
                          type="number"
                          name="deposit"
                          value={formData.deposit || ''}
                          onChange={handleInputChange}
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent"
                          placeholder="3000"
                          min="1"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Bedrooms *
                      </label>
                      <select
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent"
                        required
                      >
                        <option value="">Select bedrooms</option>
                        <option value="0">Studio</option>
                        <option value="1">1 Bedroom</option>
                        <option value="2">2 Bedrooms</option>
                        <option value="3">3 Bedrooms</option>
                        <option value="4">4 Bedrooms</option>
                        <option value="5">5+ Bedrooms</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Bathrooms *
                      </label>
                      <select
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent"
                        required
                      >
                        <option value="">Select bathrooms</option>
                        <option value="1">1 Bathroom</option>
                        <option value="1.5">1.5 Bathrooms</option>
                        <option value="2">2 Bathrooms</option>
                        <option value="2.5">2.5 Bathrooms</option>
                        <option value="3">3 Bathrooms</option>
                        <option value="3.5">3.5 Bathrooms</option>
                        <option value="4">4+ Bathrooms</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Square Feet
                      </label>
                      <input
                        type="number"
                        name="squareFeet"
                        value={formData.squareFeet || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent"
                        placeholder="800"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Available Date *
                      </label>
                      <input
                        type="date"
                        name="availableDate"
                        value={formData.availableDate instanceof Date ? formData.availableDate.toISOString().split('T')[0] : formData.availableDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, availableDate: new Date(e.target.value) }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Location</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Address *
                      </label>
                      <AddressAutocomplete
                        value={formData.address}
                        onInputChange={(address) => setFormData(prev => ({ ...prev, address }))}
                        onSelect={(address, zipCode) => setFormData(prev => ({ ...prev, address, zipCode }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent"
                        placeholder="Enter the full property address (e.g., 123 Main St, New York, NY)"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        💡 Enter the complete address including street, city, and state
                      </p>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Zip Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent"
                        placeholder="Enter zip code manually"
                        pattern="[0-9]{5}"
                        maxLength={5}
                        required
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Enter manually if not auto-filled from address
                      </p>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Borough *
                      </label>
                      <select
                        name="boroughId"
                        value={formData.boroughId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent"
                        required
                      >
                        <option value="">Select borough</option>
                        {boroughs.map((borough) => (
                          <option key={borough.id} value={borough.id}>
                            {borough.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Neighborhood *
                      </label>
                      <select
                        name="neighborhoodId"
                        value={formData.neighborhoodId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent"
                        disabled={!formData.boroughId}
                        required
                      >
                        <option value="">
                          {formData.boroughId ? 'Select neighborhood' : 'Select a borough first'}
                        </option>
                        {filteredNeighborhoods.map((neighborhood) => (
                          <option key={neighborhood.id} value={neighborhood.id}>
                            {neighborhood.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Key Feature *
                      </label>
                      <select
                        name="keyFeature"
                        value={formData.keyFeature}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent"
                        required
                      >
                        <option value="">Select a key feature</option>
                        <option value="Stunning City Views">Stunning City Views</option>
                        <option value="Private Outdoor Space">Private Outdoor Space</option>
                        <option value="Modern Kitchen">Modern Kitchen</option>
                        <option value="Luxury Finishes">Luxury Finishes</option>
                        <option value="High Ceilings">High Ceilings</option>
                        <option value="Natural Light">Natural Light</option>
                        <option value="Renovated">Recently Renovated</option>
                        <option value="Doorman Building">Doorman Building</option>
                        <option value="Elevator Building">Elevator Building</option>
                        <option value="Pet Friendly">Pet Friendly</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Description</h2>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Property Description *
                    </label>
                    <div className="flex flex-col gap-2">
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent resize-vertical"
                        placeholder="Describe your property in detail. Include what makes it special, nearby amenities, and any unique features..."
                        required
                      />
                      <button
                        type="button"
                        onClick={generateDescription}
                        disabled={isGeneratingDescription}
                        className="self-start px-4 py-2 bg-[#4f46e5] text-white rounded-md hover:bg-[#4f46e5]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        title="Generate description with AI"
                      >
                        {isGeneratingDescription ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Wand2 className="h-4 w-4" />
                        )}
                        {isGeneratingDescription ? 'Generating...' : 'AI Generate Description'}
                      </button>
                    </div>
                    {descriptionGenerationError && (
                      <p className="mt-2 text-sm text-red-600">{descriptionGenerationError}</p>
                    )}
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Amenities</h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`amenity-${amenity}`}
                          checked={formData.amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                          className="h-4 w-4 text-[#4f46e5] rounded focus:ring-[#4f46e5]"
                        />
                        <label
                          htmlFor={`amenity-${amenity}`}
                          className="ml-2 text-sm text-gray-700 cursor-pointer"
                        >
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Images */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Photos *</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#4f46e5] transition-colors">
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-lg font-medium text-gray-700 mb-2">Upload Property Photos</p>
                          <p className="text-gray-500">Click to select multiple images or drag and drop</p>
                          <p className="text-sm text-gray-400 mt-2">Supported formats: JPG, PNG, WebP (Max 10MB each)</p>
                        </div>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Image Preview */}
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Property image ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            {index === 0 && (
                              <div className="absolute bottom-2 left-2 bg-[#4f46e5] text-white text-xs px-2 py-1 rounded">
                                Main Photo
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-3 bg-[#4f46e5] text-white font-semibold rounded-md hover:bg-[#4f46e5]/90 transition-colors"
                  >
                    Next: Account Setup
                  </button>
                </div>
              </form>
            </>
          )}

          {currentStep === 2 && (
            <>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Account Setup</h1>
              <p className="text-gray-600 mb-8">Create your landlord account to manage your listings</p>

              {/* Helpful Tips */}
              <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">💡 Account Setup Tips:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Use your real name as it will be displayed to potential tenants</li>
                  <li>• Choose a strong password with at least 8 characters</li>
                  <li>• Provide a phone number for faster communication with tenants</li>
                  <li>• Select your preferred contact method for tenant inquiries</li>
                </ul>
              </div>

              <form className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Display Name *
                      </label>
                      <input
                        type="text"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent"
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent"
                          placeholder="Create a strong password"
                          minLength={8}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Must be at least 8 characters long</p>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent"
                          placeholder="Confirm your password"
                          minLength={8}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Preferences */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Preferences</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Preferred Contact Method
                      </label>
                      <select
                        name="preferredContact"
                        value={formData.preferredContact}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent"
                      >
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="text">Text Message</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent"
                        placeholder="(555) 123-4567"
                        required
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Phone number is required for both phone and text message contact methods.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Terms and Notifications */}
                <div className="space-y-4">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#4f46e5] rounded focus:ring-[#4f46e5] mt-1 mr-3"
                      required
                    />
                    <label className="text-gray-700">
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={() => setShowTermsModal(true)}
                        className="text-[#4f46e5] hover:underline"
                      >
                        Terms and Conditions
                      </button>{' '}
                      and{' '}
                      <a href="/privacy" target="_blank" className="text-[#4f46e5] hover:underline">
                        Privacy Policy
                      </a>
                      . *
                    </label>
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="notificationConsent"
                      checked={formData.notificationConsent}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#4f46e5] rounded focus:ring-[#4f46e5] mt-1 mr-3"
                    />
                    <label className="text-gray-700">
                      I would like to receive email notifications about new applications, messages, and important updates.
                    </label>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-3 bg-[#4f46e5] text-white font-semibold rounded-md hover:bg-[#4f46e5]/90 transition-colors"
                  >
                    Preview Listing
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Terms Modal */}
        <TermsModal 
          isOpen={showTermsModal}
          onClose={() => setShowTermsModal(false)}
        />
      </div>
    </Layout>
  );
};

export default SubmitListingPage;