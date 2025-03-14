import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TaskController } from '@controllers/TaskController';
import { NewPersonalTask } from '@models/PersonalTask';

interface TaskFormProps {
    projectId: number;
    userId: number;
    onClose: () => void;
    onSuccess: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ projectId, userId, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [dueDate, setDueDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
    const [taskType, setTaskType] = useState<'Small' | 'Medium' | 'Large'>('Small');
    const [status, setStatus] = useState<'To Do' | 'In Progress' | 'Completed' | 'On Hold'>('To Do');
    const [notes, setNotes] = useState('');

    const taskController = new TaskController();

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

            const task: Omit<NewPersonalTask, 'userId'> = {
                name,
                dueDate: dueDate.toISOString(),
                priority,
                taskType,
                status,
                points: getPoints(taskType),
                notes,
                projectId
            };

            const result = await taskController.createPersonalTask(userId, task);
            if (result.success) {
                onSuccess();
                onClose();
                Alert.alert('Success', 'Task created successfully');
            } else {
                throw new Error('Failed to create task');
            }
        } catch (error) {
            // Handle the error appropriately
            console.error('Error creating task:', error);
            // You might want to show an error message to the user here
            // or handle the error in a way that fits your application's needs
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
        <View style={styles.container}>
            <Text style={styles.title}>Create New Task</Text>

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

            <Text style={styles.label}>Priority</Text>
            {renderPriorityButtons()}

            <Text style={styles.label}>Task Type</Text>
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
                    <Text style={styles.submitButtonText}>Create Task</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        maxHeight: '80%',
        flex:1
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
        fontWeight: '600'
    }
});

export default TaskForm;