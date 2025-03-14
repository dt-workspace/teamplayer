// src/components/MilestoneForm.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Milestone } from '../models/Milestone';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import DropDownPicker from 'react-native-dropdown-picker';
import { Alert } from 'react-native';

interface MilestoneFormProps {
  milestone: Milestone | null;
  onSave: (milestone: Partial<Milestone>) => void;
  onCancel: () => void;
}

const MilestoneForm: React.FC<MilestoneFormProps> = ({ milestone, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Status dropdown state
  const [statusOpen, setStatusOpen] = useState(false);
  const [status, setStatus] = useState('Not Started');
  const [statusItems, setStatusItems] = useState([
    { label: 'Not Started', value: 'Not Started' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Delayed', value: 'Delayed' },
  ]);

  useEffect(() => {
    if (milestone) {
      setName(milestone.name);
      setDescription(milestone.description || '');
      setDeadline(new Date(milestone.deadline));
      setStatus(milestone.status || 'Not Started');
    } else {
      // Default values for new milestone
      setName('');
      setDescription('');
      setDeadline(new Date());
      setStatus('Not Started');
    }
  }, [milestone]);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || deadline;
    setShowDatePicker(false);
    setDeadline(currentDate);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Please enter a milestone name');
      return;
    }

    const milestoneData: Partial<Milestone> = {
      name,
      description: description.trim() || undefined,
      deadline: deadline.toISOString(),
      status: status as 'Not Started' | 'In Progress' | 'Completed' | 'Delayed',
    };

    onSave(milestoneData);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{milestone ? 'Edit Milestone' : 'Add Milestone'}</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Milestone name"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Milestone description"
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Deadline *</Text>
        <TouchableOpacity 
          style={styles.datePickerButton} 
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>{dayjs(deadline).format('MMM d, yyyy')}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={deadline}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>

      <View style={[styles.formGroup, { zIndex: 1000 }]}>
        <Text style={styles.label}>Status</Text>
        <DropDownPicker
          open={statusOpen}
          value={status}
          items={statusItems}
          setOpen={setStatusOpen}
          setValue={setStatus}
          setItems={setStatusItems}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  dropdown: {
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  dropdownContainer: {
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  saveButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default MilestoneForm;