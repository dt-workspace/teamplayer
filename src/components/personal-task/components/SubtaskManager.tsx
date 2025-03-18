import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography, borderRadius } from '@constants/theme';
import { Subtask } from '../types';

interface SubtaskManagerProps {
  subtasks: Subtask[];
  newSubtaskName: string;
  onNewSubtaskNameChange: (value: string) => void;
  onAddSubtask: () => void;
  onToggleSubtask: (id: string) => void;
  onRemoveSubtask: (id: string) => void;
}

export const SubtaskManager: React.FC<SubtaskManagerProps> = ({
  subtasks,
  newSubtaskName,
  onNewSubtaskNameChange,
  onAddSubtask,
  onToggleSubtask,
  onRemoveSubtask,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Subtasks</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newSubtaskName}
          onChangeText={onNewSubtaskNameChange}
          placeholder="Add a subtask"
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={onAddSubtask}
          disabled={!newSubtaskName.trim()}
        >
          <Icon name="plus" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.subtaskList}>
        {subtasks.map((subtask) => (
          <View key={subtask.id} style={styles.subtaskItem}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => onToggleSubtask(subtask.id)}
            >
              <Icon
                name={subtask.completed ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={24}
                color={subtask.completed ? colors.primary : colors.text}
              />
            </TouchableOpacity>
            
            <Text style={[styles.subtaskText, subtask.completed && styles.completedText]}>
              {subtask.name}
            </Text>
            
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onRemoveSubtask(subtask.id)}
            >
              <Icon name="delete-outline" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.medium,
  },
  label: {
    ...typography.label,
    marginBottom: spacing.small,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: spacing.small,
    marginBottom: spacing.small,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.small,
    padding: spacing.small,
    backgroundColor: colors.white,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.small,
    padding: spacing.small,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtaskList: {
    gap: spacing.small,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.small,
    padding: spacing.small,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkbox: {
    marginRight: spacing.small,
  },
  subtaskText: {
    ...typography.body,
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.textLight,
  },
  deleteButton: {
    padding: spacing.xsmall,
  },
});