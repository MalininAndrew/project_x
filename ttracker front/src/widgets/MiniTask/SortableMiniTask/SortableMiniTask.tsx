import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type MiniTaskProps, MiniTask } from '../MiniTask';
import styles from '../MiniTask.module.css';

export function SortableItem({ task, projectId, status }: MiniTaskProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging
	} = useSortable({
				id: task.id,
				data: {
					type: 'Task',
					task
				}
			});
  
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	if (isDragging) {
		return <div ref={setNodeRef} style={style} className={styles.mini_task_is_isdragging}/>
	}
  
	return (
		<MiniTask
				ref={setNodeRef} 
				style={style} 
				{...attributes} 
				{...listeners}
				projectId={projectId}
				status={status}
				task={task} 
		/>
	);
}