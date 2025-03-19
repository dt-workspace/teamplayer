import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
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
  // Animation value for newly added subtasks
  const [fadeAnims] = useState<Record<string, Animated.Value>>({});

  // Get or create a fade animation for a subtask
  const getOrCreateFadeAnim = (id: string) => {
    if (!fadeAnims[id]) {
      fadeAnims[id] = new Animated.Value(0);
      Animated.timing(fadeAnims[id], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    return fadeAnims[id];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add and manage subtasks</Text>
      
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Icon name="format-list-checks" size={20} color={colors.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={newSubtaskName}
            onChangeText={onNewSubtaskNameChange}
            placeholder="Add a subtask"
            placeholderTextColor={colors.textSecondary}
            returnKeyType="done"
            onSubmitEditing={newSubtaskName.trim() ? onAddSubtask : undefined}
          />
        </View>
        <TouchableOpacity 
          style={[styles.addButton, !newSubtaskName.trim() && styles.disabledButton]}
          onPress={onAddSubtask}
          disabled={!newSubtaskName.trim()}
        >
          <Icon name="plus" size={22} color={colors.white} />
        </TouchableOpacity>
      </View>

      {subtasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="format-list-bulleted" size={40} color={colors.border} />
          <Text style={styles.emptyStateText}>No subtasks yet</Text>
          <Text style={styles.emptyStateSubtext}>Break down your task into smaller pieces</Text>
        </View>
      ) : (
        <View style={styles.subtaskList}>
          {subtasks.map((subtask) => (
            <Animated.View 
              key={subtask.id} 
              style={[styles.subtaskItem, { opacity: getOrCreateFadeAnim(subtask.id) }]}
            >
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => onToggleSubtask(subtask.id)}
              >
                <Icon
                  name={subtask.completed ? 'checkbox-marked' : 'checkbox-blank-outline'}
                  size={22}
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
                <Icon name="close-circle-outline" size={20} color={colors.error} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      )}
      
      {subtasks.length > 0 && (
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            {subtasks.filter(s => s.completed).length} of {subtasks.length} completed
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(subtasks.filter(s => s.completed).length / subtasks.length) * 100}%` }
              ]} 
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: colors.border,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  subtaskList: {
    gap: spacing.sm,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkbox: {
    marginRight: spacing.sm,
    padding: spacing.xs,
  },
  subtaskText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  summary: {
    marginTop: spacing.lg,
  },
  summaryText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  }
});