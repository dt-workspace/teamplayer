// src/components/personal-task/CalendarView.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, typography, elevation, borderRadius } from '@constants/theme';

// Define types for our personal task management
type TaskPriority = 'High' | 'Medium' | 'Low';
type TaskStatus = 'To Do' | 'In Progress' | 'Completed' | 'On Hold';
type TaskCategory = 'Admin' | 'Meetings' | 'Development' | 'Design' | 'Research' | 'Other';

type Subtask = {
  id: string;
  name: string;
  completed: boolean;
};

type Reminder = {
  id: string;
  time: Date;
  notificationSound?: string;
};

type PersonalTask = {
  id: number;
  name: string;
  dueDate: Date;
  priority: TaskPriority;
  category: TaskCategory;
  notes: string;
  status: TaskStatus;
  progress: number;
  subtasks: Subtask[];
  reminders: Reminder[];
};

type CalendarViewProps = {
  tasks: PersonalTask[];
  onTaskPress: (task: PersonalTask) => void;
  onAddTask: () => void;
};

type DayData = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: PersonalTask[];
};

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  onTaskPress,
  onAddTask,
}) => {
  // State for current month and year
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Get first day of month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // Get days from previous month to fill calendar
  const daysFromPrevMonth = firstDayOfMonth;
  
  // Get days in previous month
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
  
  // Generate calendar days
  const generateCalendarDays = (): DayData[] => {
    const days: DayData[] = [];
    const today = new Date();
    
    // Add days from previous month
    for (let i = daysInPrevMonth - daysFromPrevMonth + 1; i <= daysInPrevMonth; i++) {
      const date = new Date(currentYear, currentMonth - 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isSameDay(date, today),
        tasks: getTasksForDate(date),
      });
    }
    
    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isSameDay(date, today),
        tasks: getTasksForDate(date),
      });
    }
    
    // Add days from next month to fill remaining cells (to make 6 rows)
    const totalDaysToShow = 42; // 6 rows x 7 days
    const remainingDays = totalDaysToShow - days.length;
    
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(currentYear, currentMonth + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isSameDay(date, today),
        tasks: getTasksForDate(date),
      });
    }
    
    return days;
  };
  
  // Check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };
  
  // Get tasks for a specific date
  const getTasksForDate = (date: Date): PersonalTask[] => {
    return tasks.filter(task => isSameDay(task.dueDate, date));
  };
  
  // Navigate to previous month
  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  // Go to today
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  };
  
  // Format month and year
  const formatMonthYear = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  // Get priority color
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'High': return colors.error;
      case 'Medium': return colors.warning;
      case 'Low': return colors.success;
      default: return colors.textSecondary;
    }
  };
  
  // Get status color
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Completed': return colors.success;
      case 'In Progress': return colors.primary;
      case 'On Hold': return colors.warning;
      case 'To Do': return colors.secondary;
      default: return colors.textSecondary;
    }
  };
  
  // Get category icon
  const getCategoryIcon = (category: TaskCategory) => {
    switch (category) {
      case 'Admin': return 'file-document-outline';
      case 'Meetings': return 'account-group-outline';
      case 'Development': return 'code-braces';
      case 'Design': return 'palette-outline';
      case 'Research': return 'magnify';
      default: return 'dots-horizontal';
    }
  };
  
  // Calendar days
  const calendarDays = generateCalendarDays();
  
  // Selected day tasks
  const selectedDayTasks = getTasksForDate(selectedDate);
  
  // Day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <View style={styles.container}>
      <View style={styles.calendarHeader}>
        <View style={styles.monthYearContainer}>
          <TouchableOpacity onPress={goToPrevMonth}>
            <Icon name="chevron-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.monthYearText}>{formatMonthYear(currentDate)}</Text>
          <TouchableOpacity onPress={goToNextMonth}>
            <Icon name="chevron-right" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.todayButton} onPress={goToToday}>
          <Text style={styles.todayButtonText}>Today</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.dayNamesContainer}>
        {dayNames.map(day => (
          <View key={day} style={styles.dayNameCell}>
            <Text style={styles.dayNameText}>{day}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.calendarGrid}>
        {calendarDays.map((day, index) => (
          <TouchableOpacity 
            key={index} 
            style={[
              styles.dayCell,
              !day.isCurrentMonth && styles.dayCellOtherMonth,
              day.isToday && styles.dayCellToday,
              isSameDay(day.date, selectedDate) && styles.dayCellSelected,
            ]}
            onPress={() => setSelectedDate(day.date)}
          >
            <Text style={[
              styles.dayNumber,
              !day.isCurrentMonth && styles.dayNumberOtherMonth,
              day.isToday && styles.dayNumberToday,
              isSameDay(day.date, selectedDate) && styles.dayNumberSelected,
            ]}>
              {day.date.getDate()}
            </Text>
            
            {day.tasks.length > 0 && (
              <View style={styles.taskIndicatorContainer}>
                {day.tasks.slice(0, 3).map((task, taskIndex) => (
                  <View 
                    key={taskIndex} 
                    style={[
                      styles.taskIndicator,
                      { backgroundColor: getPriorityColor(task.priority) }
                    ]}
                  />
                ))}
                {day.tasks.length > 3 && (
                  <Text style={styles.moreTasksText}>+{day.tasks.length - 3}</Text>
                )}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.selectedDayContainer}>
        <View style={styles.selectedDayHeader}>
          <Text style={styles.selectedDayText}>
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
          <TouchableOpacity 
            style={styles.addTaskButton}
            onPress={onAddTask}
          >
            <Icon name="plus" size={16} color={colors.card} />
            <Text style={styles.addTaskButtonText}>Add Task</Text>
          </TouchableOpacity>
        </View>
        
        {selectedDayTasks.length > 0 ? (
          <ScrollView style={styles.selectedDayTasksContainer}>
            {selectedDayTasks.map(task => (
              <TouchableOpacity 
                key={task.id} 
                style={styles.taskItem}
                onPress={() => onTaskPress(task)}
              >
                <View style={styles.taskItemHeader}>
                  <View style={styles.taskItemTitleContainer}>
                    <Icon 
                      name={getCategoryIcon(task.category)} 
                      size={16} 
                      color={colors.textSecondary} 
                      style={styles.taskItemIcon}
                    />
                    <Text style={styles.taskItemTitle} numberOfLines={1}>{task.name}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
                    <Text style={styles.statusText}>{task.status}</Text>
                  </View>
                </View>
                
                <View style={styles.taskItemFooter}>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
                    <Text style={styles.priorityText}>{task.priority}</Text>
                  </View>
                  
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBarBackground}>
                      <View style={[styles.progressBar, { width: `${task.progress}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{task.progress}%</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyTasksContainer}>
            <Icon name="calendar-blank" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyTasksText}>No tasks for this day</Text>
            <TouchableOpacity 
              style={styles.emptyAddTaskButton}
              onPress={onAddTask}
            >
              <Text style={styles.emptyAddTaskButtonText}>Add a task</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.card,
    ...elevation.small,
  },
  monthYearContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthYearText: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    marginHorizontal: spacing.md,
  },
  todayButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  todayButtonText: {
    color: colors.card,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  dayNamesContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  dayCell: {
    width: '14.28%', // 100% / 7 days
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: spacing.xs,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.divider,
  },
  dayCellOtherMonth: {
    backgroundColor: colors.background,
  },
  dayCellToday: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  dayCellSelected: {
    backgroundColor: colors.primary + '20', // 20% opacity
  },
  dayNumber: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  dayNumberOtherMonth: {
    color: colors.textSecondary,
  },
  dayNumberToday: {
    color: colors.primary,
    fontWeight: typography.fontWeights.bold,
  },
  dayNumberSelected: {
    color: colors.primary,
  },
  taskIndicatorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  taskIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    margin: 1,
  },
  moreTasksText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
  },
  selectedDayContainer: {
    flex: 1,
    backgroundColor: colors.card,
    margin: spacing.md,
    borderRadius: borderRadius.md,
    ...elevation.small,
  },
  selectedDayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  selectedDayText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
  },
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  addTaskButtonText: {
    color: colors.card,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    marginLeft: spacing.xs,
  },
  selectedDayTasksContainer: {
    flex: 1,
    padding: spacing.md,
  },
  taskItem: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  taskItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  taskItemTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskItemIcon: {
    marginRight: spacing.xs,
  },
  taskItemTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    flex: 1,
  },
  statusBadge: {
    paddingVertical: spacing.xs / 2,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: typography.fontSizes.xs,
    color: colors.card,
    fontWeight: typography.fontWeights.medium,
  },
  taskItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingVertical: spacing.xs / 2,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  priorityText: {
    fontSize: typography.fontSizes.xs,
    color: colors.card,
    fontWeight: typography.fontWeights.medium,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarBackground: {
    width: 60,
    height: 6,
    backgroundColor: colors.divider,
    borderRadius: borderRadius.round,
    marginRight: spacing.xs,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.round,
  },
  progressText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
  },
  emptyTasksContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyTasksText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  emptyAddTaskButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  emptyAddTaskButtonText: {
    color: colors.card,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
});