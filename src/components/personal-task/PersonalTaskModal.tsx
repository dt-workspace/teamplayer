// src/components/personal-task/PersonalTaskModal.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, spacing, typography, elevation, borderRadius } from '@constants/theme';
import { ProjectSelector } from './ProjectSelector';
import { RunRateTaskOptions } from './RunRateTaskOptions';
import { Project } from '@models/Project';
import { ProjectController } from '@controllers/ProjectController';
import { PersonalTask, PersonalTaskModalProps, Reminder, RunRateValues } from './types';
import { TaskType, TaskStatus } from '@components/project-run-rate/types';
import { authController } from '@controllers/index';

export const PersonalTaskModal: React.FC<PersonalTaskModalProps> = ({
  visible,
  onClose,
  onSave,
  initialTask,
}) => {
  // Initialize task state with defaults or initial values
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
  });

  // State for date/time picker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // State for new subtask and reminder
  const [newSubtaskName, setNewSubtaskName] = useState('');
  const [newReminderDate, setNewReminderDate] = useState(new Date());
  const [showReminderDatePicker, setShowReminderDatePicker] = useState(false);
  const [showReminderTimePicker, setShowReminderTimePicker] = useState(false);
  
  // State for project selection
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  
  // State for run rate values
  const [runRateTaskType, setRunRateTaskType] = useState<TaskType>('Small');
  const [runRateTaskStatus, setRunRateTaskStatus] = useState<TaskStatus>('To Do');
  
  // Project controller for fetching projects
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

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
      if(!user) {
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
    onSave(task);
    onClose();
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
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Personal Task</Text>
              <TouchableOpacity onPress={onClose}>
                <Icon name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              {/* Task Name */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Task Name*</Text>
                <TextInput
                  style={styles.textInput}
                  value={task.name}
                  onChangeText={(text) => setTask({ ...task, name: text })}
                  placeholder="Enter task name"
                  placeholderTextColor={colors.placeholder}
                />
              </View>

              {/* Project Selector */}
              <ProjectSelector
                selectedProjectId={task.projectId}
                onSelectProject={handleSelectProject}
                projects={projects}
                isLoading={isLoadingProjects}
                onSearchProjects={handleSearchProjects}
              />

              {/* Run Rate Values (only shown when a project is selected) */}
              {task.projectId && (
                <RunRateTaskOptions
                  taskType={task.runRateValues?.type || runRateTaskType}
                  taskStatus={task.runRateValues?.status || runRateTaskStatus}
                  onTaskTypeChange={handleRunRateTaskTypeChange}
                  onTaskStatusChange={handleRunRateTaskStatusChange}
                  getPointsForTaskType={getPointsForTaskType}
                />
              )}

              {/* Due Date & Time */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Due Date & Time</Text>
                <View style={styles.dateTimeContainer}>
                  <TouchableOpacity 
                    style={styles.dateTimeButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Icon name="calendar" size={20} color={colors.primary} />
                    <Text style={styles.dateTimeText}>{formatDate(task.dueDate)}</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.dateTimeButton}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Icon name="clock-outline" size={20} color={colors.primary} />
                    <Text style={styles.dateTimeText}>{formatTime(task.dueDate)}</Text>
                  </TouchableOpacity>
                </View>

                {showDatePicker && (
                  <DateTimePicker
                    value={task.dueDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}

                {showTimePicker && (
                  <DateTimePicker
                    value={task.dueDate}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                  />
                )}
              </View>
              </ScrollView>

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
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    padding: spacing.lg,
    maxHeight: '90%',
    ...elevation.large,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
  },
  formContainer: {
    maxHeight: '80%',
  },
  formGroup: {
    marginBottom: spacing.lg,
  },
  formLabel: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  textInput: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    fontSize: typography.fontSizes.md,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    flex: 1,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateTimeText: {
    fontSize: typography.fontSizes.md,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  prioritySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    marginHorizontal: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  priorityOptionSelected: {
    borderWidth: 0,
  },
  priorityOptionText: {
    fontSize: typography.fontSizes.sm,
    color: colors.text,
  },
  priorityOptionTextSelected: {
    color: colors.card,
    fontWeight: typography.fontWeights.medium,
  },
  categorySelector: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryOptionSelected: {
    backgroundColor: colors.primary,
    borderWidth: 0,
  },
  categoryOptionText: {
    fontSize: typography.fontSizes.sm,
    color: colors.text,
    marginLeft: spacing.xs,
  },
  categoryOptionTextSelected: {
    color: colors.card,
    fontWeight: typography.fontWeights.medium,
  },
  statusSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statusOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    marginHorizontal: spacing.xs,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: '48%',
  },
  statusOptionSelected: {
    borderWidth: 0,
  },
  statusOptionText: {
    fontSize: typography.fontSizes.sm,
    color: colors.text,
  },
  statusOptionTextSelected: {
    color: colors.card,
    fontWeight: typography.fontWeights.medium,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: borderRadius.round,
    marginVertical: spacing.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.round,
  },
  progressSliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  progressSliderMark: {
    alignItems: 'center',
  },
  progressSliderDot: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.round,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xs,
  },
  progressSliderDotActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  progressSliderValue: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
  },
  textArea: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    fontSize: typography.fontSizes.md,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    height: 100,
  },
  characterCount: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  subtaskInputContainer: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  subtaskInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    fontSize: typography.fontSizes.md,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  addSubtaskButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtaskList: {
    marginTop: spacing.sm,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  subtaskCheckbox: {
    marginRight: spacing.sm,
  },
  subtaskName: {
    flex: 1,
    fontSize: typography.fontSizes.md,
    color: colors.text,
  },
  subtaskNameCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  removeSubtaskButton: {
    padding: spacing.xs,
  },
  reminderInputContainer: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  reminderDateTimeContainer: {
    flex: 1,
    flexDirection: 'row',
    marginRight: spacing.sm,
  },
  reminderDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    flex: 1,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reminderTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addReminderButton: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.sm,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderList: {
    marginTop: spacing.sm,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  reminderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderDateTime: {
    fontSize: typography.fontSizes.sm,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  removeReminderButton: {
    padding: spacing.xs,
  },
  emptyStateText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.card,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
  },
});