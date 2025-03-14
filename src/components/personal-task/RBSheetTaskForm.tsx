// src/components/personal-task/RBSheetTaskForm.tsx
import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import TaskForm from './TaskForm';
import { colors, spacing, borderRadius } from '@constants/theme';

type RBSheetTaskFormProps = {
  projectId: number;
  userId: number;
  onSubmit: () => void;
  onClose: () => void;
};

export type RBSheetTaskFormRef = {
  open: () => void;
  close: () => void;
};

export const RBSheetTaskForm = forwardRef<RBSheetTaskFormRef, RBSheetTaskFormProps>(
  ({ projectId, userId, onSubmit, onClose }, ref) => {
    const rbSheetRef = useRef<RBSheet>(null);

    useImperativeHandle(ref, () => ({
      open: () => {
        rbSheetRef.current?.open();
      },
      close: () => {
        rbSheetRef.current?.close();
      },
    }));

    useEffect(() => {
      return () => {
        // Cleanup function to ensure RBSheet is closed when component unmounts
        rbSheetRef.current?.close();
      };
    }, []);

    return (
      <RBSheet
        ref={rbSheetRef}
        closeOnDragDown={true}
        closeOnPressMask={true}
        closeOnPressBack={true}
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
        onClose={() => {
          // Ensure RBSheet ref is properly cleaned up
          rbSheetRef.current = null;
          onClose();
        }}
      >
        <View style={styles.container}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <TaskForm
              projectId={projectId}
              userId={userId}
              onClose={() => {
                rbSheetRef.current?.close();
              }}
              onSuccess={onSubmit}
            />
          </ScrollView>
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
  scrollView: {
    flex: 1,
  },
});