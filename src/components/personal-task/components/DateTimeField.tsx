import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Due Date and Time</Text>
      <View style={styles.dateTimeContainer}>
        <TouchableOpacity
          style={[styles.dateTimeButton, error && styles.dateTimeButtonError]}
          onPress={onShowDatePicker}
        >
          <Text style={styles.dateTimeText}>{formatDate(dueDate)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dateTimeButton, error && styles.dateTimeButtonError]}
          onPress={onShowTimePicker}
        >
          <Text style={styles.dateTimeText}>{formatTime(dueDate)}</Text>
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          onChange={onDateChange}
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
    marginBottom: spacing.medium,
  },
  label: {
    ...typography.label,
    marginBottom: spacing.small,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: spacing.small,
  },
  dateTimeButton: {
    flex: 1,
    padding: spacing.small,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.small,
    backgroundColor: colors.white,
  },
  dateTimeButtonError: {
    borderColor: colors.error,
  },
  dateTimeText: {
    ...typography.body,
    textAlign: 'center',
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xsmall,
  },
});