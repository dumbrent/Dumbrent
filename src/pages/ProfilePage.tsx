import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ListingManagement from '../components/listings/ListingManagement';
import { supabase } from '../lib/supabase';
import { getUserApplications } from '../lib/applications';
import { getMessages } from '../lib/messages';
import { getTenantSavedListings, updateSavedListingNotes } from '../lib/savedListings';
import { neighborhoods, boroughs } from '../data/mockData';
import { Heart, MessageSquare, Key, CheckCircle, XCircle, Bookmark, FileText, Clock, Edit3, Save, X, Building } from 'lucide-react';

interface UserProfile {
  display_name: string;
  role: 'tenant' | 'listing_owner' | 'admin';
  email_notifications: boolean;
}

interface PendingItem {
  id: string;
  title?: string;
  name?: string;
  description: string;
  created_at: string;
  submitted_by?: string;
  status: 'pending' | 'approved' | 'rejected';
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [favoriteListings, setFavoriteListings] = useState<any[]>([]);
  const [myListings, setMyListings] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [pendingListings, setPendingListings] = useState<PendingItem[]>([]);
  const [pendingHighlights, setPendingHighlights] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [savedListings, setSavedListings] = useState<any[]>([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesForm, setNotesForm] = useState('');

  useEffect(() => {
    // Check for tab parameter in URL
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
    
    loadUserProfile();
  }, [searchParams]);

  const loadUserProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('display_name, role, email_notifications')
        .eq('user_id', session.user.id)
        .single();

      if (profileError) throw profileError;

      if (profileData) {
        setProfile(profileData);

        // Load additional data based on user role
        if (profileData.role === 'admin') {
          await loadPendingItems();
        } else if (profileData.role === 'listing_owner') {
          await loadMyListings();
        }

        // Load common data
        await Promise.all([
          loadFavoriteListings(),
          loadMessages(),
          loadSavedListings(),
          loadApplications()
        ]);
      }

      setError(null);
    } catch (err) {
      console.error('Error loading user profile:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    try {
      console.log('Loading applications...');
      
      if (profile?.role === 'admin') {
        // For admins, load all applications
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
          .from('applications')
          .select(`
            *,
            listings (
              id,
              title,
              address,
              price,
              neighborhood_id,
              borough_id,
              images:listing_images (
                url
              )
            ),
            tenant:user_profiles!applications_tenant_id_fkey (
              display_name,
              email_notifications
            ),
            landlord:user_profiles!applications_landlord_id_fkey (
              display_name,
              email_notifications
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setApplications(data || []);
      } else {
        // For regular users, load only their own applications
        const data = await getUserApplications();
        setApplications(data || []);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
    }
  };

  const loadFavoriteListings = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('favorite_listings')
        .select(`
          listing_id,
          listings (
            id,
            title,
            description,
            price,
            address,
            images: listing_images (
              url
            )
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavoriteListings(data || []);
    } catch (error) {
      console.error('Error loading favorite listings:', error);
    }
  };

  const loadMyListings = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('listings')
        .select(`
          id,
          title,
          description,
          price,
          status,
          created_at,
          images: listing_images (
            url
          )
        `)
        .eq('landlord_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyListings(data || []);
    } catch (error) {
      console.error('Error loading my listings:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const data = await getMessages(session.user.id);
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const loadPendingItems = async () => {
    try {
      // Load pending listings
      const { data: listings, error: listingsError } = await supabase
        .from('listings')
        .select('id, title, description, created_at, landlord_id, status')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (listingsError) throw listingsError;
      setPendingListings(listings || []);

      // Load pending neighborhood highlights
      const { data: highlights, error: highlightsError } = await supabase
        .from('neighborhood_highlights')
        .select('id, name, description, created_at, submitted_by, status')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (highlightsError) throw highlightsError;
      setPendingHighlights(highlights || []);
    } catch (error) {
      console.error('Error loading pending items:', error);
    }
  };

  const loadSavedListings = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      if (profile?.role === 'admin') {
        const { data, error } = await supabase
          .from('admin_saved_listings')
          .select(`
            id,
            notes,
            flagged,
            flag_reason,
            created_at,
            listings (
              id,
              title,
              description,
              price,
              address
            )
          `)
          .eq('admin_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setSavedListings(data || []);
      } else if (profile?.role === 'tenant') {
        const data = await getTenantSavedListings();
        setSavedListings(data || []);
      }
    } catch (error) {
      console.error('Error loading saved listings:', error);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ 
        password: passwordForm.newPassword 
      });

      if (error) throw error;

      setPasswordSuccess(true);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Close modal after 2 seconds
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
      }, 2000);

    } catch (err) {
      console.error('Error changing password:', err);
      setPasswordError(err instanceof Error ? err.message : 'Failed to change password');
    }
  };

  const handleNotesEdit = (savedListingId: string, currentNotes: string) => {
    setEditingNotes(savedListingId);
    setNotesForm(currentNotes || '');
  };

  const handleNotesSave = async (savedListingId: string) => {
    try {
      await updateSavedListingNotes(savedListingId, notesForm);
      setEditingNotes(null);
      setNotesForm('');
      // Reload saved listings to show updated notes
      await loadSavedListings();
    } catch (error) {
      console.error('Error updating notes:', error);
      alert('Failed to update notes. Please try again.');
    }
  };

  const handleNotesCancel = () => {
    setEditingNotes(null);
    setNotesForm('');
  };

  const formatPrice = (price: number) => {
    return price ? new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price) : '';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-50';
      case 'rejected':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getNeighborhoodName = (neighborhoodId: string) => {
    const neighborhood = neighborhoods.find(n => n.id === neighborhoodId);
    return neighborhood ? neighborhood.name : '';
  };

  const getBoroughName = (boroughId: string) => {
    const borough = boroughs.find(b => b.id === boroughId);
    return borough ? borough.name : '';
  };

  const handleListingUpdate = () => {
    loadMyListings();
  };

  const handleApproveListing = async (listingId: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ status: 'published' })
        .eq('id', listingId);

      if (error) throw error;

      // Reload pending items
      await loadPendingItems();
      alert('Listing approved successfully!');
    } catch (error) {
      console.error('Error approving listing:', error);
      alert('Failed to approve listing. Please try again.');
    }
  };

  const handleRejectListing = async (listingId: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ status: 'archived' })
        .eq('id', listingId);

      if (error) throw error;

      // Reload pending items
      await loadPendingItems();
      alert('Listing rejected successfully!');
    } catch (error) {
      console.error('Error rejecting listing:', error);
      alert('Failed to reject listing. Please try again.');
    }
  };

  const handleApproveHighlight = async (highlightId: string) => {
    try {
      const { error } = await supabase
        .from('neighborhood_highlights')
        .update({ status: 'approved' })
        .eq('id', highlightId);

      if (error) throw error;

      // Reload pending items
      await loadPendingItems();
      alert('Highlight approved successfully!');
    } catch (error) {
      console.error('Error approving highlight:', error);
      alert('Failed to approve highlight. Please try again.');
    }
  };

  const handleRejectHighlight = async (highlightId: string) => {
    try {
      const { error } = await supabase
        .from('neighborhood_highlights')
        .update({ status: 'rejected' })
        .eq('id', highlightId);

      if (error) throw error;

      // Reload pending items
      await loadPendingItems();
      alert('Highlight rejected successfully!');
    } catch (error) {
      console.error('Error rejecting highlight:', error);
      alert('Failed to reject highlight. Please try again.');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4f46e5]"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Profile not found</h2>
          <p className="text-gray-600 mb-4">Please try logging in again</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-[#4f46e5] text-white rounded-md hover:bg-[#4f46e5]/90"
          >
            Go to Login
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.display_name}</h1>
              <p className="text-gray-600">Role: {profile.role}</p>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Key className="h-5 w-5" />
              Change Password
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200 overflow-x-auto">
          <button
            className={`pb-4 px-2 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-b-2 border-[#4f46e5] text-[#4f46e5]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`pb-4 px-2 whitespace-nowrap ${
              activeTab === 'applications'
                ? 'border-b-2 border-[#4f46e5] text-[#4f46e5]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('applications')}
          >
            {profile.role === 'admin' ? 'All Applications' : 'My Applications'}
          </button>
          <button
            className={`pb-4 px-2 whitespace-nowrap ${
              activeTab === 'saved'
                ? 'border-b-2 border-[#4f46e5] text-[#4f46e5]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('saved')}
          >
            Saved Listings
          </button>
          {profile.role === 'listing_owner' && (
            <button
              className={`pb-4 px-2 whitespace-nowrap ${
                activeTab === 'listings'
                  ? 'border-b-2 border-[#4f46e5] text-[#4f46e5]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('listings')}
            >
              My Listings
            </button>
          )}
          <button
            className={`pb-4 px-2 whitespace-nowrap ${
              activeTab === 'messages'
                ? 'border-b-2 border-[#4f46e5] text-[#4f46e5]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </button>
          <button
            className={`pb-4 px-2 whitespace-nowrap ${
              activeTab === 'favorites'
                ? 'border-b-2 border-[#4f46e5] text-[#4f46e5]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('favorites')}
          >
            Favorites
          </button>
          {profile.role === 'admin' && (
            <button
              className={`pb-4 px-2 whitespace-nowrap ${
                activeTab === 'admin'
                  ? 'border-b-2 border-[#4f46e5] text-[#4f46e5]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('admin')}
            >
              Admin
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Display Name</label>
                  <p className="mt-1 text-gray-900">{profile.display_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <p className="mt-1 text-gray-900">{profile.role}</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profile.email_notifications}
                    onChange={() => {}}
                    className="h-4 w-4 text-[#4f46e5] rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Receive email notifications
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {profile.role === 'admin' ? 'All Applications' : 'My Applications'}
              </h2>
              {applications.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {profile.role === 'admin' ? 'No applications found' : 'No applications submitted yet'}
                  </p>
                  {profile.role !== 'admin' && (
                    <p className="text-sm text-gray-500 mt-2">
                      Browse listings and apply to apartments you're interested in
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((application: any) => (
                    <div key={application.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-lg">{application.listings?.title}</h4>
                          <p className="text-gray-600">{application.listings?.address}</p>
                          <p className="text-[#4f46e5] font-semibold">
                            {formatPrice(application.listings?.price)}/month
                          </p>
                          {profile.role === 'admin' && (
                            <div className="mt-2 text-sm text-gray-500">
                              <p><strong>Tenant:</strong> {application.tenant?.display_name || application.full_name || application.email}</p>
                              <p><strong>Landlord:</strong> {application.landlord?.display_name || application.listings?.landlord_id || 'Unknown'}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(application.status)}
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        <p>Applied on: {new Date(application.created_at).toLocaleDateString()}</p>
                        <p>Move-in date: {new Date(application.move_in_date).toLocaleDateString()}</p>
                        {profile.role === 'admin' && (
                          <p>Email: {application.email}</p>
                        )}
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => navigate(`/listing/${application.listings?.id}`)}
                          className="px-3 py-1 text-sm bg-[#4f46e5] text-white rounded hover:bg-[#4f46e5]/90"
                        >
                          View Listing
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'saved' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Saved Listings</h2>
              {savedListings.length === 0 ? (
                <div className="text-center py-8">
                  <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No saved listings yet</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Save listings you're interested in to keep track of them
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedListings.map((saved: any) => (
                    <div key={saved.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-lg">{saved.listings?.title}</h4>
                          <p className="text-gray-600">
                            {saved.listings?.address}
                            {saved.listings?.neighborhood_id && (
                              <span> - {getNeighborhoodName(saved.listings.neighborhood_id)}</span>
                            )}
                            {saved.listings?.borough_id && (
                              <span>, {getBoroughName(saved.listings.borough_id)}</span>
                            )}
                          </p>
                          <p className="text-[#4f46e5] font-semibold">
                            {formatPrice(saved.listings?.price)}/month
                          </p>
                          {saved.listings?.bedrooms !== undefined && saved.listings?.bathrooms !== undefined && (
                            <p className="text-sm text-gray-500">
                              {saved.listings.bedrooms} bed, {saved.listings.bathrooms} bath
                              {saved.listings.square_feet && ` • ${saved.listings.square_feet} sq ft`}
                            </p>
                          )}
                        </div>
                        {saved.listings?.images?.[0]?.url && (
                          <img
                            src={saved.listings.images[0].url}
                            alt={saved.listings.title}
                            className="w-20 h-20 object-cover rounded-md ml-4"
                          />
                        )}
                      </div>
                      
                      {/* Notes Section */}
                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium text-gray-700">Notes:</label>
                          {editingNotes === saved.id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleNotesSave(saved.id)}
                                className="text-green-600 hover:text-green-700"
                                title="Save notes"
                              >
                                <Save className="h-4 w-4" />
                              </button>
                              <button
                                onClick={handleNotesCancel}
                                className="text-gray-600 hover:text-gray-700"
                                title="Cancel editing"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleNotesEdit(saved.id, saved.notes)}
                              className="text-blue-600 hover:text-blue-700"
                              title="Edit notes"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        {editingNotes === saved.id ? (
                          <textarea
                            value={notesForm}
                            onChange={(e) => setNotesForm(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            rows={3}
                            placeholder="Add your notes about this listing..."
                          />
                        ) : (
                          <p className="text-sm text-gray-600">
                            {saved.notes || 'No notes added yet. Click the edit icon to add notes.'}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Saved on: {new Date(saved.created_at).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => navigate(`/listing/${saved.listings?.id}`)}
                          className="px-3 py-1 text-sm bg-[#4f46e5] text-white rounded hover:bg-[#4f46e5]/90"
                        >
                          View Listing
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'listings' && profile.role === 'listing_owner' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">My Listings</h2>
                <button
                  onClick={() => navigate('/submit-listing')}
                  className="px-4 py-2 bg-[#4f46e5] text-white rounded-md hover:bg-[#4f46e5]/90"
                >
                  Create New Listing
                </button>
              </div>
              
              {myListings.length === 0 ? (
                <div className="text-center py-8">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No listings created yet</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Create your first listing to start connecting with potential tenants
                  </p>
                </div>
              ) : (
                <ListingManagement 
                  listings={myListings} 
                  onListingUpdate={handleListingUpdate} 
                />
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Messages</h2>
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No messages yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message: any) => (
                    <div key={message.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">
                            From: {message.sender?.display_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            To: {message.recipient?.display_name}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(message.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {message.listing && (
                        <p className="text-sm text-gray-600 mb-2">
                          Re: {message.listing.title}
                        </p>
                      )}
                      <p className="text-gray-700">{message.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Favorite Listings</h2>
              {favoriteListings.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No favorite listings yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {favoriteListings.map((favorite: any) => (
                    <div key={favorite.listing_id} className="border rounded-lg overflow-hidden">
                      <img
                        src={favorite.listings?.images?.[0]?.url}
                        alt={favorite.listings?.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{favorite.listings?.title}</h3>
                        <p className="text-gray-600 mb-4">{favorite.listings?.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-[#4f46e5] font-semibold">
                            {formatPrice(favorite.listings?.price)}/month
                          </span>
                          <button
                            onClick={() => navigate(`/listing/${favorite.listing_id}`)}
                            className="px-3 py-1 text-sm bg-[#4f46e5] text-white rounded hover:bg-[#4f46e5]/90"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'admin' && profile.role === 'admin' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Admin Dashboard</h2>
              
              <div className="space-y-8">
                {/* Pending Listings */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Pending Listings</h3>
                  {pendingListings.length === 0 ? (
                    <p className="text-gray-600">No pending listings</p>
                  ) : (
                    <div className="space-y-4">
                      {pendingListings.map((listing) => (
                        <div key={listing.id} className="border rounded-lg p-4">
                          <h4 className="font-medium">{listing.title}</h4>
                          <p className="text-gray-600 mt-2">{listing.description}</p>
                          <div className="mt-4 flex justify-end space-x-2">
                            <button
                              onClick={() => handleApproveListing(listing.id)}
                              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectListing(listing.id)}
                              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pending Highlights */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Pending Neighborhood Highlights</h3>
                  {pendingHighlights.length === 0 ? (
                    <p className="text-gray-600">No pending highlights</p>
                  ) : (
                    <div className="space-y-4">
                      {pendingHighlights.map((highlight) => (
                        <div key={highlight.id} className="border rounded-lg p-4">
                          <h4 className="font-medium">{highlight.name}</h4>
                          <p className="text-gray-600 mt-2">{highlight.description}</p>
                          <div className="mt-4 flex justify-end space-x-2">
                            <button
                              onClick={() => handleApproveHighlight(highlight.id)}
                              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectHighlight(highlight.id)}
                              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold mb-4">Change Password</h2>
              
              {passwordSuccess ? (
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">Password Changed Successfully!</p>
                </div>
              ) : (
                <form onSubmit={handlePasswordChange}>
                  {passwordError && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                      {passwordError}
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Change Password
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;