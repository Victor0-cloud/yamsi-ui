import React, { useEffect, useState } from 'react';
import { getAPI } from '../lib/yamsi/api';
import { YAMSIContext } from '../lib/yamsi/config';

interface CalculatorProps {
  context: YAMSIContext;
  businessType?: string;
  onBack: () => void;
}

interface CalculationResult {
  [key: string]: unknown;
}

export function Calculator({
  context,
  businessType,
  onBack,
}: CalculatorProps) {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'water' | 'poultry'>('water');

  // Water calculator state
  const [waterSettings, setWaterSettings] = useState({
    selling_price: 500,
    nylon_price_per_kg: 4900,
    bags_per_kg: 36,
    packing_cost_per_bag: 25,
    delivery_cost_per_trip: 2500,
    bags_per_trip: 100,
    nepa_daily_cost: 31000,
    daily_production_bags: 250,
  });

  // Poultry calculator state
  const [poultrySettings, setPoultrySettings] = useState({
    egg_price_per_crate: 5200,
    daily_production_crates: 20,
    feed_cost_per_crate: 2000,
    labor_cost_daily: 5000,
  });

  const handleCalculateWater = async () => {
    try {
      setLoading(true);
      setError(null);
      const api = getAPI();
      const response = await api.calculateWaterProfit(waterSettings);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCalculatePoultry = async () => {
    try {
      setLoading(true);
      setError(null);
      const api = getAPI();
      const response = await api.calculatePoultryProfit(poultrySettings);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed');
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
          <h1 className="text-2xl font-bold text-gray-900">Business Calculator</h1>
          <p className="text-gray-600 mt-1">Analyze costs and profitability</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('water')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'water'
                ? 'border-yamsi-600 text-yamsi-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Water Production
          </button>
          <button
            onClick={() => setActiveTab('poultry')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'poultry'
                ? 'border-yamsi-600 text-yamsi-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Poultry Farm
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {activeTab === 'water' ? 'Water Production Settings' : 'Poultry Settings'}
            </h2>

            {activeTab === 'water' ? (
              <div className="space-y-3">
                {Object.entries(waterSettings).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {key.replace(/_/g, ' ').toUpperCase()}
                    </label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) =>
                        setWaterSettings({
                          ...waterSettings,
                          [key]: parseFloat(e.target.value),
                        })
                      }
                      className="input-field"
                    />
                  </div>
                ))}
                <button
                  onClick={handleCalculateWater}
                  disabled={loading}
                  className="btn-primary w-full mt-4"
                >
                  {loading ? 'Calculating...' : 'Calculate Profit'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(poultrySettings).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {key.replace(/_/g, ' ').toUpperCase()}
                    </label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) =>
                        setPoultrySettings({
                          ...poultrySettings,
                          [key]: parseFloat(e.target.value),
                        })
                      }
                      className="input-field"
                    />
                  </div>
                ))}
                <button
                  onClick={handleCalculatePoultry}
                  disabled={loading}
                  className="btn-primary w-full mt-4"
                >
                  {loading ? 'Calculating...' : 'Calculate Profit'}
                </button>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Results</h2>

            {result ? (
              <div className="space-y-3">
                {Object.entries(result).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {key.replace(/_/g, ' ').toUpperCase()}
                    </span>
                    <span className="text-lg font-bold text-yamsi-600">
                      {typeof value === 'number' ? value.toFixed(2) : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p className="text-sm">Run a calculation to see results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
