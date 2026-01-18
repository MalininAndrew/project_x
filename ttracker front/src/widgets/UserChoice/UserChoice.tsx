import React, { useState } from 'react';
import styles from './UserChoice.module.css';
import type { MiniTask } from '../MiniTask/MiniTask'
import UserIcon from '../../components/UserIcon/UserIcon';
import EmptyUserIcon from '../../components/EmptyUserIcon/EmptyUserIcon';
import { createPortal } from 'react-dom';
import UserProjectPicker from '../UserProjectPicker/UserProjectPicker';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

interface UserChoiceProps {
	task: MiniTask | null;
	showName: boolean;
}

export default function UserChoice({ task, showName }: UserChoiceProps) {
	const [isUserPickerVisible, setIsUserPickerVisible]= useState<boolean>(false)
	const userName = useSelector((s: RootState) => s.projects.currentProjectTeam?.find(user => user.id === task?.executorId)?.name);

	return (
		<div className={styles.executor}>
			{task?.executorId ? <UserIcon 
									elementId={`user-btn-${task.id}`} 
									id={task.executorId} 
									onClick={() => setIsUserPickerVisible(!isUserPickerVisible)}
								/> 
								: 
								<EmptyUserIcon 
									elementId={`user-btn-${task?.id}`} 
									onClick={() => setIsUserPickerVisible(!isUserPickerVisible)}
								/>
			}
			{isUserPickerVisible && 
							createPortal(
								<UserProjectPicker 
									setIsUserPickerVisible={setIsUserPickerVisible}
									executorId={task?.executorId!}
									taskId={task?.id!}
									elementId={`user-btn-${task?.id!}`}
							/>,
							document.body)
			}
			{showName && task?.executorId && <div>{userName}</div>}
		</div>
	)
}
