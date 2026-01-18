import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store/store';

export const selectSubtasksByParentId = createSelector(
  [
    (state: RootState) => state.tasks.tasks,
    (_: RootState, parentId: number) => parentId
  ],
  (tasks, parentId) => 
      tasks
        .filter(t => t.isSubtask === true && t.parentTaskId === parentId)
        .slice()
        .sort((a, b) => {
          const dateA = new Date(a.createDate).getTime();
          const dateB = new Date(b.createDate).getTime();
          return dateA - dateB;
        })
);