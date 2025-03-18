import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography, elevation, borderRadius } from '@constants/theme';
import { PersonalTask } from '@models/PersonalTask';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PersonalTaskModal } from '../components/personal-task/PersonalTaskModal';
import { taskController } from '../controllers';

type TaskViewScreenProps = {
  route: {
    params: {
      task: PersonalTask;
    };
  };
  navigation: any;
};

export const TaskViewScreen: React.FC<TaskViewScreenProps> = ({ route, navigation }) => {
  const { task } = route.params;
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleSaveTask = async (updatedTask: PersonalTask) => {
    try {
      const response = await taskController.updatePersonalTask(task.id, updatedTask);
      if (response.success) {
        setShowEditModal(false);
        navigation.goBack();
      } else {
        Alert.alert('Error', response.error || 'Failed to update task');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await taskController.deletePersonalTask(task.id);
              if (response.success) {
                navigation.goBack();
              } else {
                Alert.alert('Error', response.error || 'Failed to delete task');
              }
            } catch (error) {
              Alert.alert('Error', 'An unexpected error occurred');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Details</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleEdit}
          >
            <Icon name="pencil" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDelete}
          >
            <Icon name="delete" size={24} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.taskTitle}>{task.name}</Text>
          <View style={styles.taskMeta}>
            <View style={styles.metaItem}>
              <Icon name="calendar" size={20} color={colors.primary} />
              <Text style={styles.metaText}>
                {new Date(task.dueDate).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name="flag" size={20} color={colors.primary} />
              <Text style={styles.metaText}>{task.priority}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.statusContainer}>
            <View
              style={[styles.statusBadge, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.statusText}>{task.status}</Text>
            </View>
            <Text style={styles.progressText}>Progress: {task.progress}%</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <Text style={styles.sectionContent}>{task.category}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.sectionContent}>
            {task.notes || 'No notes available'}
          </Text>
        </View>
      </ScrollView>

      <PersonalTaskModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveTask}
        initialTask={task}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    ...elevation.small,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...elevation.small,
  },
  taskTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
    marginBottom: spacing.xs,
  },
  metaText: {
    marginLeft: spacing.xs,
    color: colors.textSecondary,
    fontSize: typography.fontSizes.md,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionContent: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    color: colors.card,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
  },
  progressText: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
  },
});