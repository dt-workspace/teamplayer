// src/components/RBSheetTeamMemberForm.tsx
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { TeamMemberForm } from './TeamMemberForm';
import { TeamMember } from '@models/TeamMember';
import { colors, spacing, borderRadius } from '@constants/theme';

type RBSheetTeamMemberFormProps = {
  initialValues?: TeamMember;
  onSubmit: (member: Omit<TeamMember, 'id' | 'userId'>) => void;
  onClose: () => void;
  groups: { id: string; name: string }[];
};

export type RBSheetTeamMemberFormRef = {
  open: () => void;
  close: () => void;
};

export const RBSheetTeamMemberForm = forwardRef<RBSheetTeamMemberFormRef, RBSheetTeamMemberFormProps>(
  ({ initialValues, onSubmit, onClose, groups }, ref) => {
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
        height={600}
        animationType="slide"
        onClose={onClose}
      >
        <View style={styles.container}>
          <TeamMemberForm
            initialValues={initialValues}
            onSubmit={onSubmit}
            onCancel={() => {
              rbSheetRef.current?.close();
            }}
            groups={groups}
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