import styles from './Desk.module.css'
import plus from '../../../../assets/plus.png'
import dots from '../../../../assets/dots.svg'
import template from '../../../../assets/template.svg'
import { type MiniTask } from '../../../../widgets/MiniTask/MiniTask';
import CreateTask from '../../../../widgets/CreateTask/CreateTask';
import { useMemo, useState } from 'react';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableItem } from '../../../../widgets/MiniTask/SortableMiniTask/SortableMiniTask';

export interface Status {
	id: number;
	name: string;
}

export interface DeskProps {
	status: Status;
	projectId: number;
	tasks: MiniTask[];
}
	



export default function Desk({ status, projectId, tasks }: DeskProps) {
	const [ isVisCrTask, setIsVisCrTask] = useState<boolean>(false);

	const tasksIds = useMemo(() => {
		return tasks.map((task) => task.id)
	}, [tasks])

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging
	} = useSortable({
				id: status.id,
				data: {
					type: 'Desk',
					status,
					projectId,
					tasks,
				}
			});
	  
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	if (isDragging) {
		return <div ref={setNodeRef} style={style} className={styles.desk_is_dragging}></div>
	}

	return (
		<div ref={setNodeRef} style={style} className={styles.desk}>
			<div className={styles.desk_bar} {...attributes} {...listeners}>
				<div className={styles.name}>{status.name}</div>
				<div className={styles.icons}>
					<div className={styles.icon}><img src={plus} onClick={() => setIsVisCrTask(!isVisCrTask)} alt="" /></div>
					<div className={styles.icon}><img src={template} alt="" /></div>
					<div className={styles.icon}><img src={dots} alt="" /></div>
				</div>
			</div>
			{isVisCrTask && <CreateTask 
								projectId={projectId} 
								status={status} 
								setIsVisCrTask={setIsVisCrTask}
								isSubtask={false}
							/>
			}
			<div className={styles.space_for_tasks}>
				<SortableContext items={tasksIds} strategy={verticalListSortingStrategy}>
					{tasks.map(t => (
						<SortableItem 
								key={t.id} 
								task={t}
								status={status}
								projectId={projectId}
						/>))
					}
				</SortableContext>
			</div>
		</div>
	)
}
