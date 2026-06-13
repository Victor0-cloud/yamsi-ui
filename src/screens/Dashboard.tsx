import React, { useEffect, useState } from 'react';
import { getAPI } from '../lib/yamsi/api';
import { YAMSIContext } from '../lib/yamsi/config';

interface DashboardProps {
  context: YAMSIContext;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

interface Task {
  id: string;
  title: string;
  status: string;
  priority?: string;
}

export function Dashboard({
  context,
  onNavigate,
  onLogout,
}: DashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [businessType, setBusinessType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const api = getAPI();

        // Get business type
        const typeResponse = await api.getBusinessType();
        setBusinessType(typeResponse.business_type);

        // Get tasks
        const tasksResponse = await api.listTasks();
        setTasks(tasksResponse.tasks || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [context]);

  const tasksByStatus = {
    ideas: tasks.filter((t) => t.status === 'ideas'),
    to_do: tasks.filter((t) => t.status === 'to_do'),
    doing: tasks.filter((t) => t.status === 'doing'),
    done: tasks.filter((t) => t.status === 'done'),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">YAMSI Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">
              {context.business_id} • {context.branch_id || 'Main'} • {businessType || 'Loading...'}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="btn-secondary"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => onNavigate('chat')}
            className="card text-left hover:border-yamsi-500 cursor-pointer transition-all"
          >
            <div className="text-2xl mb-2">💬</div>
            <h3 className="font-bold text-gray-900">AI Chat</h3>
            <p className="text-sm text-gray-600">Ask YAMSI anything</p>
          </button>

          <button
            onClick={() => onNavigate('tasks')}
            className="card text-left hover:border-yamsi-500 cursor-pointer transition-all"
          >
            <div className="text-2xl mb-2">✓</div>
            <h3 className="font-bold text-gray-900">Task Board</h3>
            <p className="text-sm text-gray-600">{tasks.length} tasks</p>
          </button>

          <button
            onClick={() => onNavigate('memory')}
            className="card text-left hover:border-yamsi-500 cursor-pointer transition-all"
          >
            <div className="text-2xl mb-2">🧠</div>
            <h3 className="font-bold text-gray-900">Memory Center</h3>
            <p className="text-sm text-gray-600">Business facts & data</p>
          </button>

          <button
            onClick={() => onNavigate('calculator')}
            className="card text-left hover:border-yamsi-500 cursor-pointer transition-all"
          >
            <div className="text-2xl mb-2">🧮</div>
            <h3 className="font-bold text-gray-900">Calculator</h3>
            <p className="text-sm text-gray-600">Profit & cost analysis</p>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Total Tasks</p>
            <p className="text-3xl font-bold text-yamsi-600">{tasks.length}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">To Do</p>
            <p className="text-3xl font-bold text-yellow-600">{tasksByStatus.to_do.length}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">In Progress</p>
            <p className="text-3xl font-bold text-blue-600">{tasksByStatus.doing.length}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Completed</p>
            <p className="text-3xl font-bold text-green-600">{tasksByStatus.done.length}</p>
          </div>
        </div>

        {/* Recent Tasks */}
        {!loading && tasks.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Tasks</h2>
            <div className="space-y-2">
              {tasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-500 capitalize">{task.status?.replace(/_/g, ' ')}</p>
                  </div>
                  {task.priority && (
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
