import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, spacing, typography, borderRadius } from '@constants/theme';
import { formatDate, formatTime } from './utils';

interface DateTimeFieldProps {
  dueDate: Date;
  showDatePicker: boolean;
  showTimePicker: boolean;
  error?: string;
  onDateChange: (event: any, selectedDate?: Date) => void;
  onTimeChange: (event: any, selectedTime?: Date) => void;
  onShowDatePicker: () => void;
  onShowTimePicker: () => void;
}

export const DateTimeField: React.FC<DateTimeFieldProps> = ({
  dueDate,
  showDatePicker,
  showTimePicker,
  error,
  onDateChange,
  onTimeChange,
  onShowDatePicker,
  onShowTimePicker,
}) => {
  // Check if due date is in the past
  const isPastDue = new Date() > dueDate;

  // Calculate days remaining
  const daysRemaining = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Due Date and Time</Text>
      <View style={styles.dateTimeContainer}>
        <TouchableOpacity
          style={[
            styles.dateButton, 
            error && styles.dateTimeButtonError,
            isPastDue && styles.pastDueDateButton
          ]}
          onPress={onShowDatePicker}
        >
          <Icon 
            name="calendar" 
            size={20} 
            color={isPastDue ? colors.error : colors.primary} 
            style={styles.buttonIcon} 
          />
          <Text style={[
            styles.dateTimeText,
            isPastDue && styles.pastDueText
          ]}>
            {formatDate(dueDate)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.timeButton, 
            error && styles.dateTimeButtonError,
            isPastDue && styles.pastDueDateButton
          ]}
          onPress={onShowTimePicker}
        >
          <Icon 
            name="clock-outline" 
            size={20} 
            color={isPastDue ? colors.error : colors.primary} 
            style={styles.buttonIcon} 
          />
          <Text style={[
            styles.dateTimeText,
            isPastDue && styles.pastDueText
          ]}>
            {formatTime(dueDate)}
          </Text>
        </TouchableOpacity>
      </View>

      {error && (
        <Text style={styles.errorText}>
          <Icon name="alert-circle" size={14} color={colors.error} /> {error}
        </Text>
      )}

      {!error && (
        <View style={styles.timeRemaining}>
          <Icon 
            name={isPastDue ? "alert" : "information-outline"} 
            size={16} 
            color={isPastDue ? colors.error : colors.textSecondary} 
          />
          <Text style={[
            styles.timeRemainingText,
            isPastDue && styles.pastDueRemainingText
          ]}>
            {isPastDue 
              ? `Overdue by ${Math.abs(daysRemaining)} day${Math.abs(daysRemaining) !== 1 ? 's' : ''}`
              : daysRemaining === 0 
                ? "Due today" 
                : daysRemaining === 1 
                  ? "Due tomorrow" 
                  : `${daysRemaining} days remaining`
            }
          </Text>
        </View>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          onChange={onDateChange}
          minimumDate={new Date(new Date().setDate(new Date().getDate() - 30))} // Allow dates up to 30 days in the past
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={dueDate}
          mode="time"
          onChange={onTimeChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
  },
  timeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
  },
  buttonIcon: {
    marginRight: spacing.sm,
  },
  dateTimeText: {
    fontSize: 14,
    color: colors.text,
  },
  dateTimeButtonError: {
    borderColor: colors.error,
  },
  pastDueDateButton: {
    borderColor: colors.error,
    backgroundColor: colors.lightError || '#ffebee', // Fallback if lightError is not defined
  },
  pastDueText: {
    color: colors.error,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeRemaining: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  timeRemainingText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  pastDueRemainingText: {
    color: colors.error,
  },
});