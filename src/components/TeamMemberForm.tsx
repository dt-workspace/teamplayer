// src/components/TeamMemberForm.tsx
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
} from 'react-native';
import { TeamMember, NewTeamMember } from '@models/TeamMember';
import { colors, spacing, typography, borderRadius } from '@constants/theme';

type TeamMemberFormProps = {
  initialValues?: TeamMember;
  onSubmit: (member: Omit<NewTeamMember, 'userId'>) => void;
  onCancel: () => void;
  groups: { id: string; name: string }[];
};

export const TeamMemberForm: React.FC<TeamMemberFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  groups,
}) => {
  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'Free' | 'Occupied'>('Free');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with values if editing
  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name);
      setRole(initialValues.role);
      setPhone(initialValues.phone || '');
      setEmail(initialValues.email || '');
      setStatus(initialValues.status as 'Free' | 'Occupied');
      
      if (initialValues.groupIds) {
        try {
          setSelectedGroups(JSON.parse(initialValues.groupIds));
        } catch (e) {
          setSelectedGroups([]);
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
    
    if (!role.trim()) {
      newErrors.role = 'Role is required';
    }
    
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(phone)) {
      newErrors.phone = 'Invalid phone number format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        name,
        role,
        phone: phone || undefined,
        email: email || undefined,
        status,
        groupIds: JSON.stringify(selectedGroups),
      });
    } else {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
    }
  };

  // Toggle group selection
  const toggleGroup = (groupId: string) => {
    setSelectedGroups(prev => 
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>
          {initialValues ? 'Edit Team Member' : 'Add Team Member'}
        </Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={name}
            onChangeText={setName}
            placeholder="Enter name"
            placeholderTextColor={colors.placeholder}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Role *</Text>
          <TextInput
            style={[styles.input, errors.role && styles.inputError]}
            value={role}
            onChangeText={setRole}
            placeholder="Enter role"
            placeholderTextColor={colors.placeholder}
          />
          {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={[styles.input, errors.phone && styles.inputError]}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter phone number"
            placeholderTextColor={colors.placeholder}
            keyboardType="phone-pad"
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email address"
            placeholderTextColor={colors.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusContainer}>
            <TouchableOpacity
              style={[
                styles.statusButton,
                status === 'Free' && styles.statusButtonActive,
              ]}
              onPress={() => setStatus('Free')}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  status === 'Free' && styles.statusButtonTextActive,
                ]}
              >
                Free
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.statusButton,
                status === 'Occupied' && styles.statusButtonActive,
              ]}
              onPress={() => setStatus('Occupied')}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  status === 'Occupied' && styles.statusButtonTextActive,
                ]}
              >
                Occupied
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Groups</Text>
          <View style={styles.groupsContainer}>
            {groups.map(group => (
              <TouchableOpacity
                key={group.id}
                style={[
                  styles.groupButton,
                  selectedGroups.includes(group.id) && styles.groupButtonActive,
                ]}
                onPress={() => toggleGroup(group.id)}
              >
                <Text
                  style={[
                    styles.groupButtonText,
                    selectedGroups.includes(group.id) && styles.groupButtonTextActive,
                  ]}
                >
                  {group.name}
                </Text>
              </TouchableOpacity>
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
              {initialValues ? 'Update' : 'Add'}
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
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSizes.sm,
    marginTop: spacing.xs,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusButtonText: {
    color: colors.text,
    fontWeight: typography.fontWeights.medium,
  },
  statusButtonTextActive: {
    color: colors.card,
  },
  groupsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  groupButton: {
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    margin: spacing.xs,
  },
  groupButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  groupButtonText: {
    color: colors.text,
  },
  groupButtonTextActive: {
    color: colors.card,
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