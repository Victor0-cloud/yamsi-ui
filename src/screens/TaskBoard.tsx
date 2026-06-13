import React, { useEffect, useState } from 'react';
import { getAPI } from '../lib/yamsi/api';
import { YAMSIContext } from '../lib/yamsi/config';

interface TaskBoardProps {
  context: YAMSIContext;
  onBack: () => void;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  due_date?: string;
}

type TaskStatus = 'ideas' | 'to_do' | 'doing' | 'done';

export function TaskBoard({ context, onBack }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);

  useEffect(() => {
    loadTasks();
  }, [context]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const api = getAPI();
      const response = await api.listTasks();
      setTasks(response.tasks || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      const api = getAPI();
      await api.createTask({ title: newTaskTitle });
      setNewTaskTitle('');
      setShowNewTaskForm(false);
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    }
  };

  const handleMoveTask = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const api = getAPI();
      await api.moveTask(taskId, newStatus);
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to move task');
    }
  };

  const tasksByStatus: Record<TaskStatus, Task[]> = {
    ideas: tasks.filter((t) => t.status === 'ideas'),
    to_do: tasks.filter((t) => t.status === 'to_do'),
    doing: tasks.filter((t) => t.status === 'doing'),
    done: tasks.filter((t) => t.status === 'done'),
  };

  const statuses: TaskStatus[] = ['ideas', 'to_do', 'doing', 'done'];
  const statusLabels: Record<TaskStatus, string> = {
    ideas: 'Ideas',
    to_do: 'To Do',
    doing: 'In Progress',
    done: 'Done',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <button
              onClick={onBack}
              className="text-yamsi-600 hover:text-yamsi-700 font-medium mb-2 flex items-center gap-2"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
          </div>
          <button
            onClick={() => setShowNewTaskForm(!showNewTaskForm)}
            className="btn-primary"
          >
            + New Task
          </button>
        </div>
      </div>

      {/* New Task Form */}
      {showNewTaskForm && (
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Task title..."
                className="input-field flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleCreateTask();
                }}
              />
              <button
                onClick={handleCreateTask}
                className="btn-primary"
              >
                Create
              </button>
              <button
                onClick={() => setShowNewTaskForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-7xl mx-auto p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="max-w-7xl mx-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yamsi-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statuses.map((status) => (
              <div key={status} className="bg-gray-100 rounded-lg p-4">
                <h2 className="font-bold text-gray-900 mb-4">
                  {statusLabels[status]}
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    ({tasksByStatus[status].length})
                  </span>
                </h2>

                <div className="space-y-3">
                  {tasksByStatus[status].map((task) => (
                    <div
                      key={task.id}
                      className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-move"
                    >
                      <p className="font-medium text-gray-900 mb-2">{task.title}</p>
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
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

                        {/* Move buttons */}
                        <div className="flex gap-1">
                          {status !== 'done' && (
                            <button
                              onClick={() => {
                                const nextStatus = status === 'ideas' ? 'to_do' :
                                  status === 'to_do' ? 'doing' : 'done';
                                handleMoveTask(task.id, nextStatus as TaskStatus);
                              }}
                              className="text-xs text-yamsi-600 hover:text-yamsi-700 font-medium"
                            >
                              →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {tasksByStatus[status].length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-sm">No tasks</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
