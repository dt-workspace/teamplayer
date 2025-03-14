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
  const [startDate, setStartDate] = useState(new Date());
  const [deadline, setDeadline] = useState(new Date());
  const [paymentDate, setPaymentDate] = useState<Date | null>(null);
  const [paymentPercentage, setPaymentPercentage] = useState('');
  const [weeklyMeetingDay, setWeeklyMeetingDay] = useState<string | null>(null);
  
  // Date picker states
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const [showPaymentDatePicker, setShowPaymentDatePicker] = useState(false);
  
  // Status dropdown state
  const [statusOpen, setStatusOpen] = useState(false);
  const [status, setStatus] = useState('Not Started');
  const [statusItems, setStatusItems] = useState([
    { label: 'Not Started', value: 'Not Started' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Delayed', value: 'Delayed' },
  ]);
  
  // Weekly meeting day dropdown state
  const [meetingDayOpen, setMeetingDayOpen] = useState(false);
  const [meetingDayItems, setMeetingDayItems] = useState([
    { label: 'Monday', value: 'Monday' },
    { label: 'Tuesday', value: 'Tuesday' },
    { label: 'Wednesday', value: 'Wednesday' },
    { label: 'Thursday', value: 'Thursday' },
    { label: 'Friday', value: 'Friday' },
    { label: 'Saturday', value: 'Saturday' },
    { label: 'Sunday', value: 'Sunday' },
  ]);

  useEffect(() => {
    if (milestone) {
      setName(milestone.name);
      setDescription(milestone.description || '');
      setStartDate(new Date(milestone.startDate));
      setDeadline(new Date(milestone.deadline));
      setStatus(milestone.status || 'Not Started');
      
      // Set optional fields if they exist
      if (milestone.paymentDate) {
        setPaymentDate(new Date(milestone.paymentDate));
      }
      if (milestone.paymentPercentage) {
        setPaymentPercentage(milestone.paymentPercentage.toString());
      }
      if (milestone.weeklyMeetingDay) {
        setWeeklyMeetingDay(milestone.weeklyMeetingDay);
      }
    } else {
      // Default values for new milestone
      const today = new Date();
      setName('');
      setDescription('');
      setStartDate(today);
      
      // Set deadline to 2 weeks from today by default
      const twoWeeksLater = new Date(today);
      twoWeeksLater.setDate(today.getDate() + 14);
      setDeadline(twoWeeksLater);
      
      setPaymentDate(null);
      setPaymentPercentage('');
      setWeeklyMeetingDay(null);
      setStatus('Not Started');
    }
  }, [milestone]);

  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
  };

  const handleDeadlineChange = (event, selectedDate) => {
    const currentDate = selectedDate || deadline;
    setShowDeadlinePicker(false);
    setDeadline(currentDate);
  };

  const handlePaymentDateChange = (event, selectedDate) => {
    setShowPaymentDatePicker(false);
    if (selectedDate) {
      setPaymentDate(selectedDate);
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a milestone name');
      return;
    }

    if (startDate > deadline) {
      Alert.alert('Error', 'Start date cannot be after deadline');
      return;
    }

    const milestoneData: Partial<Milestone> = {
      name,
      description: description.trim() || undefined,
      startDate: startDate.toISOString(),
      deadline: deadline.toISOString(),
      status: status as 'Not Started' | 'In Progress' | 'Completed' | 'Delayed',
    };

    // Add optional fields if they have values
    if (paymentDate) {
      milestoneData.paymentDate = paymentDate.toISOString();
    }
    
    if (paymentPercentage && !isNaN(parseFloat(paymentPercentage))) {
      milestoneData.paymentPercentage = parseFloat(paymentPercentage);
    }
    
    if (weeklyMeetingDay) {
      milestoneData.weeklyMeetingDay = weeklyMeetingDay;
    }

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
        <Text style={styles.label}>Start Date *</Text>
        <TouchableOpacity 
          style={styles.datePickerButton} 
          onPress={() => setShowStartDatePicker(true)}
        >
          <Text style={styles.dateText}>{dayjs(startDate).format('MMM D, YYYY')}</Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={handleStartDateChange}
          />
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Deadline *</Text>
        <TouchableOpacity 
          style={styles.datePickerButton} 
          onPress={() => setShowDeadlinePicker(true)}
        >
          <Text style={styles.dateText}>{dayjs(deadline).format('MMM D, YYYY')}</Text>
        </TouchableOpacity>
        {showDeadlinePicker && (
          <DateTimePicker
            value={deadline}
            mode="date"
            display="default"
            onChange={handleDeadlineChange}
          />
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Payment Date</Text>
        <TouchableOpacity 
          style={styles.datePickerButton} 
          onPress={() => setShowPaymentDatePicker(true)}
        >
          <Text style={styles.dateText}>
            {paymentDate ? dayjs(paymentDate).format('MMM D, YYYY') : 'Select payment date (optional)'}
          </Text>
        </TouchableOpacity>
        {showPaymentDatePicker && (
          <DateTimePicker
            value={paymentDate || new Date()}
            mode="date"
            display="default"
            onChange={handlePaymentDateChange}
          />
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Payment Percentage</Text>
        <TextInput
          style={styles.input}
          value={paymentPercentage}
          onChangeText={setPaymentPercentage}
          placeholder="e.g., 25 (for 25%)"
          keyboardType="numeric"
        />
      </View>

      <View style={[styles.formGroup, { zIndex: 2000 }]}>
        <Text style={styles.label}>Weekly Meeting Day</Text>
        <DropDownPicker
          open={meetingDayOpen}
          value={weeklyMeetingDay}
          items={meetingDayItems}
          setOpen={setMeetingDayOpen}
          setValue={setWeeklyMeetingDay}
          setItems={setMeetingDayItems}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          placeholder="Select meeting day (optional)"
          listMode="SCROLLVIEW"
        />
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
    marginBottom: 24,
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