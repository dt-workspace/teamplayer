import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, spacing, typography, borderRadius } from '@constants/theme';
import { Reminder } from '../types';
import { formatDate, formatTime } from './utils';

interface ReminderManagerProps {
  reminders: Reminder[];
  newReminderDate: Date;
  showReminderDatePicker: boolean;
  showReminderTimePicker: boolean;
  onReminderDateChange: (event: any, selectedDate?: Date) => void;
  onReminderTimeChange: (event: any, selectedTime?: Date) => void;
  onShowReminderDatePicker: () => void;
  onShowReminderTimePicker: () => void;
  onAddReminder: () => void;
  onRemoveReminder: (id: string) => void;
}

export const ReminderManager: React.FC<ReminderManagerProps> = ({
  reminders,
  newReminderDate,
  showReminderDatePicker,
  showReminderTimePicker,
  onReminderDateChange,
  onReminderTimeChange,
  onShowReminderDatePicker,
  onShowReminderTimePicker,
  onAddReminder,
  onRemoveReminder,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Schedule reminders</Text>

      <View style={styles.newReminderContainer}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={onShowReminderDatePicker}
        >
          <Icon name="calendar" size={20} color={colors.primary} style={styles.buttonIcon} />
          <Text style={styles.dateTimeText}>{formatDate(newReminderDate)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.timeButton}
          onPress={onShowReminderTimePicker}
        >
          <Icon name="clock" size={20} color={colors.primary} style={styles.buttonIcon} />
          <Text style={styles.dateTimeText}>{formatTime(newReminderDate)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={onAddReminder}
        >
          <Icon name="plus" size={22} color={colors.white} />
        </TouchableOpacity>
      </View>

      {showReminderDatePicker && (
        <DateTimePicker
          value={newReminderDate}
          mode="date"
          onChange={onReminderDateChange}
          minimumDate={new Date()}
        />
      )}

      {showReminderTimePicker && (
        <DateTimePicker
          value={newReminderDate}
          mode="time"
          onChange={onReminderTimeChange}
        />
      )}

      {reminders.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="bell-outline" size={40} color={colors.border} />
          <Text style={styles.emptyStateText}>No reminders yet</Text>
          <Text style={styles.emptyStateSubtext}>Don't forget important deadlines</Text>
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Scheduled Reminders</Text>
          <View style={styles.reminderList}>
            {reminders.map((reminder) => {
              const isInPast = new Date() > reminder.time;
              
              return (
                <View key={reminder.id} style={[
                  styles.reminderItem, 
                  isInPast && styles.pastReminderItem
                ]}>
                  <View style={styles.reminderIconContainer}>
                    <Icon
                      name={isInPast ? "bell-off" : "bell"}
                      size={20}
                      color={isInPast ? colors.textSecondary : colors.primary}
                    />
                  </View>
                  <View style={styles.reminderInfo}>
                    <Text style={[
                      styles.reminderDate,
                      isInPast && styles.pastReminderText
                    ]}>
                      {formatDate(reminder.time)}
                    </Text>
                    <Text style={[
                      styles.reminderTime,
                      isInPast && styles.pastReminderText
                    ]}>
                      {formatTime(reminder.time)}
                      {isInPast && " (past)"}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => onRemoveReminder(reminder.id)}
                  >
                    <Icon name="close-circle-outline" size={20} color={colors.error} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </>
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
  newReminderContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    backgroundColor: colors.white,
  },
  timeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    backgroundColor: colors.white,
  },
  buttonIcon: {
    marginRight: spacing.sm,
  },
  dateTimeText: {
    fontSize: 14,
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  reminderList: {
    gap: spacing.sm,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pastReminderItem: {
    backgroundColor: colors.background,
    borderStyle: 'dashed',
  },
  reminderIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderDate: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  reminderTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  pastReminderText: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  deleteButton: {
    padding: spacing.xs,
  },
});