import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { boroughs, neighborhoods, featureTypes } from '../data/mockData';
import { ArrowLeft, Upload, X, CheckCircle, UserPlus, ArrowRight } from 'lucide-react';

const SubmitHighlightPage: React.FC = () => {
  const [selectedBorough, setSelectedBorough] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    displayName: '',
    email: ''
  });

  const filteredNeighborhoods = selectedBorough
    ? neighborhoods.filter(n => n.boroughId === selectedBorough)
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Extract form data
    const form = e.target as HTMLFormElement;
    const formDataObj = new FormData(form);
    
    setFormData({
      displayName: formDataObj.get('displayName') as string,
      email: formDataObj.get('email') as string
    });
    
    setTimeout(() => {
      setFormSubmitted(true);
    }, 1000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // For now, just create a local URL for the uploaded image
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }
    setUploadedImage(null);
    setUploadError(null);
  };

  if (formSubmitted) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Success Message */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 text-center">
              <div className="inline-block p-3 bg-white/20 rounded-full mb-4">
                <CheckCircle className="h-12 w-12" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Highlight Submitted Successfully!</h2>
              <p className="text-xl opacity-90">
                Thank you for contributing to our neighborhood guide!
              </p>
            </div>

            <div className="p-8">
              <div className="text-center mb-8">
                <p className="text-lg text-gray-600 mb-4">
                  Your submission will be reviewed and added to the neighborhood page soon.
                </p>
              </div>

              {/* Signup Call-to-Action */}
              <div className="bg-gradient-to-r from-[#4f46e5] to-[#4338ca] rounded-xl p-8 text-white mb-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-white/20 rounded-full p-3 mr-4">
                    <UserPlus className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">Join Dumb Rent NYC!</h3>
                    <p className="text-white/90">Get access to exclusive features and stay updated</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="bg-white/20 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <h4 className="font-semibold mb-1">Save Favorites</h4>
                    <p className="text-sm text-white/80">Bookmark listings you love</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white/20 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <h4 className="font-semibold mb-1">Track Applications</h4>
                    <p className="text-sm text-white/80">Monitor your rental applications</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white/20 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <h4 className="font-semibold mb-1">Get Notifications</h4>
                    <p className="text-sm text-white/80">Stay updated on new listings</p>
                  </div>
                </div>

                <div className="text-center">
                  <Link 
                    to={`/signup?name=${encodeURIComponent(formData.displayName)}&email=${encodeURIComponent(formData.email)}`}
                    className="inline-flex items-center px-8 py-3 bg-white text-[#4f46e5] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Create Free Account
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                  <p className="text-sm text-white/70 mt-3">
                    We'll pre-fill your information to make signup quick and easy
                  </p>
                </div>
              </div>

              {/* Alternative Actions */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link 
                    to="/neighborhoods"
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-md hover:bg-gray-200 transition-colors text-center"
                  >
                    View Neighborhoods
                  </Link>
                  <button 
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({ displayName: '', email: '' });
                    }}
                    className="px-6 py-3 border border-[#4f46e5] text-[#4f46e5] font-semibold rounded-md hover:bg-[#4f46e5]/5 transition-colors"
                  >
                    Submit Another Highlight
                  </button>
                </div>
                
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-500">
                    Already have an account? <Link to="/login" className="text-[#4f46e5] hover:underline">Sign in here</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <Link 
            to="/"
            className="inline-flex items-center text-blue-600 hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Add a Neighborhood Highlight</h1>
          <p className="text-gray-600">
            Share your knowledge about local restaurants, parks, landmarks, and more
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Location
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-1">Borough</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedBorough}
                  onChange={(e) => setSelectedBorough(e.target.value)}
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
                <label className="block text-gray-700 mb-1">Neighborhood</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!selectedBorough}
                  required
                >
                  <option value="">
                    {selectedBorough ? 'Select neighborhood' : 'Select a borough first'}
                  </option>
                  {filteredNeighborhoods.map((neighborhood) => (
                    <option key={neighborhood.id} value={neighborhood.id}>
                      {neighborhood.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Highlight Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 mb-1">Highlight Type</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select highlight type</option>
                  {featureTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Central Park, Joe's Pizza"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-1">Address</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Full address of the highlight"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Description</label>
              <textarea 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                placeholder="Describe this highlight and why it's notable"
                required
              ></textarea>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Photo
            </h2>
            
            {uploadError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{uploadError}</p>
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="photo-upload">
                <div className={`px-4 py-2 flex items-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <Upload className="h-5 w-5 mr-2" />
                  {isUploading ? 'Uploading...' : 'Upload Photo'}
                </div>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-gray-500 mt-1">
                Upload a high-quality photo of this highlight (optional)
              </p>
            </div>
            
            {uploadedImage && (
              <div className="relative inline-block">
                <img
                  src={uploadedImage}
                  alt="Uploaded highlight"
                  className="h-48 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Your Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-1">Display Name</label>
                <input 
                  type="text" 
                  name="displayName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your display name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  name="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your email address"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <div className="mb-6">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 mt-1 mr-2"
                  required
                />
                <label htmlFor="terms" className="text-gray-700">
                  I confirm that all information provided is accurate and I have the right to share this information. I understand that submissions are reviewed before being published. I agree to the{' '}
                  <Link to="/terms" className="text-blue-600 hover:underline" target="_blank">
                    Terms and Conditions
                  </Link>.
                </label>
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={isUploading}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading Photo...' : 'Submit Highlight'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default SubmitHighlightPage;