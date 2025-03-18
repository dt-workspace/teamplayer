import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius } from '@constants/theme';
import { TaskPriority, PersonalTaskStatus } from '../types';

interface FormFieldsProps {
  name: string;
  priority: TaskPriority;
  status: PersonalTaskStatus;
  taskType: 'Small' | 'Medium' | 'Large';
  notes: string;
  errors: Record<string, string>;
  onNameChange: (value: string) => void;
  onPriorityChange: (value: TaskPriority) => void;
  onStatusChange: (value: PersonalTaskStatus) => void;
  onTaskTypeChange: (value: 'Small' | 'Medium' | 'Large') => void;
  onNotesChange: (value: string) => void;
}

export const FormFields: React.FC<FormFieldsProps> = ({
  name,
  priority,
  status,
  taskType,
  notes,
  errors,
  onNameChange,
  onPriorityChange,
  onStatusChange,
  onTaskTypeChange,
  onNotesChange,
}) => {
  const renderPriorityButtons = () => {
    const priorities: TaskPriority[] = ['High', 'Medium', 'Low'];
    return (
      <View style={styles.buttonGroup}>
        {priorities.map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.button, priority === p && styles.selectedButton]}
            onPress={() => onPriorityChange(p)}
          >
            <Text style={[styles.buttonText, priority === p && styles.selectedButtonText]}>
              {p}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderTaskTypeButtons = () => {
    const types: Array<'Small' | 'Medium' | 'Large'> = ['Small', 'Medium', 'Large'];
    return (
      <View style={styles.buttonGroup}>
        {types.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.button, taskType === t && styles.selectedButton]}
            onPress={() => onTaskTypeChange(t)}
          >
            <Text style={[styles.buttonText, taskType === t && styles.selectedButtonText]}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderStatusButtons = () => {
    const statuses: PersonalTaskStatus[] = ['To Do', 'In Progress', 'Completed', 'On Hold'];
    return (
      <View style={styles.buttonGroup}>
        {statuses.map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.button, status === s && styles.selectedButton]}
            onPress={() => onStatusChange(s)}
          >
            <Text style={[styles.buttonText, status === s && styles.selectedButtonText]}>
              {s}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Task Name</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          value={name}
          onChangeText={onNameChange}
          placeholder="Enter task name"
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Priority</Text>
        {renderPriorityButtons()}
        {errors.priority && <Text style={styles.errorText}>{errors.priority}</Text>}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Task Type</Text>
        {renderTaskTypeButtons()}
        {errors.taskType && <Text style={styles.errorText}>{errors.taskType}</Text>}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Status</Text>
        {renderStatusButtons()}
        {errors.status && <Text style={styles.errorText}>{errors.status}</Text>}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={onNotesChange}
          placeholder="Add notes"
          multiline
          numberOfLines={4}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.medium,
  },
  fieldContainer: {
    marginBottom: spacing.medium,
  },
  label: {
    ...typography.label,
    marginBottom: spacing.small,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.small,
    padding: spacing.small,
    backgroundColor: colors.white,
  },
  inputError: {
    borderColor: colors.error,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.small,
  },
  button: {
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    borderRadius: borderRadius.small,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  selectedButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  buttonText: {
    ...typography.body,
    color: colors.text,
  },
  selectedButtonText: {
    color: colors.white,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xsmall,
  },
});