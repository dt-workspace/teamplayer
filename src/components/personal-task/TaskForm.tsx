import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TaskController } from '@controllers/TaskController';
import { NewPersonalTask, PersonalTask } from '@models/PersonalTask';
import { MilestoneController } from '@controllers/MilestoneController';
import { Milestone } from '@models/Milestone';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface TaskFormProps {
    projectId?: number;
    userId: number;
    onClose: () => void;
    onSuccess: () => void;
    initialTask?: PersonalTask | null;
}

const TaskForm: React.FC<TaskFormProps> = ({ projectId, userId, onClose, onSuccess, initialTask }) => {
    const [name, setName] = useState('');
    const [dueDate, setDueDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
    const [taskType, setTaskType] = useState<'Small' | 'Medium' | 'Large'>('Small');
    const [status, setStatus] = useState<'To Do' | 'In Progress' | 'Completed' | 'On Hold'>('To Do');
    const [notes, setNotes] = useState('');
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [selectedMilestoneId, setSelectedMilestoneId] = useState<number | null>(null);
    const [loadingMilestones, setLoadingMilestones] = useState(false);
    const [showMilestoneDropdown, setShowMilestoneDropdown] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [taskId, setTaskId] = useState<number | null>(null);
    const [isProjectTask, setIsProjectTask] = useState(!!projectId);

    const taskController = new TaskController();

    // Initialize form with initial task data if provided
    useEffect(() => {
        if (initialTask) {
            setName(initialTask.name || '');
            setDueDate(new Date(initialTask.dueDate));
            setPriority(initialTask.priority || 'Medium');
            setTaskType(initialTask.taskType || 'Small');
            setStatus(initialTask.status || 'To Do');
            setNotes(initialTask.notes || '');
            setSelectedMilestoneId(initialTask.milestoneId);
            setIsEditing(true);
            setTaskId(initialTask.id);
        } else {
            // Reset form for new task
            setName('');
            setDueDate(new Date());
            setPriority('Medium');
            setTaskType('Small');
            setStatus('To Do');
            setNotes('');
            setSelectedMilestoneId(null);
            setIsEditing(false);
            setTaskId(null);
        }
    }, [initialTask]);

    // Fetch milestones when component mounts
    useEffect(() => {
        fetchMilestones();
    }, [projectId]);

    const fetchMilestones = async () => {
        if (!projectId) return;
        
        try {
            setLoadingMilestones(true);
            const projectMilestones = await MilestoneController.getMilestonesByProject(projectId);
            setMilestones(projectMilestones);
        } catch (error) {
            console.error('Error loading milestones:', error);
            Alert.alert('Error', 'Failed to load milestones');
        } finally {
            setLoadingMilestones(false);
        }
    };

    const getPoints = (type: 'Small' | 'Medium' | 'Large'): number => {
        switch (type) {
            case 'Small': return 1;
            case 'Medium': return 3;
            case 'Large': return 5;
            default: return 1;
        }
    };

    const handleSubmit = async () => {
        try {
            if (!name.trim()) {
                throw new Error('Task name is required');
            }

            if (!taskType) {
                throw new Error('Task type is required');
            }

            const taskData: Omit<NewPersonalTask, 'userId'> = {
                name,
                dueDate: dueDate.toISOString(),
                priority,
                taskType,
                status,
                points: getPoints(taskType),
                notes,
                projectId: isProjectTask ? projectId : null,
                milestoneId: isProjectTask ? selectedMilestoneId : null
            };

            let result;
            
            if (isEditing && taskId) {
                // Update existing task
                result = await taskController.updatePersonalTask(taskId, taskData);
                if (result.success) {
                    onSuccess();
                    onClose();
                    Alert.alert('Success', 'Task updated successfully');
                } else {
                    throw new Error('Failed to update task');
                }
            } else {
                // Create new task
                result = await taskController.createPersonalTask(userId, taskData);
                if (result.success) {
                    onSuccess();
                    onClose();
                    Alert.alert('Success', 'Task created successfully');
                } else {
                    throw new Error('Failed to create task');
                }
            }
        } catch (error) {
            console.error('Error saving task:', error);
            Alert.alert('Error', error instanceof Error ? error.message : 'An unexpected error occurred');
        }
    };

    const renderPriorityButtons = () => {
        const priorities: Array<'High' | 'Medium' | 'Low'> = ['High', 'Medium', 'Low'];
        return (
            <View style={styles.buttonGroup}>
                {priorities.map((p) => (
                    <TouchableOpacity
                        key={p}
                        style={[styles.button, priority === p && styles.selectedButton]}
                        onPress={() => setPriority(p)}
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
                        onPress={() => setTaskType(t)}
                    >
                        <Text style={[styles.buttonText, taskType === t && styles.selectedButtonText]}>
                            {t} ({getPoints(t)} pts)
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const renderStatusButtons = () => {
        const statuses: Array<'To Do' | 'In Progress' | 'Completed' | 'On Hold'> = [
            'To Do',
            'In Progress',
            'Completed',
            'On Hold'
        ];
        return (
            <View style={styles.buttonGroup}>
                {statuses.map((s) => (
                    <TouchableOpacity
                        key={s}
                        style={[styles.button, status === s && styles.selectedButton]}
                        onPress={() => setStatus(s)}
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
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>{isEditing ? 'Edit Task' : 'Create New Task'}</Text>

                <Text style={styles.label}>Task Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter task name"
                />

                <Text style={styles.label}>Due Date</Text>
                <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text>{dueDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={dueDate}
                        mode="date"
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) setDueDate(selectedDate);
                        }}
                    />
                )}

                <View style={styles.projectSection}>
                    <Text style={styles.label}>Project Task</Text>
                    <TouchableOpacity
                        style={[styles.button, isProjectTask && styles.selectedButton]}
                        onPress={() => setIsProjectTask(!isProjectTask)}
                    >
                        <Text style={[styles.buttonText, isProjectTask && styles.selectedButtonText]}>
                            {isProjectTask ? 'Yes' : 'No'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {isProjectTask && (
                    <>
                        <Text style={styles.label}>Milestone</Text>
                        <TouchableOpacity
                            style={styles.dropdownButton}
                            onPress={() => setShowMilestoneDropdown(!showMilestoneDropdown)}
                        >
                    <Text>
                        {selectedMilestoneId 
                            ? milestones.find(m => m.id === selectedMilestoneId)?.name || 'Select Milestone'
                            : 'Select Milestone'}
                    </Text>
                    <Icon name={showMilestoneDropdown ? "chevron-up" : "chevron-down"} size={20} color="#4a4a4a" />
                </TouchableOpacity>
                
                {showMilestoneDropdown && (
                    <View style={styles.dropdownList}>
                        <TouchableOpacity
                            style={styles.dropdownItem}
                            onPress={() => {
                                setSelectedMilestoneId(null);
                                setShowMilestoneDropdown(false);
                            }}
                        >
                            <Text style={styles.dropdownItemText}>None</Text>
                        </TouchableOpacity>
                        
                        {loadingMilestones ? (
                            <Text style={styles.loadingText}>Loading milestones...</Text>
                        ) : milestones.length === 0 ? (
                            <Text style={styles.emptyText}>No milestones available</Text>
                        ) : (
                            milestones.map(milestone => (
                                <TouchableOpacity
                                    key={milestone.id}
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        setSelectedMilestoneId(milestone.id);
                                        setShowMilestoneDropdown(false);
                                    }}
                                >
                                    <Text style={styles.dropdownItemText}>{milestone.name}</Text>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                )}

                <Text style={styles.label}>Priority</Text>
                {renderPriorityButtons()}

                <Text style={styles.label}>Task Type *</Text>
                {renderTaskTypeButtons()}

                <Text style={styles.label}>Status</Text>
                {renderStatusButtons()}

                <Text style={styles.label}>Notes</Text>
                <TextInput
                    style={[styles.input, styles.notesInput]}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Add notes"
                    multiline
                />

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>{isEditing ? 'Update Task' : 'Create Task'}</Text>
                    </TouchableOpacity>
                </View>
                    </>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
    },
    container: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#1a1a1a'
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 12,
        marginBottom: 8,
        color: '#4a4a4a'
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f8f8f8'
    },
    notesInput: {
        height: 100,
        textAlignVertical: 'top'
    },
    dateButton: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#f8f8f8'
    },
    buttonGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#e0e0e0'
    },
    selectedButton: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF'
    },
    buttonText: {
        color: '#4a4a4a',
        fontSize: 14
    },
    selectedButtonText: {
        color: '#fff'
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 20
    },
    cancelButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#f0f0f0'
    },
    cancelButtonText: {
        color: '#4a4a4a',
        fontSize: 16,
        fontWeight: '600'
    },
    submitButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#007AFF'
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    projectSection: {
        marginBottom: 16
    },
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#f8f8f8'
    },
    dropdownList: {
        marginTop: 4,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        backgroundColor: '#fff'
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0'
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#4a4a4a'
    },
    loadingText: {
        padding: 12,
        textAlign: 'center',
        color: '#4a4a4a'
    },
    emptyText: {
        padding: 12,
        textAlign: 'center',
        color: '#4a4a4a',
        fontWeight: '600'
    },
});

export default TaskForm;