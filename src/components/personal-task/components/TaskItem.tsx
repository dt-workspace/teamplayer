// src/components/personal-task/components/TaskItem.tsx
import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, elevation, spacing } from '@constants/theme';
import { styles } from './styles';
import dayjs from 'dayjs';
import { PersonalTask } from './types';
import LinearGradient from 'react-native-linear-gradient';

interface TaskItemProps {
    task: PersonalTask;
    onPress: (task: PersonalTask) => void;
    onDelete: (taskId: number) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onPress, onDelete }) => {
    // Animation references
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    // Get status color and gradient
    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return colors.success;
            case 'In Progress': return colors.primary;
            case 'On Hold': return colors.warning;
            default: return colors.textSecondary;
        }
    };

    const getStatusGradient = (status) => {
        switch (status) {
            case 'Completed': return [colors.success, colors.successLight || '#70d49f'];
            case 'In Progress': return [colors.primary, colors.primaryLight || '#70a9d4'];
            case 'On Hold': return [colors.warning, colors.warningLight || '#f0c170'];
            default: return [colors.textSecondary, colors.border];
        }
    };

    // Get priority icon and color
    const getPriorityInfo = (priority) => {
        switch (priority) {
            case 'High':
                return {
                    icon: 'alert-circle',
                    color: colors.error,
                    gradient: [colors.error, '#ff7c7c']
                };
            case 'Medium':
                return {
                    icon: 'alert-circle-outline',
                    color: colors.warning,
                    gradient: [colors.warning, '#ffd27c']
                };
            case 'Low':
                return {
                    icon: 'checkbox-marked-circle-outline',
                    color: colors.success,
                    gradient: [colors.success, '#7cffb9']
                };
            default:
                return {
                    icon: 'flag-outline',
                    color: colors.textSecondary,
                    gradient: [colors.textSecondary, colors.border]
                };
        }
    };

    // Get category icon and colors
    const getCategoryInfo = (category) => {
        switch (category) {
            case 'Admin':
                return {
                    icon: 'shield-account',
                    gradient: ['#5c6bc0', '#7986cb']
                };
            case 'Meetings':
                return {
                    icon: 'account-group',
                    gradient: ['#26a69a', '#4db6ac']
                };
            case 'Development':
                return {
                    icon: 'code-braces',
                    gradient: ['#ec407a', '#f48fb1']
                };
            case 'Design':
                return {
                    icon: 'palette',
                    gradient: ['#7e57c2', '#9575cd']
                };
            case 'Research':
                return {
                    icon: 'magnify',
                    gradient: ['#26c6da', '#4dd0e1']
                };
            case 'Other':
                return {
                    icon: 'dots-horizontal-circle',
                    gradient: ['#78909c', '#90a4ae']
                };
            default:
                return {
                    icon: 'checkbox-marked-circle-outline',
                    gradient: [colors.primary, colors.primaryLight || '#70a9d4']
                };
        }
    };

    const priorityInfo = getPriorityInfo(task.priority);
    const statusColor = getStatusColor(task.status);
    const statusGradient = getStatusGradient(task.status);
    const categoryInfo = getCategoryInfo(task.category);
    const dueDate = dayjs(task.due_date);
    const today = dayjs();
    const isOverdue = dueDate.isBefore(today, 'day') && task.status !== 'Completed';
    const isToday = dueDate.isSame(today, 'day');

    // Parse subtasks if they are stored as a JSON string
    let subtasks = [];
    try {
        if (typeof task.subtasks === 'string') {
            subtasks = JSON.parse(task.subtasks);
        } else if (Array.isArray(task.subtasks)) {
            subtasks = task.subtasks;
        }
    } catch (error) {
        console.error("Failed to parse subtasks", error);
    }

    // Calculate completion percentage for subtasks if available
    const completedSubtasks = subtasks.filter(st => st.completed).length;
    const subtaskProgress = subtasks.length > 0
        ? Math.round((completedSubtasks / subtasks.length) * 100)
        : 0;

    // Determine the progress to display (either from task or calculated from subtasks)
    const progressValue = subtasks.length > 0 ? subtaskProgress : task.progress || 0;

    // Animate progress on render
    React.useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: progressValue,
            duration: 800,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false
        }).start();
    }, [progressValue]);

    // Touch animations
    const onPressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.97,
            useNativeDriver: true,
            speed: 20,
            bounciness: 6
        }).start();
    };

    const onPressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 20,
            bounciness: 6
        }).start();
    };

    return (
        <Animated.View
            style={[
                styles.taskCardContainer,
                {
                    transform: [{ scale: scaleAnim }]
                }
            ]}
        >
            <TouchableOpacity
                style={[
                    styles.taskCard,
                    task.status === 'Completed' && styles.completedTaskCard
                ]}
                onPress={() => onPress(task)}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                activeOpacity={0.9}
            >
                {/* Status indicator line with gradient */}
                <LinearGradient
                    colors={statusGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.statusLine}
                />

                <View style={styles.taskContent}>
                    <View style={styles.taskHeader}>
                        <LinearGradient
                            colors={categoryInfo.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.categoryBadge}
                        >
                            <Icon name={categoryInfo.icon} size={14} color={colors.card} />
                        </LinearGradient>

                        <View style={styles.taskTitleContainer}>
                            <Text
                                numberOfLines={1}
                                style={[
                                    styles.taskName,
                                    task.status === 'Completed' && styles.completedTaskText
                                ]}
                            >
                                {task.name}
                            </Text>

                            {task.status === 'Completed' && (
                                <Icon name="check-circle" size={16} color={colors.success} style={styles.completedIcon} />
                            )}
                        </View>

                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => onDelete(task.id)}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Icon name="delete-outline" size={18} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Task details */}
                    <View style={styles.taskDetails}>
                        <LinearGradient
                            colors={priorityInfo.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.priorityBadge}
                        >
                            <View style={{
                                paddingHorizontal: spacing.sm,
                                paddingVertical: spacing.xs,
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginRight: spacing.sm,
                                ...elevation.tiny,
                            }}>
                                <Icon name={priorityInfo.icon} size={12} color={colors.card} />
                                <Text style={styles.priorityText}>{task.priority}</Text>
                            </View>

                        </LinearGradient>

                        <View style={styles.taskStatusContainer}>
                            <Text style={[styles.statusText, { color: statusColor }]}>
                                {task.status}
                            </Text>
                        </View>
                    </View>

                    {/* Due date section */}
                    <View style={styles.dueDate}>
                        <View style={[
                            styles.dueDateIconContainer,
                            isOverdue && styles.overdueIconContainer,
                            isToday && styles.todayIconContainer,
                        ]}>
                            <Icon
                                name={isOverdue ? "alert-circle" : isToday ? "calendar-today" : "calendar"}
                                size={14}
                                color={colors.card}
                            />
                        </View>
                        <Text
                            style={[
                                styles.dueDateText,
                                isOverdue && styles.overdueText,
                                isToday && styles.todayText
                            ]}
                        >
                            {isToday ? 'Today' : dueDate.format('D MMM, YYYY')} at {dueDate.format('h:mm A')}
                        </Text>
                    </View>

                    {/* Progress information - show for all tasks */}
                    <View style={styles.progressSection}>
                        <View style={styles.progressInfo}>
                            <Text style={styles.progressText}>
                                {task.status === 'Completed' ? 'Completed' : `Progress: ${progressValue}%`}
                            </Text>
                            {subtasks.length > 0 && (
                                <View style={styles.subtaskIndicator}>
                                    <Icon name="format-list-checks" size={14} color={colors.textSecondary} />
                                    <Text style={styles.subtaskText}>
                                        {completedSubtasks}/{subtasks.length}
                                    </Text>
                                </View>
                            )}
                        </View>
                        <View style={styles.progressContainer}>
                            <Animated.View
                                style={[
                                    styles.progressBar,
                                    {
                                        width: progressAnim.interpolate({
                                            inputRange: [0, 100],
                                            outputRange: ['0%', '100%']
                                        }),
                                        backgroundColor: task.status === 'Completed' ? colors.success : statusColor
                                    }
                                ]}
                            />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};