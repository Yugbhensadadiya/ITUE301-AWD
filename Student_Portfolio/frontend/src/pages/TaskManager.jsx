import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask, BASE_URL } from '../services/api';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';

/**
 * Practical 6: Full Stack Integration (React + Node.js/Express + MongoDB)
 * 
 * Key Concepts Demonstrated:
 * 1. Central API Calls: Invokes getTasks, createTask, updateTask, deleteTask from api.js.
 * 2. Full CRUD Workflow:
 *    - CREATE: POST /tasks with form submission.
 *    - READ:   GET /tasks on initial mount with useEffect.
 *    - UPDATE: PUT /tasks/:id to toggle completion status or edit fields.
 *    - DELETE: DELETE /tasks/:id with confirmation dialog.
 * 3. State Synchronization:
 *    - Synchronizes frontend state immediately upon successful backend persistence.
 *    - Preserves data across browser refreshes via MongoDB database storage.
 * 4. Granular Loading States:
 *    - isLoading: Initial fetch loading.
 *    - isCreating: Task creation submission loading.
 *    - updatingId: ID of task currently undergoing update.
 *    - deletingId: ID of task currently undergoing deletion.
 * 5. Error & Notification Handling:
 *    - Catches and displays API & network errors gracefully.
 *    - Transient Toast/Notification system for operation feedback.
 */
function TaskManager() {
  // ==========================================================================
  // 1. Component State Definitions
  // ==========================================================================

  // Task list retrieved from MongoDB backend
  const [tasks, setTasks] = useState([]);

  // Granular loading states for distinct CRUD interactions
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Global error message string for initial fetch or critical errors
  const [fetchError, setFetchError] = useState(null);

  // Form input states for creating a new task
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [formValidation, setFormValidation] = useState('');

  // Editing state for inline task modifications
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState('medium');

  // Confirmation dialog modal state for task deletion
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Toast notification state { message, type: 'success' | 'error' | 'info' }
  const [toast, setToast] = useState(null);

  // Search & Filter controls
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'completed'

  // ==========================================================================
  // 2. Toast Notification Helper
  // ==========================================================================
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    // Auto-dismiss notification after 4 seconds
    setTimeout(() => {
      setToast((current) => (current && current.message === message ? null : current));
    }, 4000);
  };

  // ==========================================================================
  // 3. READ Operation: GET /tasks
  // ==========================================================================
  const loadTasks = async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      const data = await getTasks();
      // Ensure data is array
      if (Array.isArray(data)) {
        setTasks(data);
      } else if (data && Array.isArray(data.tasks)) {
        setTasks(data.tasks);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error('Error fetching tasks from MongoDB:', err);
      setFetchError(err.message || 'Failed to connect to backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger READ on initial component mount (useEffect with empty dependency array)
  useEffect(() => {
    loadTasks();
  }, []);

  // ==========================================================================
  // 4. CREATE Operation: POST /tasks
  // ==========================================================================
  const handleCreateTask = async (e) => {
    e.preventDefault();

    // Frontend validation: title is required
    if (!newTitle.trim()) {
      setFormValidation('Task title cannot be empty.');
      return;
    }
    setFormValidation('');
    setIsCreating(true);

    try {
      const payload = {
        title: newTitle.trim(),
        description: newDescription.trim(),
        priority: newPriority,
        completed: false,
      };

      const response = await createTask(payload);
      const createdTask = response.task || response;

      // Update local state by prepending the newly persisted MongoDB task
      setTasks((prev) => [createdTask, ...prev]);

      // Reset form fields
      setNewTitle('');
      setNewDescription('');
      setNewPriority('medium');

      showToast(`Task "${createdTask.title}" created & saved to MongoDB!`, 'success');
    } catch (err) {
      console.error('Failed to create task:', err);
      showToast(err.message || 'Error creating task.', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  // ==========================================================================
  // 5. UPDATE Operations: PUT /tasks/:id
  // ==========================================================================

  // 5A: Toggle Completed Status
  const handleToggleComplete = async (task) => {
    const originalStatus = task.completed;
    const newStatus = !originalStatus;
    setUpdatingId(task._id);

    try {
      const response = await updateTask(task._id, { completed: newStatus });
      const updated = response.task || response;

      // Synchronize local state with backend response
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, completed: updated.completed } : t))
      );

      showToast(
        newStatus
          ? `Marked "${task.title}" as completed!`
          : `Marked "${task.title}" as pending.`,
        'info'
      );
    } catch (err) {
      console.error('Failed to update task status:', err);
      showToast(`Failed to update status: ${err.message}`, 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  // 5B: Start Inline Edit Mode
  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditPriority(task.priority || 'medium');
  };

  // 5C: Cancel Inline Edit Mode
  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditTitle('');
    setEditDescription('');
    setEditPriority('medium');
  };

  // 5D: Save Inline Edits
  const handleSaveEdit = async (taskId) => {
    if (!editTitle.trim()) {
      showToast('Title cannot be empty.', 'error');
      return;
    }

    setUpdatingId(taskId);

    try {
      const updateData = {
        title: editTitle.trim(),
        description: editDescription.trim(),
        priority: editPriority,
      };

      const response = await updateTask(taskId, updateData);
      const updatedTask = response.task || response;

      // Update task in local state
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, ...updatedTask } : t))
      );

      setEditingTaskId(null);
      showToast('Task updated successfully in MongoDB!', 'success');
    } catch (err) {
      console.error('Failed to save task edits:', err);
      showToast(`Error updating task: ${err.message}`, 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================================================
  // 6. DELETE Operation: DELETE /tasks/:id with Confirmation Dialog
  // ==========================================================================

  // 6A: Request Delete (Open Dialog)
  const requestDelete = (task) => {
    setTaskToDelete(task);
  };

  // 6B: Confirm and Execute Delete
  const confirmDelete = async () => {
    if (!taskToDelete) return;
    const id = taskToDelete._id;
    const title = taskToDelete.title;

    setDeletingId(id);

    try {
      await deleteTask(id);

      // Remove from local state upon confirmed backend deletion
      setTasks((prev) => prev.filter((t) => t._id !== id));

      showToast(`Task "${title}" deleted from MongoDB.`, 'info');
      setTaskToDelete(null);
    } catch (err) {
      console.error('Failed to delete task:', err);
      showToast(`Error deleting task: ${err.message}`, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  // 6C: Dismiss Delete Dialog
  const cancelDelete = () => {
    if (deletingId) return; // Prevent dismissing while request is pending
    setTaskToDelete(null);
  };

  // ==========================================================================
  // 7. Filter & Search Logic
  // ==========================================================================
  const filteredTasks = tasks.filter((task) => {
    // Status filter
    if (statusFilter === 'pending' && task.completed) return false;
    if (statusFilter === 'completed' && !task.completed) return false;

    // Search term filter
    const matchesTitle = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDesc = (task.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTitle || matchesDesc;
  });

  // Task statistics
  const totalTasks = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = totalTasks - completedCount;

  return (
    <div className="page-container taskmanager-page">
      {/* Toast Notification Banner (Supplementary Requirement C) */}
      {toast && (
        <div className={`task-toast task-toast-${toast.type}`} role="alert">
          <span className="toast-icon">
            {toast.type === 'success' && '✓'}
            {toast.type === 'error' && '✕'}
            {toast.type === 'info' && 'ℹ'}
          </span>
          <span className="toast-text">{toast.message}</span>
          <button
            type="button"
            className="toast-close"
            onClick={() => setToast(null)}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}

      {/* Page Header Banner */}
      <section className="portfolio-section taskmanager-hero">
        <div className="section-header">
          <span className="section-subtitle">
            Practical 6 • Full Stack Integration
          </span>
          <h1 className="section-title">Task Management System</h1>
          <div className="section-divider"></div>
          <p className="section-lead">
            Full-stack CRUD application connecting a <strong>React 18</strong> frontend
            to an <strong>Express.js</strong> REST API and a persistent <strong>MongoDB</strong> database.
          </p>
        </div>

        {/* Backend Connection Status Card */}
        <div className="backend-status-card">
          <div className="status-indicator">
            <span className="status-ping"></span>
            <span className="status-label">Backend API:</span>
            <code className="status-endpoint">{BASE_URL}</code>
          </div>
          <div className="database-indicator">
            <span className="db-icon">🗄️</span>
            <span>Database: <strong>MongoDB (taskmanager.tasks)</strong></span>
          </div>
          <button
            type="button"
            className="action-btn-refresh"
            onClick={loadTasks}
            disabled={isLoading}
            title="Re-fetch tasks from MongoDB"
          >
            {isLoading ? 'Refreshing...' : '🔄 Re-fetch Data'}
          </button>
        </div>
      </section>

      {/* Main Content Layout: Form & Task List */}
      <div className="taskmanager-layout">
        {/* ==================================================================
            CREATE TASK FORM (POST /tasks)
            ================================================================== */}
        <aside className="taskmanager-sidebar">
          <div className="crud-card form-card">
            <div className="card-header-styled">
              <span className="card-tag">POST /tasks</span>
              <h2 className="card-title">Create New Task</h2>
              <p className="card-desc">
                Fill details to persist a new document in MongoDB.
              </p>
            </div>

            <form onSubmit={handleCreateTask} className="task-form">
              {/* Task Title Field (Required) */}
              <div className="form-group">
                <label htmlFor="task-title" className="form-label">
                  Task Title <span className="required-star">*</span>
                </label>
                <input
                  id="task-title"
                  type="text"
                  className={`form-input ${formValidation ? 'input-error' : ''}`}
                  placeholder="e.g. Implement CRUD in React"
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (formValidation) setFormValidation('');
                  }}
                  disabled={isCreating}
                />
                {formValidation && (
                  <span className="validation-message">{formValidation}</span>
                )}
              </div>

              {/* Task Description Field (Optional) */}
              <div className="form-group">
                <label htmlFor="task-description" className="form-label">
                  Description <span className="optional-tag">(Optional)</span>
                </label>
                <textarea
                  id="task-description"
                  className="form-textarea"
                  rows="3"
                  placeholder="Details, acceptance criteria, or notes..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  disabled={isCreating}
                ></textarea>
              </div>

              {/* Priority Dropdown (Schema Enum: low, medium, high) */}
              <div className="form-group">
                <label htmlFor="task-priority" className="form-label">
                  Priority Level
                </label>
                <select
                  id="task-priority"
                  className="form-select"
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  disabled={isCreating}
                >
                  <option value="low">🟢 Low Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="high">🔴 High Priority</option>
                </select>
              </div>

              {/* Submit Button with Loading State */}
              <button
                type="submit"
                className="submit-btn primary-gradient-btn"
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <span className="btn-spinner"></span>
                    <span>Saving to MongoDB...</span>
                  </>
                ) : (
                  <>
                    <span>➕ Add Task</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Helper Note */}
            <div className="academic-note">
              <small>
                💡 <strong>Lab Insight:</strong> Upon submission, React sends a <code>POST</code> request with <code>Content-Type: application/json</code>. The Mongoose pre-save hook trims the title before storing it in MongoDB.
              </small>
            </div>
          </div>
        </aside>

        {/* ==================================================================
            TASK LIST & CRUD CONTROLS (GET, PUT, DELETE)
            ================================================================== */}
        <main className="taskmanager-main">
          {/* Controls & Summary Bar */}
          <div className="task-controls-bar">
            {/* Summary Counters */}
            <div className="task-stats-chips">
              <span className="stat-chip">
                Total: <strong>{totalTasks}</strong>
              </span>
              <span className="stat-chip chip-pending">
                Pending: <strong>{pendingCount}</strong>
              </span>
              <span className="stat-chip chip-completed">
                Completed: <strong>{completedCount}</strong>
              </span>
            </div>

            {/* Filter Buttons */}
            <div className="filter-pill-group">
              <button
                type="button"
                className={`filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All
              </button>
              <button
                type="button"
                className={`filter-pill ${statusFilter === 'pending' ? 'active' : ''}`}
                onClick={() => setStatusFilter('pending')}
              >
                Pending
              </button>
              <button
                type="button"
                className={`filter-pill ${statusFilter === 'completed' ? 'active' : ''}`}
                onClick={() => setStatusFilter('completed')}
              >
                Completed
              </button>
            </div>
          </div>

          {/* Search Input Filter */}
          <div className="task-search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Filter tasks by title or description in real-time..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchTerm('')}
              >
                ✕
              </button>
            )}
          </div>

          {/* Initial READ Loading State */}
          {isLoading && (
            <div className="task-loading-state">
              <Spinner />
              <p className="loading-caption">Fetching tasks from MongoDB via Express...</p>
            </div>
          )}

          {/* Initial READ Error State */}
          {!isLoading && fetchError && (
            <ErrorMessage
              message={fetchError}
              onRetry={loadTasks}
              helpText="Ensure your Express server is running on http://localhost:5000 and MongoDB is active."
            />
          )}

          {/* Empty State */}
          {!isLoading && !fetchError && filteredTasks.length === 0 && (
            <div className="empty-tasks-card">
              <div className="empty-icon">📝</div>
              <h3>No Tasks Found</h3>
              <p>
                {searchTerm || statusFilter !== 'all'
                  ? 'No tasks match your current filter or search criteria.'
                  : 'Your MongoDB collection is empty. Use the form to create your first task!'}
              </p>
              {(searchTerm || statusFilter !== 'all') && (
                <button
                  type="button"
                  className="reset-filters-btn"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                >
                  Reset Filters
                </button>
              )}
            </div>
          )}

          {/* Task Items List */}
          {!isLoading && !fetchError && filteredTasks.length > 0 && (
            <div className="task-grid">
              {filteredTasks.map((task) => {
                const isEditing = editingTaskId === task._id;
                const isUpdating = updatingId === task._id;
                const isDeleting = deletingId === task._id;

                return (
                  <div
                    key={task._id}
                    className={`task-card ${task.completed ? 'task-completed' : ''} priority-${task.priority}`}
                  >
                    {isEditing ? (
                      /* Inline Edit Form (PUT /tasks/:id) */
                      <div className="inline-edit-box">
                        <h4 className="edit-box-title">✏️ Edit Task</h4>
                        <div className="form-group">
                          <label className="form-label-sm">Title</label>
                          <input
                            type="text"
                            className="form-input form-input-sm"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            disabled={isUpdating}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label-sm">Description</label>
                          <textarea
                            className="form-textarea form-textarea-sm"
                            rows="2"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            disabled={isUpdating}
                          ></textarea>
                        </div>

                        <div className="form-group">
                          <label className="form-label-sm">Priority</label>
                          <select
                            className="form-select form-select-sm"
                            value={editPriority}
                            onChange={(e) => setEditPriority(e.target.value)}
                            disabled={isUpdating}
                          >
                            <option value="low">🟢 Low</option>
                            <option value="medium">🟡 Medium</option>
                            <option value="high">🔴 High</option>
                          </select>
                        </div>

                        <div className="edit-btn-actions">
                          <button
                            type="button"
                            className="btn-save-sm"
                            onClick={() => handleSaveEdit(task._id)}
                            disabled={isUpdating}
                          >
                            {isUpdating ? 'Saving...' : '💾 Save Changes'}
                          </button>
                          <button
                            type="button"
                            className="btn-cancel-sm"
                            onClick={cancelEditing}
                            disabled={isUpdating}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Standard Task Display Card */
                      <>
                        <div className="task-card-top">
                          {/* Checkbox for Status Toggle (PUT /tasks/:id) */}
                          <label className="task-checkbox-container" title="Toggle Completion Status">
                            <input
                              type="checkbox"
                              checked={Boolean(task.completed)}
                              onChange={() => handleToggleComplete(task)}
                              disabled={isUpdating}
                            />
                            <span className="task-checkmark"></span>
                          </label>

                          <div className="task-title-wrap">
                            <h3 className={`task-title ${task.completed ? 'completed-text' : ''}`}>
                              {task.title}
                            </h3>
                            <span className={`priority-badge badge-${task.priority}`}>
                              {task.priority?.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {task.description && (
                          <p className="task-description">{task.description}</p>
                        )}

                        <div className="task-card-footer">
                          <div className="task-meta">
                            <span className="meta-time">
                              🕒 {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'Recent'}
                            </span>
                            <span className="meta-id" title={`MongoDB ObjectId: ${task._id}`}>
                              ID: {task._id.substring(task._id.length - 6)}
                            </span>
                          </div>

                          <div className="task-actions">
                            <button
                              type="button"
                              className="btn-action-edit"
                              onClick={() => startEditing(task)}
                              disabled={isUpdating || isDeleting}
                              title="Edit Task Details"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              type="button"
                              className="btn-action-delete"
                              onClick={() => requestDelete(task)}
                              disabled={isUpdating || isDeleting}
                              title="Delete Task from MongoDB"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* ==================================================================
          DELETE CONFIRMATION DIALOG MODAL (Supplementary Requirement B)
          ================================================================== */}
      {taskToDelete && (
        <div className="modal-backdrop" onClick={cancelDelete}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="modal-title"
          >
            <div className="modal-header">
              <span className="modal-icon">⚠️</span>
              <h3 id="modal-title" className="modal-title">
                Confirm Task Deletion
              </h3>
            </div>

            <p className="modal-body">
              Are you sure you want to permanently delete task{' '}
              <strong>"{taskToDelete.title}"</strong>?
              <br />
              This action executes <code>DELETE /tasks/{taskToDelete._id}</code> and cannot be undone.
            </p>

            <div className="modal-actions">
              <button
                type="button"
                className="modal-btn-cancel"
                onClick={cancelDelete}
                disabled={Boolean(deletingId)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="modal-btn-delete"
                onClick={confirmDelete}
                disabled={Boolean(deletingId)}
              >
                {deletingId ? 'Deleting from MongoDB...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskManager;
