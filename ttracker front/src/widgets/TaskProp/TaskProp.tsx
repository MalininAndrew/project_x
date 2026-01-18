import React, { type ReactNode } from 'react';
import styles from './TaskProp.module.css';

interface TaskPropProps {
	title: string;
	children: ReactNode;
}

export default function TaskPropUser({ title, children }: TaskPropProps) {
	return (
		<div className={styles.task_prop}>
			<div className={styles.title}>{title}</div>
			{children}
		</div>
	)
}
