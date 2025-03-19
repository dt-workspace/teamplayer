import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography, borderRadius } from '@constants/theme';
import { TaskPriority, PersonalTaskStatus } from '../types';

// Task categories
export type TaskCategory = 'Admin' | 'Meetings' | 'Development' | 'Design' | 'Research' | 'Other';

interface FormFieldsProps {
  name: string;
  priority: TaskPriority;
  status: PersonalTaskStatus;
  taskType: 'Small' | 'Medium' | 'Large';
  category: TaskCategory;
  notes: string;
  errors: Record<string, string>;
  onNameChange: (value: string) => void;
  onPriorityChange: (value: TaskPriority) => void;
  onStatusChange: (value: PersonalTaskStatus) => void;
  onTaskTypeChange: (value: 'Small' | 'Medium' | 'Large') => void;
  onCategoryChange: (value: TaskCategory) => void;
  onNotesChange: (value: string) => void;
}

export const FormFields: React.FC<FormFieldsProps> = ({
  name,
  priority,
  status,
  taskType,
  category,
  notes,
  errors,
  onNameChange,
  onPriorityChange,
  onStatusChange,
  onTaskTypeChange,
  onCategoryChange,
  onNotesChange,
}) => {
  // Priority configuration
  const priorityIcons: Record<TaskPriority, string> = {
    High: 'alert-circle',
    Medium: 'alert',
    Low: 'alert-circle-outline',
  };

  const priorityColors: Record<TaskPriority, string> = {
    High: colors.error || '#f44336',
    Medium: colors.warning || '#ff9800',
    Low: colors.success || '#4caf50',
  };

  // Task type configuration
  const taskTypeIcons: Record<'Small' | 'Medium' | 'Large', string> = {
    Small: 'circle-small',
    Medium: 'circle-medium',
    Large: 'circle-large',
  };

  // Status configuration
  const statusIcons: Record<PersonalTaskStatus, string> = {
    'To Do': 'clock-outline',
    'In Progress': 'progress-check',
    'Completed': 'check-circle',
    'On Hold': 'pause-circle',
  };

  const statusColors: Record<PersonalTaskStatus, string> = {
    'To Do': colors.textSecondary || '#757575',
    'In Progress': colors.primary || '#2196f3',
    'Completed': colors.success || '#4caf50',
    'On Hold': colors.warning || '#ff9800',
  };
  
  // Category configuration
  const categoryIcons: Record<TaskCategory, string> = {
    'Admin': 'file-document-outline',
    'Meetings': 'account-group',
    'Development': 'code-braces',
    'Design': 'palette-outline',
    'Research': 'magnify',
    'Other': 'dots-horizontal',
  };

  return (
    <View style={styles.container}>
      {/* Task Name Field */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Task Name</Text>
        <View style={[styles.inputWrapper, errors.name && styles.inputError]}>
          <Icon name="format-title" size={20} color={colors.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={onNameChange}
            placeholder="Enter task name"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="sentences"
          />
        </View>
        {errors.name && (
          <Text style={styles.errorText}>
            <Icon name="alert-circle" size={14} color={colors.error} /> {errors.name}
          </Text>
        )}
      </View>

      {/* Priority Selection */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityButtons}>
          {(['High', 'Medium', 'Low'] as TaskPriority[]).map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.priorityButton, 
                priority === p && { 
                  backgroundColor: `${priorityColors[p]}20`, // 20% opacity
                  borderColor: priorityColors[p]
                }
              ]}
              onPress={() => onPriorityChange(p)}
            >
              <Icon 
                name={priorityIcons[p]} 
                size={18} 
                color={priorityColors[p]} 
                style={styles.priorityIcon} 
              />
              <Text style={[
                styles.priorityText, 
                { color: priority === p ? priorityColors[p] : colors.textSecondary },
                priority === p && styles.activePriorityText
              ]}>
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.priority && <Text style={styles.errorText}>{errors.priority}</Text>}
      </View>

      {/* Task Type Selection */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Task Size</Text>
        <View style={styles.taskTypeButtons}>
          {(['Small', 'Medium', 'Large'] as Array<'Small' | 'Medium' | 'Large'>).map((t) => (
            <TouchableOpacity
              key={t}
              style={[
                styles.taskTypeButton, 
                taskType === t && styles.activeTaskTypeButton
              ]}
              onPress={() => onTaskTypeChange(t)}
            >
              <Icon 
                name={taskTypeIcons[t]} 
                size={t === 'Small' ? 16 : t === 'Medium' ? 20 : 24} 
                color={taskType === t ? colors.primary : colors.textSecondary} 
              />
              <Text style={[
                styles.taskTypeText,
                taskType === t && styles.activeTaskTypeText
              ]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.taskType && <Text style={styles.errorText}>{errors.taskType}</Text>}
      </View>

      {/* Category Selection */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryButtons}>
          {(['Admin', 'Meetings', 'Development', 'Design', 'Research', 'Other'] as TaskCategory[]).map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton, 
                category === cat && styles.activeCategoryButton
              ]}
              onPress={() => onCategoryChange(cat)}
            >
              <Icon 
                name={categoryIcons[cat]} 
                size={18} 
                color={category === cat ? colors.primary : colors.textSecondary} 
                style={styles.categoryIcon} 
              />
              <Text style={[
                styles.categoryText,
                category === cat && styles.activeCategoryText
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
      </View>

      {/* Status Selection */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Status</Text>
        <View style={styles.statusButtons}>
          {(['To Do', 'In Progress', 'Completed', 'On Hold'] as PersonalTaskStatus[]).map((s) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.statusButton, 
                status === s && { 
                  backgroundColor: `${statusColors[s]}20`,  // 20% opacity
                  borderColor: statusColors[s]
                }
              ]}
              onPress={() => onStatusChange(s)}
            >
              <Icon 
                name={statusIcons[s]} 
                size={18} 
                color={status === s ? statusColors[s] : colors.textSecondary} 
                style={styles.statusIcon} 
              />
              <Text style={[
                styles.statusText,
                { color: status === s ? statusColors[s] : colors.textSecondary },
                status === s && styles.activeStatusText
              ]}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.status && <Text style={styles.errorText}>{errors.status}</Text>}
      </View>

      {/* Notes Field */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Notes</Text>
        <View style={styles.notesInputWrapper}>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={onNotesChange}
            placeholder="Add notes about this task..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.md,
  },
  fieldContainer: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    backgroundColor: colors.white,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    padding: 0, // Remove default padding in some platforms
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  },
  // Priority styles
  priorityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
  },
  priorityIcon: {
    marginRight: 4,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activePriorityText: {
    fontWeight: '600',
  },
  // Task type styles
  taskTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  taskTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
  },
  activeTaskTypeButton: {
    backgroundColor: `${colors.primary}15`, // 15% opacity
    borderColor: colors.primary,
  },
  taskTypeText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  activeTaskTypeText: {
    color: colors.primary,
    fontWeight: '600',
  },
  // Status styles
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statusButton: {
    flexGrow: 1,
    flexBasis: '45%', // Approx. 2 per row with gap
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    marginBottom: spacing.xs,
  },
  statusIcon: {
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
  },
  activeStatusText: {
    fontWeight: '600',
  },
  // Notes styles
  notesInputWrapper: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
  },
  notesInput: {
    minHeight: 80,
    fontSize: 14,
    color: colors.text,
    padding: spacing.sm,
  },
  // Category styles
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryButton: {
    flexGrow: 1,
    flexBasis: '30%', // Approx. 3 per row with gap
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    marginBottom: spacing.xs,
  },
  activeCategoryButton: {
    backgroundColor: `${colors.primary}15`, // 15% opacity
    borderColor: colors.primary,
  },
  categoryIcon: {
    marginRight: 4,
  },
  categoryText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  activeCategoryText: {
    color: colors.primary,
    fontWeight: '600',
  },
});