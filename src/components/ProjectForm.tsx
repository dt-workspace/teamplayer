// src/components/ProjectForm.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Switch,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Project, NewProject } from '@models/Project';
import { TeamMember } from '@models/TeamMember';
import { colors, spacing, typography, borderRadius } from '@constants/theme';

type ProjectFormProps = {
  initialValues?: Project;
  onSubmit: (project: Omit<NewProject, 'id' | 'userId'>) => void;
  onCancel: () => void;
  teamMembers: TeamMember[];
};

export const ProjectForm: React.FC<ProjectFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  teamMembers,
}) => {
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [deadline, setDeadline] = useState(new Date());
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [selectedMembers, setSelectedMembers] = useState<{id: number, role: string}[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'Active' | 'Completed'>('Active');
  
  // Date picker state
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with values if editing
  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name);
      setDescription(initialValues.description);
      setStartDate(new Date(initialValues.startDate));
      setDeadline(new Date(initialValues.deadline));
      setPriority(initialValues.priority as 'High' | 'Medium' | 'Low');
      
      // Parse assigned members if available
      if (initialValues.assignedMembers) {
        try {
          setSelectedMembers(JSON.parse(initialValues.assignedMembers));
        } catch (e) {
          setSelectedMembers([]);
        }
      }
      
      // For demo purposes, assuming these fields might be added later
      setProgress(initialValues.progress || 0);
      setStatus(initialValues.status || 'Active');
      
      // Parse tags if available
      if (initialValues.tags) {
        try {
          setTags(JSON.parse(initialValues.tags));
        } catch (e) {
          setTags([]);
        }
      }
    }
  }, [initialValues]);

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }
    
    if (startDate > deadline) {
      newErrors.deadline = 'Deadline must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        name,
        description,
        startDate: startDate.toISOString(),
        deadline: deadline.toISOString(),
        priority,
        assignedMembers: JSON.stringify(selectedMembers),
        tags: JSON.stringify(tags),
        progress,
        status,
      });
    } else {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
    }
  };

  // Handle date changes
  const onStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const onDeadlineChange = (event: any, selectedDate?: Date) => {
    setShowDeadlinePicker(false);
    if (selectedDate) {
      setDeadline(selectedDate);
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  // Handle tag addition
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  // Handle tag removal
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Toggle team member selection
  const toggleMember = (member: TeamMember, role: string) => {
    setSelectedMembers(prev => {
      const isSelected = prev.some(m => m.id === member.id);
      
      if (isSelected) {
        return prev.filter(m => m.id !== member.id);
      } else {
        return [...prev, { id: member.id, role }];
      }
    });
  };

  // Check if a member is selected
  const isMemberSelected = (memberId: number) => {
    return selectedMembers.some(m => m.id === memberId);
  };

  // Get the role of a selected member
  const getMemberRole = (memberId: number) => {
    const member = selectedMembers.find(m => m.id === memberId);
    return member ? member.role : '';
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>
          {initialValues ? 'Edit Project' : 'Create Project'}
        </Text>
        
        {/* Project Name */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Project Name *</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={name}
            onChangeText={setName}
            placeholder="Enter project name"
            placeholderTextColor={colors.placeholder}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>
        
        {/* Description */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.textArea, errors.description && styles.inputError]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter project description (max 500 characters)"
            placeholderTextColor={colors.placeholder}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
          <Text style={styles.charCount}>{description.length}/500</Text>
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>
        
        {/* Start Date */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Start Date *</Text>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>{formatDate(startDate)}</Text>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={onStartDateChange}
            />
          )}
        </View>
        
        {/* Deadline */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Deadline *</Text>
          <TouchableOpacity 
            style={[styles.dateButton, errors.deadline && styles.inputError]}
            onPress={() => setShowDeadlinePicker(true)}
          >
            <Text style={styles.dateButtonText}>{formatDate(deadline)}</Text>
          </TouchableOpacity>
          {showDeadlinePicker && (
            <DateTimePicker
              value={deadline}
              mode="date"
              display="default"
              onChange={onDeadlineChange}
            />
          )}
          {errors.deadline && <Text style={styles.errorText}>{errors.deadline}</Text>}
        </View>
        
        {/* Priority */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Priority *</Text>
          <View style={styles.priorityContainer}>
            <TouchableOpacity
              style={[
                styles.priorityButton,
                priority === 'Low' && styles.priorityButtonActive,
                priority === 'Low' && { backgroundColor: colors.info },
              ]}
              onPress={() => setPriority('Low')}
            >
              <Text
                style={[
                  styles.priorityButtonText,
                  priority === 'Low' && styles.priorityButtonTextActive,
                ]}
              >
                Low
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.priorityButton,
                priority === 'Medium' && styles.priorityButtonActive,
                priority === 'Medium' && { backgroundColor: colors.warning },
              ]}
              onPress={() => setPriority('Medium')}
            >
              <Text
                style={[
                  styles.priorityButtonText,
                  priority === 'Medium' && styles.priorityButtonTextActive,
                ]}
              >
                Medium
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.priorityButton,
                priority === 'High' && styles.priorityButtonActive,
                priority === 'High' && { backgroundColor: colors.error },
              ]}
              onPress={() => setPriority('High')}
            >
              <Text
                style={[
                  styles.priorityButtonText,
                  priority === 'High' && styles.priorityButtonTextActive,
                ]}
              >
                High
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Status (for editing) */}
        {initialValues && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>Active</Text>
              <Switch
                value={status === 'Completed'}
                onValueChange={(value) => setStatus(value ? 'Completed' : 'Active')}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.card}
              />
              <Text style={styles.statusLabel}>Completed</Text>
            </View>
          </View>
        )}
        
        {/* Progress (for editing) */}
        {initialValues && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Progress: {progress}%</Text>
            <View style={styles.progressContainer}>
              <TextInput
                style={styles.progressInput}
                value={progress.toString()}
                onChangeText={(value) => {
                  const num = parseInt(value);
                  if (!isNaN(num) && num >= 0 && num <= 100) {
                    setProgress(num);
                  }
                }}
                keyboardType="numeric"
                maxLength={3}
              />
              <Text style={styles.progressSymbol}>%</Text>
            </View>
          </View>
        )}
        
        {/* Tags */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Tags (Optional)</Text>
          <View style={styles.tagInputContainer}>
            <TextInput
              style={styles.tagInput}
              value={newTag}
              onChangeText={setNewTag}
              placeholder="Add a tag (e.g., Urgent, Client)"
              placeholderTextColor={colors.placeholder}
              onSubmitEditing={addTag}
            />
            <TouchableOpacity style={styles.addTagButton} onPress={addTag}>
              <Text style={styles.addTagButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
                <TouchableOpacity onPress={() => removeTag(tag)}>
                  <Text style={styles.removeTagText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
        
        {/* Team Members */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Assign Team Members</Text>
          <View style={styles.teamMembersContainer}>
            {teamMembers.map((member) => (
              <View key={member.id} style={styles.memberRow}>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRole}>{member.role}</Text>
                </View>
                
                <View style={styles.memberAssignContainer}>
                  {isMemberSelected(member.id) ? (
                    <View style={styles.memberRoleInputContainer}>
                      <TextInput
                        style={styles.memberRoleInput}
                        value={getMemberRole(member.id)}
                        onChangeText={(role) => {
                          setSelectedMembers(prev => 
                            prev.map(m => 
                              m.id === member.id ? { ...m, role } : m
                            )
                          );
                        }}
                        placeholder="Role in project"
                        placeholderTextColor={colors.placeholder}
                      />
                      <TouchableOpacity 
                        style={styles.removeMemberButton}
                        onPress={() => toggleMember(member, '')}
                      >
                        <Text style={styles.removeMemberButtonText}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity 
                      style={styles.assignButton}
                      onPress={() => toggleMember(member, 'Member')}
                    >
                      <Text style={styles.assignButtonText}>Assign</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>
              {initialValues ? 'Update' : 'Create'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
  },
  title: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    fontSize: typography.fontSizes.md,
    color: colors.text,
  },
  textArea: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    fontSize: typography.fontSizes.md,
    color: colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSizes.sm,
    marginTop: spacing.xs,
  },
  dateButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    alignItems: 'flex-start',
  },
  dateButtonText: {
    fontSize: typography.fontSizes.md,
    color: colors.text,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
  },
  priorityButtonActive: {
    borderColor: 'transparent',
  },
  priorityButtonText: {
    color: colors.text,
    fontWeight: typography.fontWeights.medium,
  },
  priorityButtonTextActive: {
    color: colors.card,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusLabel: {
    marginHorizontal: spacing.md,
    fontSize: typography.fontSizes.md,
    color: colors.text,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressInput: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    fontSize: typography.fontSizes.md,
    color: colors.text,
    width: 80,
    textAlign: 'center',
  },
  progressSymbol: {
    fontSize: typography.fontSizes.md,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    fontSize: typography.fontSizes.md,
    color: colors.text,
  },
  addTagButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
  addTagButtonText: {
    color: colors.card,
    fontWeight: typography.fontWeights.medium,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    margin: spacing.xs,
  },
  tagText: {
    color: colors.card,
    marginRight: spacing.xs,
  },
  removeTagText: {
    color: colors.card,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
  },
  teamMembersContainer: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
  },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
  },
  memberRole: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  memberAssignContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberRoleInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberRoleInput: {
    width: 120,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    fontSize: typography.fontSizes.sm,
    marginRight: spacing.xs,
  },
  removeMemberButton: {
    padding: spacing.xs,
  },
  removeMemberButtonText: {
    color: colors.error,
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
  },
  assignButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
  },
  assignButtonText: {
    color: colors.card,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  button: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  cancelButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  submitButton: {
    backgroundColor: colors.primary,
  },
  cancelButtonText: {
    color: colors.text,
    fontWeight: typography.fontWeights.medium,
  },
  submitButtonText: {
    color: colors.card,
    fontWeight: typography.fontWeights.medium,
  },
});