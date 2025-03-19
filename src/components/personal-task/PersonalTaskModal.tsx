import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, elevation } from '@constants/theme';
import { PersonalTask, PersonalTaskModalProps } from './types';
import { FormFields } from './components/FormFields';
import { DateTimeField } from './components/DateTimeField';
import { SubtaskManager } from './components/SubtaskManager';
import { ReminderManager } from './components/ReminderManager';

// Update the prop types to include isVisible
interface PersonalTaskModalProps {
  ref: any;
  onClose: () => void;
  onSave: (task: PersonalTask) => void;
  initialTask?: PersonalTask | null;
  isVisible?: boolean;
}

export const PersonalTaskModal = forwardRef<RBSheet, PersonalTaskModalProps>(({
  onClose,
  onSave,
  initialTask,
  isVisible
}, ref) => {
  const sheetRef = React.useRef<RBSheet>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  // Forward the ref methods
  useImperativeHandle(ref, () => ({
    open: () => {
      if (sheetRef.current && !isSheetOpen) {
        sheetRef.current.open();
        setIsSheetOpen(true);
      }
    },
    close: () => {
      if (sheetRef.current && isSheetOpen) {
        sheetRef.current.close();
        setIsSheetOpen(false);
      }
    }
  }));

  // Watch for isVisible prop changes
  useEffect(() => {
    if (isVisible && !isSheetOpen && sheetRef.current) {
      sheetRef.current.open();
      setIsSheetOpen(true);
    } else if (!isVisible && isSheetOpen && sheetRef.current) {
      sheetRef.current.close();
      setIsSheetOpen(false);
    }
  }, [isVisible, isSheetOpen]);

  // Reset task data when initialTask changes or modal opens
  useEffect(() => {
    if (isVisible || isSheetOpen) {
      const taskType = initialTask?.taskType || 'Small';
      // Set default points based on task type
      let points = 1;
      if (taskType === 'Medium') points = 3;
      if (taskType === 'Large') points = 5;
      
      // Use initialTask points if available, otherwise use calculated points
      const finalPoints = initialTask?.points || points;
      
      setTask({
        name: initialTask?.name || '',
        dueDate: initialTask?.due_date ? new Date(initialTask?.due_date) : new Date(),
        priority: initialTask?.priority || 'Medium',
        category: initialTask?.category || 'Other',
        notes: initialTask?.notes || '',
        status: initialTask?.status || 'To Do',
        progress: initialTask?.progress || 0,
        subtasks: initialTask?.subtasks || [],
        reminders: initialTask?.reminders || [],
        projectId: initialTask?.projectId || null,
        runRateValues: initialTask?.runRateValues || null,
        taskType: taskType,
        points: finalPoints
      });
      setErrors({});
    }
  }, [initialTask, isVisible, isSheetOpen]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [task, setTask] = useState<PersonalTask>({
    name: initialTask?.name || '',
    dueDate: initialTask?.due_date ? new Date(initialTask?.due_date) : new Date(),
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
  const [activeSection, setActiveSection] = useState<'details' | 'subtasks' | 'reminders'>('details');

  // Animation value for tab transitions
  const [fadeAnim] = useState(new Animated.Value(1));
  
  // Animate content when changing tabs
  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  }, [activeSection]);

  // Handle date change
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(task.dueDate.getHours(), task.dueDate.getMinutes());
      setTask({ ...task, dueDate: newDate });
    }
  };

  // Handle time change
  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(task.dueDate);
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setTask({ ...task, dueDate: newDate });
    }
  };


  // Add a new subtask
  const addSubtask = () => {
    if (newSubtaskName.trim()) {
      const newSubtask = {
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

  // Handle form fields changes
  const handleNameChange = (value: string) => setTask({ ...task, name: value });
  const handlePriorityChange = (value: typeof task.priority) => setTask({ ...task, priority: value });
  const handleStatusChange = (value: typeof task.status) => setTask({ ...task, status: value });
  const handleTaskTypeChange = (value: typeof task.taskType) => {
    // Set points based on task type
    let points = 1;
    if (value === 'Medium') points = 3;
    if (value === 'Large') points = 5;
    
    setTask({ ...task, taskType: value, points });
  };
  const handleCategoryChange = (value: typeof task.category) => setTask({ ...task, category: value });
  const handleNotesChange = (value: string) => setTask({ ...task, notes: value });

  // Validate form fields
  const validateForm = () => {
    const newErrors: Record<string, string> = {
      name: task.name.trim() ? '' : 'Task name is required',
      dueDate: task.dueDate ? '' : 'Due date is required',
      priority: task.priority ? '' : 'Priority is required',
      status: task.status ? '' : 'Status is required',
      taskType: task.taskType ? '' : 'Task type is required',
      points: task.points >= 1 ? '' : 'Points must be greater than 0'
    };

    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([_, value]) => Boolean(value))
    );
    
    setErrors(filteredErrors);
    return Object.keys(filteredErrors).length === 0;
  };

  // Handle save
  const handleSave = () => {
    if (validateForm()) {
      // Create a copy of the task with proper formatting for database storage
      const formattedTask = {
        ...task,
        // Convert Date object to ISO string for database storage
        dueDate: task.dueDate instanceof Date ? task.dueDate.toISOString() : task.dueDate,
        // Convert subtasks array to JSON string
        subtasks: task.subtasks.length ? JSON.stringify(task.subtasks) : null
      };
      
      onSave(formattedTask);
      onClose();
    } else {
      // If there are errors, switch to the details tab
      setActiveSection('details');
    }
  };

  // Handle clean up on close
  const handleOnClose = () => {
    // Update our local state
    setIsSheetOpen(false);
    
    // Allow parent to update its state
    onClose();
  };

  return (
    <RBSheet
      ref={sheetRef}
      onClose={handleOnClose}
      height={800}
      openDuration={250}
      closeOnDragDown={true}
      dragFromTopOnly={true}
      customStyles={{
        container: styles.modalContainer,
        draggableIcon: styles.draggableIcon,
      }}
    >
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{initialTask ? 'Edit Task' : 'New Task'}</Text>
        <TouchableOpacity onPress={handleOnClose} style={styles.closeButton}>
          <Icon name="close" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeSection === 'details' && styles.activeTab]} 
          onPress={() => setActiveSection('details')}
        >
          <Icon 
            name="card-text-outline" 
            size={20} 
            color={activeSection === 'details' ? colors.primary : colors.textSecondary} 
          />
          <Text style={[styles.tabText, activeSection === 'details' && styles.activeTabText]}>Details</Text>
          {Object.keys(errors).length > 0 && activeSection !== 'details' && (
            <View style={styles.errorDot} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeSection === 'subtasks' && styles.activeTab]} 
          onPress={() => setActiveSection('subtasks')}
        >
          <Icon 
            name="format-list-checks" 
            size={20} 
            color={activeSection === 'subtasks' ? colors.primary : colors.textSecondary} 
          />
          <Text style={[styles.tabText, activeSection === 'subtasks' && styles.activeTabText]}>Subtasks</Text>
          {task.subtasks.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{task.subtasks.length}</Text>
            </View>
          )}
        </TouchableOpacity>
        
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Animated.ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          style={{ opacity: fadeAnim }}
        >
          {activeSection === 'details' && (
            <>
              <FormFields
                name={task.name}
                priority={task.priority}
                status={task.status}
                taskType={task.taskType}
                category={task.category}
                notes={task.notes}
                errors={errors}
                onNameChange={handleNameChange}
                onPriorityChange={handlePriorityChange}
                onStatusChange={handleStatusChange}
                onTaskTypeChange={handleTaskTypeChange}
                onCategoryChange={handleCategoryChange}
                onNotesChange={handleNotesChange}
              />

              <DateTimeField
                dueDate={task.dueDate}
                showDatePicker={showDatePicker}
                showTimePicker={showTimePicker}
                error={errors.dueDate}
                onDateChange={handleDateChange}
                onTimeChange={handleTimeChange}
                onShowDatePicker={() => setShowDatePicker(true)}
                onShowTimePicker={() => setShowTimePicker(true)}
              />
            </>
          )}

          {activeSection === 'subtasks' && (
            <SubtaskManager
              subtasks={task.subtasks}
              newSubtaskName={newSubtaskName}
              onNewSubtaskNameChange={setNewSubtaskName}
              onAddSubtask={addSubtask}
              onToggleSubtask={toggleSubtaskCompletion}
              onRemoveSubtask={removeSubtask}
            />
          )}

        </Animated.ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveButton, !task.name.trim() && styles.disabledButton]}
            onPress={handleSave}
            disabled={!task.name.trim()}
          >
            <Text style={styles.saveButtonText}>Save Task</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </RBSheet>
  );
});

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...elevation.md,
  },
  draggableIcon: {
    backgroundColor: colors.border,
    width: 40,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    padding: spacing.xs,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '500',
  },
  scrollContent: {
    padding: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  cancelButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.text,
    fontWeight: '500',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: colors.border,
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: '500',
    fontSize: 14,
  },
  errorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    position: 'absolute',
    top: 8,
    right: 8,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    position: 'absolute',
    top: 8,
    right: 8,
  },

  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});