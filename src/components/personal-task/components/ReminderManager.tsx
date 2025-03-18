import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
      <Text style={styles.label}>Reminders</Text>

      <View style={styles.newReminderContainer}>
        <TouchableOpacity
          style={styles.dateTimeButton}
          onPress={onShowReminderDatePicker}
        >
          <Text style={styles.dateTimeText}>{formatDate(newReminderDate)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateTimeButton}
          onPress={onShowReminderTimePicker}
        >
          <Text style={styles.dateTimeText}>{formatTime(newReminderDate)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={onAddReminder}
        >
          <Icon name="plus" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {showReminderDatePicker && (
        <DateTimePicker
          value={newReminderDate}
          mode="date"
          onChange={onReminderDateChange}
        />
      )}

      {showReminderTimePicker && (
        <DateTimePicker
          value={newReminderDate}
          mode="time"
          onChange={onReminderTimeChange}
        />
      )}

      <View style={styles.reminderList}>
        {reminders.map((reminder) => (
          <View key={reminder.id} style={styles.reminderItem}>
            <Icon
              name="clock-outline"
              size={24}
              color={colors.primary}
              style={styles.reminderIcon}
            />
            <View style={styles.reminderInfo}>
              <Text style={styles.reminderDate}>{formatDate(reminder.time)}</Text>
              <Text style={styles.reminderTime}>{formatTime(reminder.time)}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onRemoveReminder(reminder.id)}
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
  newReminderContainer: {
    flexDirection: 'row',
    gap: spacing.small,
    marginBottom: spacing.small,
  },
  dateTimeButton: {
    flex: 1,
    padding: spacing.small,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.small,
    backgroundColor: colors.white,
  },
  dateTimeText: {
    ...typography.body,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.small,
    padding: spacing.small,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reminderList: {
    gap: spacing.small,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.small,
    padding: spacing.small,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reminderIcon: {
    marginRight: spacing.small,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderDate: {
    ...typography.body,
  },
  reminderTime: {
    ...typography.caption,
    color: colors.textLight,
  },
  deleteButton: {
    padding: spacing.xsmall,
  },
});