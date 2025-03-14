// src/components/MilestoneSection.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { MilestoneController } from '../controllers';
import { Milestone } from '../models/Milestone';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import dayjs from 'dayjs';
import RBSheet from 'react-native-raw-bottom-sheet';
import MilestoneForm from './MilestoneForm';

interface MilestoneSectionProps {
  projectId: number;
  userId: number;
}

const MilestoneSection: React.FC<MilestoneSectionProps> = ({ projectId, userId }) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const milestoneSheetRef = React.useRef<RBSheet>(null);

  useEffect(() => {
    loadMilestones();
  }, [projectId]);

  const loadMilestones = async () => {
    try {
      setLoading(true);
      const projectMilestones = await MilestoneController.getMilestonesByProject(projectId);
      setMilestones(projectMilestones);
    } catch (error) {
      console.error('Error loading milestones:', error);
      Alert.alert('Error', 'Failed to load milestones');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMilestone = () => {
    setSelectedMilestone(null);
    milestoneSheetRef.current?.open();
  };

  const handleEditMilestone = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    milestoneSheetRef.current?.open();
  };

  const handleDeleteMilestone = (milestone: Milestone) => {
    Alert.alert(
      'Delete Milestone',
      `Are you sure you want to delete "${milestone.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await MilestoneController.deleteMilestone(milestone.id);
              loadMilestones();
            } catch (error) {
              console.error('Error deleting milestone:', error);
              Alert.alert('Error', 'Failed to delete milestone');
            }
          },
        },
      ]
    );
  };

  const handleSaveMilestone = async (milestoneData: Partial<Milestone>) => {
    try {
      if (selectedMilestone) {
        // Update existing milestone
        await MilestoneController.updateMilestone(selectedMilestone.id, milestoneData);
      } else {
        // Create new milestone
        await MilestoneController.createMilestone(
          userId,
          projectId,
          milestoneData as Omit<Milestone, 'userId' | 'projectId' | 'id'>
        );
      }
      milestoneSheetRef.current?.close();
      loadMilestones();
    } catch (error) {
      console.error('Error saving milestone:', error);
      Alert.alert('Error', 'Failed to save milestone');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return '#4CAF50';
      case 'In Progress':
        return '#2196F3';
      case 'Delayed':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const renderMilestoneItem = ({ item }: { item: Milestone }) => {
    return (
      <View style={styles.milestoneItem}>
        <View style={styles.milestoneHeader}>
          <View style={styles.milestoneNameContainer}>
            <View
              style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]}
            />
            <Text style={styles.milestoneName}>{item.name}</Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEditMilestone(item)}
            >
              <Icon name="pencil" size={18} color="#2196F3" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteMilestone(item)}
            >
              <Icon name="delete" size={18} color="#F44336" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.milestoneDetails}>
          <Text style={styles.milestoneDeadline}>
            Deadline: {dayjs(new Date(item.deadline)).format('MMM d, yyyy')}
          </Text>
          {item.description && (
            <Text style={styles.milestoneDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Status:</Text>
            <Text
              style={[styles.statusValue, { color: getStatusColor(item.status) }]}
            >
              {item.status}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Milestones</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddMilestone}>
          <Icon name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {milestones.length > 0 ? (
        <FlatList
          data={milestones}
          renderItem={renderMilestoneItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {loading ? 'Loading milestones...' : 'No milestones found'}
          </Text>
          {!loading && (
            <Text style={styles.emptySubText}>
              Add milestones to track project progress
            </Text>
          )}
        </View>
      )}

      <RBSheet
        ref={milestoneSheetRef}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={450}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          container: {
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          },
          draggableIcon: {
            backgroundColor: '#9e9e9e',
          },
        }}
      >
        <MilestoneForm
          milestone={selectedMilestone}
          onSave={handleSaveMilestone}
          onCancel={() => milestoneSheetRef.current?.close()}
        />
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBlock: 16,
    marginTop:8,
    backgroundColor:'#fff',
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#2196F3',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  milestoneItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  milestoneNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  milestoneName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  milestoneDetails: {
    marginTop: 4,
  },
  milestoneDeadline: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  milestoneDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'semibold',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default MilestoneSection;