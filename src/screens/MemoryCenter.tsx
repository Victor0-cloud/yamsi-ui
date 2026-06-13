import React, { useState } from 'react';
import { getAPI } from '../lib/yamsi/api';
import { YAMSIContext } from '../lib/yamsi/config';

interface MemoryCenterProps {
  context: YAMSIContext;
  onBack: () => void;
}

interface MemoryEntry {
  key: string;
  value: unknown;
}

export function MemoryCenter({ context, onBack }: MemoryCenterProps) {
  const [memories, setMemories] = useState<MemoryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const api = getAPI();
      const response = await api.searchMemory(searchQuery);
      setMemories(response.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMemory = async () => {
    if (!newKey.trim() || !newValue.trim()) return;

    try {
      setLoading(true);
      const api = getAPI();
      await api.writeMemory({ key: newKey, value: newValue });
      setNewKey('');
      setNewValue('');
      setError(null);
      // Refresh search
      if (searchQuery.trim()) {
        await handleSearch();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save memory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="text-yamsi-600 hover:text-yamsi-700 font-medium mb-2 flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Memory Center</h1>
          <p className="text-gray-600 mt-1">Store and retrieve business facts</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Add Memory Form */}
        <div className="card mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Add Memory</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key
              </label>
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="e.g., nylon_price_per_kg"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value
              </label>
              <textarea
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="e.g., 4900"
                className="input-field"
                rows={3}
              />
            </div>
            <button
              onClick={handleAddMemory}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Saving...' : 'Save Memory'}
            </button>
          </div>
        </div>

        {/* Search Memory */}
        <div className="card mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Search Memory</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for facts..."
              className="input-field flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Results */}
        {memories.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Results</h2>
            <div className="space-y-3">
              {memories.map((memory, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <p className="font-mono text-sm font-bold text-yamsi-600 mb-1">
                    {String(memory.key)}
                  </p>
                  <p className="text-gray-900">
                    {typeof memory.value === 'string'
                      ? memory.value
                      : JSON.stringify(memory.value, null, 2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && memories.length === 0 && searchQuery && (
          <div className="card text-center py-8">
            <p className="text-gray-600">No memories found for "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
