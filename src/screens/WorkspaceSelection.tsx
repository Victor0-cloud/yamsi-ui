import React, { useEffect, useState } from 'react';
import { getAPI } from '../lib/yamsi/api';
import { YAMSIContext } from '../lib/yamsi/config';

interface WorkspaceSelectionProps {
  context: YAMSIContext;
  onSelectBusiness: (businessId: string) => void;
  onBack: () => void;
}

interface Business {
  id: string;
  name: string;
  type: string;
}

export function WorkspaceSelection({
  context,
  onSelectBusiness,
  onBack,
}: WorkspaceSelectionProps) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        const api = getAPI();
        const response = await api.listBusinesses();
        setBusinesses(response.businesses || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load businesses');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="text-yamsi-600 hover:text-yamsi-700 font-medium mb-4 flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Select Workspace</h1>
          <p className="text-gray-600 mt-2">
            Choose a business to manage
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yamsi-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* No Businesses */}
        {!loading && businesses.length === 0 && (
          <div className="card text-center py-12">
            <p className="text-gray-600 mb-4">No businesses found</p>
            <p className="text-sm text-gray-500">
              Create a business to get started
            </p>
          </div>
        )}

        {/* Business Grid */}
        {!loading && businesses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {businesses.map((business) => (
              <button
                key={business.id}
                onClick={() => onSelectBusiness(business.id)}
                className="card text-left hover:border-yamsi-500 cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{business.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {business.type?.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-yamsi-100 rounded-lg flex items-center justify-center">
                    <span className="text-yamsi-600 font-bold">
                      {business.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  ID: {business.id}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
