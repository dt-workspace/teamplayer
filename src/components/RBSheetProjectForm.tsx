// src/components/RBSheetProjectForm.tsx
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { ProjectForm } from './ProjectForm';
import { Project } from '@models/Project';
import { TeamMember } from '@models/TeamMember';
import { colors, spacing, borderRadius } from '@constants/theme';

type RBSheetProjectFormProps = {
  initialValues?: Project;
  onSubmit: (project: Omit<Project, 'id' | 'userId'>) => void;
  onClose: () => void;
  teamMembers: TeamMember[];
};

export type RBSheetProjectFormRef = {
  open: () => void;
  close: () => void;
};

export const RBSheetProjectForm = forwardRef<RBSheetProjectFormRef, RBSheetProjectFormProps>(
  ({ initialValues, onSubmit, onClose, teamMembers }, ref) => {
    const rbSheetRef = useRef<RBSheet>(null);

    useImperativeHandle(ref, () => ({
      open: () => {
        rbSheetRef.current?.open();
      },
      close: () => {
        rbSheetRef.current?.close();
      },
    }));

    return (
      <RBSheet
        ref={rbSheetRef}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          container: {
            backgroundColor: colors.background,
            borderTopLeftRadius: borderRadius.md,
            borderTopRightRadius: borderRadius.md,
            maxHeight: '90%',
          },
          draggableIcon: {
            backgroundColor: colors.border,
            width: 60,
          },
        }}
        height={650}
        animationType="slide"
        onClose={onClose}
      >
        <View style={styles.container}>
          <ProjectForm
            initialValues={initialValues}
            onSubmit={onSubmit}
            onCancel={() => {
              rbSheetRef.current?.close();
            }}
            teamMembers={teamMembers}
          />
        </View>
      </RBSheet>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: spacing.md,
  },
});