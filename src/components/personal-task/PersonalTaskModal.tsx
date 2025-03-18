// src/components/personal-task/PersonalTaskModal.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, elevation } from '@constants/theme';
import { ProjectSelector } from './ProjectSelector';
import { RunRateTaskOptions } from './RunRateTaskOptions';
import { Project } from '@models/Project';
import { ProjectController } from '@controllers/ProjectController';
import { PersonalTask, PersonalTaskModalProps } from './types';
import { TaskType, TaskStatus } from '@components/project-run-rate/types';
import { authController } from '@controllers/index';
import { FormFields } from './components/FormFields';
import { DateTimeField } from './components/DateTimeField';
import { SubtaskManager } from './components/SubtaskManager';
import { ReminderManager } from './components/ReminderManager';

export const PersonalTaskModal: React.FC<PersonalTaskModalProps> = ({
  visible,
  onClose,
  onSave,
  initialTask,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [task, setTask] = useState<PersonalTask>({
    name: initialTask?.name || '',
    dueDate: initialTask?.dueDate || new Date(),
    priority: initialTask?.priority || 'Medium',
    category: initialTask?.category || 'Other',
    notes: initialTask?.notes || '',
    status: initialTask?.status || 'To Do',
    progress: initialTask?.progress || 0,
    subtasks: initialTask?.subtasks || [],
    reminders: initialTask?.reminders || [],
    projectId: initialTask?.projectId || null,
    runRateValues: initialTask?.runRateValues || null,
    taskType: initialTask?.taskType || 'Small',
    points: initialTask?.points || 1
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [newSubtaskName, setNewSubtaskName] = useState('');
  const [newReminderDate, setNewReminderDate] = useState(new Date());
  const [showReminderDatePicker, setShowReminderDatePicker] = useState(false);
  const [showReminderTimePicker, setShowReminderTimePicker] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [runRateTaskType, setRunRateTaskType] = useState<TaskType>('Small');
  const [runRateTaskStatus, setRunRateTaskStatus] = useState<TaskStatus>('To Do');

  const projectController = new ProjectController();

  // Handle date change
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      // Preserve the time from the existing due date
      const newDate = new Date(selectedDate);
      newDate.setHours(task.dueDate.getHours(), task.dueDate.getMinutes());
      setTask({ ...task, dueDate: newDate });
    }
  };

  // Handle time change
  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      // Preserve the date but update the time
      const newDate = new Date(task.dueDate);
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setTask({ ...task, dueDate: newDate });
    }
  };

  // Handle reminder date change
  const handleReminderDateChange = (event: any, selectedDate?: Date) => {
    setShowReminderDatePicker(false);
    if (selectedDate) {
      // Preserve the time from the existing reminder date
      const newDate = new Date(selectedDate);
      newDate.setHours(newReminderDate.getHours(), newReminderDate.getMinutes());
      setNewReminderDate(newDate);
    }
  };

  // Handle reminder time change
  const handleReminderTimeChange = (event: any, selectedTime?: Date) => {
    setShowReminderTimePicker(false);
    if (selectedTime) {
      // Preserve the date but update the time
      const newDate = new Date(newReminderDate);
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setNewReminderDate(newDate);
    }
  };

  // Add a new subtask
  const addSubtask = () => {
    if (newSubtaskName.trim()) {
      const newSubtask: Subtask = {
        id: Date.now().toString(),
        name: newSubtaskName.trim(),
        completed: false,
      };
      setTask({ ...task, subtasks: [...task.subtasks, newSubtask] });
      setNewSubtaskName('');
    }
  };

  // Toggle subtask completion
  const toggleSubtaskCompletion = (id: string) => {
    const updatedSubtasks = task.subtasks.map(subtask =>
      subtask.id === id ? { ...subtask, completed: !subtask.completed } : subtask
    );
    setTask({ ...task, subtasks: updatedSubtasks });
  };

  // Remove a subtask
  const removeSubtask = (id: string) => {
    const updatedSubtasks = task.subtasks.filter(subtask => subtask.id !== id);
    setTask({ ...task, subtasks: updatedSubtasks });
  };

  // Add a new reminder
  const addReminder = () => {
    const newReminder: Reminder = {
      id: Date.now().toString(),
      time: newReminderDate,
      notificationSound: 'default',
    };
    setTask({ ...task, reminders: [...task.reminders, newReminder] });
    setNewReminderDate(new Date());
  };

  // Remove a reminder
  const removeReminder = (id: string) => {
    const updatedReminders = task.reminders.filter(reminder => reminder.id !== id);
    setTask({ ...task, reminders: updatedReminders });
  };


  // Load projects when component mounts
  useEffect(() => {
    if (visible) {
      // Initialize run rate values if a project is selected
      if (initialTask?.projectId && initialTask?.runRateValues) {
        setRunRateTaskType(initialTask.runRateValues.type);
        setRunRateTaskStatus(initialTask.runRateValues.status);
      }
    }
  }, [visible, initialTask]);

  // Search for projects
  const handleSearchProjects = async (query: string) => {
    try {
      setIsLoadingProjects(true);
      const user = await authController.getCurrentUser();
      if (!user) {
        return;
      }
      const response = await projectController.getProjectsByUser(user?.id);

      if (response.success && response.data) {
        // Filter projects based on search query
        const filteredProjects = response.data.filter(project =>
          project.name.toLowerCase().includes(query.toLowerCase())
        );
        setProjects(filteredProjects);
      }
    } catch (error) {
      console.error('Error searching projects:', error);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {
      name: '',
      dueDate: '',
      priority: '',
      status: '',
      taskType: '',
      points: ''
    };

    if (!task.name.trim()) {
      newErrors.name = 'Task name is required';
    }

    if (!task.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (!task.priority) {
      newErrors.priority = 'Priority is required';
    }

    if (!task.status) {
      newErrors.status = 'Status is required';
    }

    if (!task.taskType) {
      newErrors.taskType = 'Task type is required';
    }

    if (task.points < 1) {
      newErrors.points = 'Points must be greater than 0';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      onSave(task);
      onClose();
    }
  };

  // Handle project selection
  const handleSelectProject = (project: Project | null) => {
    if (project) {
      setTask(prev => ({
        ...prev,
        projectId: project.id,
        // Initialize run rate values when a project is selected
        runRateValues: prev.runRateValues || {
          type: runRateTaskType,
          status: runRateTaskStatus,
          points: getPointsForTaskType(runRateTaskType)
        }
      }));
    } else {
      setTask(prev => ({
        ...prev,
        projectId: null,
        runRateValues: null
      }));
    }
  };

  // Get points for task type (for run rate calculations)
  const getPointsForTaskType = (type: TaskType): number => {
    switch (type) {
      case 'Small': return 1;
      case 'Medium': return 3;
      case 'Large': return 5;
      default: return 1;
    }
  };

  // Handle run rate task type change
  const handleRunRateTaskTypeChange = (type: TaskType) => {
    setRunRateTaskType(type);
    if (task.runRateValues) {
      setTask(prev => ({
        ...prev,
        runRateValues: {
          ...prev.runRateValues!,
          type,
          points: getPointsForTaskType(type)
        }
      }));
    }
  };

  // Handle run rate task status change
  const handleRunRateTaskStatusChange = (status: TaskStatus) => {
    setRunRateTaskStatus(status);
    if (task.runRateValues) {
      setTask(prev => ({
        ...prev,
        runRateValues: {
          ...prev.runRateValues!,
          status
        }
      }));
    }
  };




  // Handle save
  const handleSave = () => {
    if (validateForm()) {
      const taskToSave = {
        ...task,
        taskType: task.runRateValues?.type || task.taskType,
        points: task.runRateValues?.points || getPointsForTaskType(task.taskType as TaskType)
      };
      onSave(taskToSave);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <FormFields
          task={task}
          setTask={setTask}
          errors={errors}
        />

        <DateTimeField
          date={task.dueDate}
          showDatePicker={showDatePicker}
          showTimePicker={showTimePicker}
          setShowDatePicker={setShowDatePicker}
          setShowTimePicker={setShowTimePicker}
          onDateChange={handleDateChange}
          onTimeChange={handleTimeChange}
          error={errors.dueDate}
        />

        <SubtaskManager
          subtasks={task.subtasks}
          newSubtaskName={newSubtaskName}
          setNewSubtaskName={setNewSubtaskName}
          onAddSubtask={addSubtask}
          onToggleSubtask={toggleSubtaskCompletion}
          onRemoveSubtask={removeSubtask}
        />

        <ReminderManager
          reminders={task.reminders}
          newReminderDate={newReminderDate}
          showDatePicker={showReminderDatePicker}
          showTimePicker={showReminderTimePicker}
          setShowDatePicker={setShowReminderDatePicker}
          setShowTimePicker={setShowReminderTimePicker}
          onDateChange={handleReminderDateChange}
          onTimeChange={handleReminderTimeChange}
          onAddReminder={addReminder}
          onRemoveReminder={removeReminder}
        />





        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={!task.name.trim()}
          >
            <Text style={styles.saveButtonText}>Save Task</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

