import React, { useState, useEffect } from 'react';
import { Welcome } from './screens/Welcome';
import { WorkspaceSelection } from './screens/WorkspaceSelection';
import { BranchSelection } from './screens/BranchSelection';
import { Dashboard } from './screens/Dashboard';
import { TaskBoard } from './screens/TaskBoard';
import { MemoryCenter } from './screens/MemoryCenter';
import { Calculator } from './screens/Calculator';
import { useYAMSIContext } from './hooks/useYAMSIContext';
import { getAPI, initializeAPI } from './lib/yamsi/api';

type Screen = 'welcome' | 'workspace' | 'branch' | 'dashboard' | 'tasks' | 'memory' | 'chat' | 'calculator';

export default function App() {
  const { context, updateContext } = useYAMSIContext();
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [businessType, setBusinessType] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize API with current context
  useEffect(() => {
    initializeAPI(context);
    setIsReady(true);
  }, [context]);

  const handleSignIn = () => {
    setCurrentScreen('workspace');
  };

  const handleSelectBusiness = async (businessId: string) => {
    await updateContext({ business_id: businessId });
    
    // Fetch business type
    try {
      const api = getAPI();
      const response = await api.getBusinessType();
      setBusinessType(response.business_type);
    } catch (err) {
      console.error('Failed to get business type:', err);
    }
  };

  const handleSelectBranch = async (branchId: string) => {
    await updateContext({ branch_id: branchId });
  };

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleLogout = () => {
    setCurrentScreen('welcome');
    setBusinessType(null);
    updateContext({
      business_id: undefined,
      branch_id: undefined,
      business_type: undefined,
    });
  };

  const handleBack = () => {
    if (currentScreen === 'branch') {
      setCurrentScreen('workspace');
      updateContext({ business_id: undefined });
    } else if (currentScreen === 'dashboard') {
      setCurrentScreen('workspace');
      updateContext({ business_id: undefined, branch_id: undefined });
    } else {
      setCurrentScreen('dashboard');
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading YAMSI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {currentScreen === 'welcome' && (
        <Welcome onSignIn={handleSignIn} />
      )}

      {currentScreen === 'workspace' && (
        <WorkspaceSelection
          context={context}
          onSelectBusiness={handleSelectBusiness}
          onBack={() => setCurrentScreen('welcome')}
        />
      )}

      {currentScreen === 'branch' && (
        <BranchSelection
          context={context}
          onSelectBranch={handleSelectBranch}
          onBack={handleBack}
        />
      )}

      {currentScreen === 'dashboard' && (
        <Dashboard
          context={context}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      {currentScreen === 'tasks' && (
        <TaskBoard
          context={context}
          onBack={() => handleNavigate('dashboard')}
        />
      )}

      {currentScreen === 'memory' && (
        <MemoryCenter
          context={context}
          onBack={() => handleNavigate('dashboard')}
        />
      )}

      {currentScreen === 'calculator' && (
        <Calculator
          context={context}
          businessType={businessType || undefined}
          onBack={() => handleNavigate('dashboard')}
        />
      )}

      {currentScreen === 'chat' && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">AI Chat feature coming soon</p>
            <button
              onClick={() => handleNavigate('dashboard')}
              className="btn-primary"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
