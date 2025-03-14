// src/components/MilestoneSection.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { MilestoneController } from '../controllers';
import { TaskController } from '../controllers/TaskController';
import { Milestone } from '../models/Milestone';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import dayjs from 'dayjs';
import RBSheet from 'react-native-raw-bottom-sheet';
import MilestoneForm from './MilestoneForm';
import { colors } from '../constants/theme';

interface MilestoneSectionProps {
  projectId: number;
  userId: number;
}

interface MilestoneWithTasks extends Milestone {
  taskCount: number;
  prr: number;
  rprr: number;
}

const MilestoneSection: React.FC<MilestoneSectionProps> = ({ projectId, userId }) => {
  const [milestones, setMilestones] = useState<MilestoneWithTasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [expandedMilestones, setExpandedMilestones] = useState<Record<number, boolean>>({});
  const milestoneSheetRef = React.useRef<any>(null);
  const taskController = new TaskController();

  useEffect(() => {
    loadMilestones();
  }, [projectId]);

  const loadMilestones = async () => {
    try {
      setLoading(true);
      const projectMilestones = await MilestoneController.getMilestonesByProject(projectId);
      
      // Fetch task counts for each milestone
      const milestonesWithTasks = await Promise.all(
        projectMilestones.map(async (milestone) => {
          const tasksResponse = await taskController.getTasksByMilestone(milestone.id);
          const tasks = tasksResponse.success ? tasksResponse.data || [] : [];
          
          // Calculate PRR and RPRR
          const { prr, rprr } = calculateRunRates(milestone, tasks);
          
          return {
            ...milestone,
            taskCount: tasks.length,
            prr,
            rprr
          };
        })
      );
      
      setMilestones(milestonesWithTasks);
    } catch (error) {
      console.error('Error loading milestones:', error);
      Alert.alert('Error', 'Failed to load milestones');
    } finally {
      setLoading(false);
    }
  };

  const calculateRunRates = (milestone: Milestone, tasks: any[]) => {
    const startDate = new Date(milestone.startDate);
    const deadlineDate = new Date(milestone.deadline);
    const currentDate = new Date();
    
    // Calculate days
    const totalDays = Math.max(1, Math.ceil((deadlineDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const daysElapsed = Math.max(1, Math.ceil((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const daysRemaining = Math.max(1, Math.ceil((deadlineDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Count completed tasks
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;
    const totalTasks = tasks.length;
    
    // Calculate progress percentage
    const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // Calculate PRR (current pace)
    const prr = daysElapsed > 0 ? completedTasks / daysElapsed : 0;
    
    // Calculate RPRR (required pace to complete on time)
    const remainingTasks = totalTasks - completedTasks;
    const rprr = daysRemaining > 0 ? remainingTasks / daysRemaining : 0;
    
    return { prr, rprr, progressPercentage };
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

  const getStatusColor = (status: string | null) => {
    if (!status) return '#9E9E9E';
    
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

  const toggleMilestoneExpansion = (milestoneId: number) => {
    setExpandedMilestones(prev => ({
      ...prev,
      [milestoneId]: !prev[milestoneId]
    }));
  };

  const renderMilestoneItem = ({ item }: { item: MilestoneWithTasks }) => {
    const isExpanded = expandedMilestones[item.id] || false;
    
    return (
      <View style={styles.milestoneItem}>
        <TouchableOpacity 
          style={styles.milestoneHeader}
          onPress={() => toggleMilestoneExpansion(item.id)}
        >
          <View style={styles.milestoneNameContainer}>
            <View
              style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]}
            />
            <Text style={styles.milestoneName}>{item.name}</Text>
          </View>
          
          <View style={styles.headerRightSection}>
            <View style={styles.taskCountBadge}>
              <Text style={styles.taskCountText}>{item.taskCount}</Text>
            </View>
            
            <Icon 
              name={isExpanded ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#666"
              style={styles.expandIcon}
            />
          </View>
        </TouchableOpacity>
        
        
        
        {/* Expanded section */}
        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.milestoneBasicInfo}>
          <View style={styles.dateInfo}>
            <Text style={styles.milestoneDate}>
              <Text style={styles.dateLabel}>Start: </Text>
              {dayjs(new Date(item.startDate)).format('MMM D, YYYY')}
            </Text>
            <Text style={styles.milestoneDate}>
              <Text style={styles.dateLabel}>Deadline: </Text>
              {dayjs(new Date(item.deadline)).format('MMM D, YYYY')}
            </Text>
          </View>
          
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Status:</Text>
            <Text
              style={[styles.statusValue, { color: getStatusColor(item.status) }]}
            >
              {item.status}
            </Text>
          </View>
        </View>
            {item.description && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionLabel}>Description:</Text>
                <Text style={styles.milestoneDescription}>
                  {item.description}
                </Text>
              </View>
            )}
            
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Icon name="calendar-range" size={16} color={colors.primary} />
                <Text style={styles.detailLabel}>Duration:</Text>
                <Text style={styles.detailValue}>
                  {Math.ceil((new Date(item.deadline).getTime() - new Date(item.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                </Text>
              </View>
              
              {item.weeklyMeetingDay && (
                <View style={styles.detailItem}>
                  <Icon name="calendar-clock" size={16} color={colors.primary} />
                  <Text style={styles.detailLabel}>Meeting Day:</Text>
                  <Text style={styles.detailValue}>{item.weeklyMeetingDay}</Text>
                </View>
              )}
              
              {item.paymentDate && (
                <View style={styles.detailItem}>
                  <Icon name="cash" size={16} color={colors.success} />
                  <Text style={styles.detailLabel}>Payment Date:</Text>
                  <Text style={styles.detailValue}>
                    {dayjs(new Date(item.paymentDate)).format('MMM D, YYYY')}
                  </Text>
                </View>
              )}
              
              {item.paymentPercentage && (
                <View style={styles.detailItem}>
                  <Icon name="percent" size={16} color={colors.success} />
                  <Text style={styles.detailLabel}>Payment:</Text>
                  <Text style={styles.detailValue}>{item.paymentPercentage}%</Text>
                </View>
              )}
            </View>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Icon name="checkbox-marked-circle-outline" size={16} color={colors.success} />
                <Text style={styles.statText}>Tasks: {item.taskCount}</Text>
              </View>
              
              <View style={styles.statItem}>
                <Icon name="speedometer" size={16} color={colors.primary} />
                <Text style={styles.statText}>PRR: {item.prr.toFixed(2)}</Text>
              </View>
              
              <View style={styles.statItem}>
                <Icon name="target" size={16} color={colors.secondary} />
                <Text style={styles.statText}>RPRR: {item.rprr.toFixed(2)}</Text>
              </View>
            </View>
            
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEditMilestone(item)}
              >
                <Icon name="pencil" size={18} color="#2196F3" />
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDeleteMilestone(item)}
              >
                <Icon name="delete" size={18} color="#F44336" />
                <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
        height={550}
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
    marginTop: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#2196F3',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  milestoneItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  milestoneNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskCountBadge: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  taskCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
  },
  expandIcon: {
    marginLeft: 4,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  milestoneName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  milestoneBasicInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateInfo: {
    flexDirection: 'column',
  },
  milestoneDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dateLabel: {
    fontWeight: '600',
    color: '#555',
  },
  expandedContent: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  descriptionContainer: {
    marginBottom: 12,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  milestoneDeadline: {
    fontSize: 14,
    color: '#666',
  },
  milestoneDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  detailsGrid: {

    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 8,
    paddingRight: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#555',
    marginLeft: 4,
    marginRight: 4,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '400',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  statText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 4,
    fontWeight: '500',
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
    fontWeight: '600',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2196F3',
    marginLeft: 4,
  },
  deleteButtonText: {
    color: '#F44336',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    margin: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});

export default MilestoneSection;