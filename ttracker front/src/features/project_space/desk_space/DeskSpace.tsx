import { useDispatch, useSelector } from 'react-redux'
import styles from './DeskSpace.module.css'
import Desk, { type DeskProps } from './desk/Desk'
import type { AppDispatch, RootState } from '../../../store/store';
import { useEffect, useMemo, useState } from 'react';
import { getTasksByProjects, tasksActions, updateTask } from '../../../store/task.slice';
import { closestCenter, DndContext, DragOverlay, MouseSensor, useSensor, useSensors, type DragEndEvent, type DragOverEvent, type DragStartEvent } from '@dnd-kit/core';
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { MiniTask } from '../../../widgets/MiniTask/MiniTask';
import { createPortal } from 'react-dom';
import { updateStatus } from '../../../store/project.slice';

interface DeskSpaceProps {
	projectId: number;
}

export default function DeskSpace({ projectId }: DeskSpaceProps) {
	const dispatch = useDispatch<AppDispatch>();

	const tasks = useSelector((s: RootState)  => s.tasks.tasks);
	const project = useSelector(((s: RootState)  => 
		s.projects.projects?.find(p => p.id === projectId))
	);

	const sortedStatuses = useMemo(() => {
		return project?.statuses ? [...project.statuses].sort((a, b) => a.sortIndex - b.sortIndex) : [];
	}, [project?.statuses]);


	const [taskOrder, setTaskOrder] = useState(tasks);
	const [statusOrder, setStatusOrder] = useState(sortedStatuses);
	const [activeTask, setActiveTask] = useState<MiniTask | null>();
	const [activeColumn, setActiveColumn] = useState<DeskProps | null>();

	useEffect(() => {
		dispatch(getTasksByProjects({id: projectId}))
	}, [projectId, dispatch])

	useEffect(() => {
			setTaskOrder(tasks);
	}, [tasks]);

	useEffect(() => {
		setStatusOrder(sortedStatuses);
	}, [sortedStatuses]);

	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				distance: 3
			},
		})
	);

	function handleDragStart(event: DragStartEvent) {
		const { active } = event;

		if (active.data.current?.type === 'Task') {
			setActiveTask(active.data.current.task)
			console.log(active.data.current.task);
		}

		if (active.data.current?.type === 'Desk') {
			setActiveColumn({
				status: active.data.current.status,
				projectId: active.data.current.projectId,
				tasks: active.data.current.tasks
			})
			console.log(active.data.current, active.id);
		}	
	}

	const handleDragOver = (event: DragOverEvent) => {

		const {active, over} = event;

		if (!over) return;

		const activeId = active.id as number;
		const overId = over.id as number;

		if(activeId === overId) return;

		const isActiveTask = active.data.current?.type === 'Task';
		const isOverTask = over.data.current?.type === 'Task';
		const isOverColumn = over.data.current?.type === 'Desk';

		if (!isActiveTask) return;

		if (isActiveTask && isOverTask) {
			dispatch(tasksActions.changeTaskStatus({ activeId, overId, type: 'Task' }));			
		}

		if (isActiveTask && isOverColumn) {
			dispatch(tasksActions.changeTaskStatus({ activeId, overId, type: 'Desk'}));
		}
	}
		

	function handleDragEnd(event: DragEndEvent) {
		setActiveColumn(null);
		setActiveTask(null);

		const {active, over} = event;

		if (!over) return;

		if(active.id === over.id) return;

		const isActiveTask = active.data.current?.type === 'Task';
		const isOverTask = over.data.current?.type === 'Task';
		const isActiveColumn = active.data.current?.type === 'Desk';
		const isOverColumn = over.data.current?.type === 'Desk';
		
		if (active.id !== over.id) {
			if (isActiveTask) {
				setTaskOrder((taskOrder) => {
					const oldIndex = taskOrder.findIndex(t => t.id === active.id);
					const newIndex = taskOrder.findIndex(t => t.id === over.id);
					
					return arrayMove(taskOrder, oldIndex, newIndex);
				});
				if (isActiveTask && isOverTask) {
					dispatch(updateTask({
						id: Number(active.id),
						statusId: over.data.current?.task.statusId
					}))
					//Дописать сохранение сортировки
				}
				if (isActiveTask && isOverColumn) {
					dispatch(updateTask({
						id: Number(active.id),
						statusId: over.data.current?.status.id
					}))
					//Дописать сохранение сортировки
				}
			}

			if (isActiveColumn) {
				setStatusOrder((statusOrder) => {
					
					const oldIndex = statusOrder.findIndex(t => t.id === active.id);
					const newIndex = statusOrder.findIndex(t => t.id === over.id);
					
					return arrayMove(statusOrder, oldIndex, newIndex);
				});
				

				dispatch(updateStatus({
					id: Number(active.id),
					sortIndex: over.data.current?.status.sortIndex
				}))
				dispatch(updateStatus({
					id: Number(over.id),
					sortIndex: active.data.current?.status.sortIndex
				}))
			}
			
		}
	}

	return (
		<DndContext 
			sensors={sensors} 
			onDragStart={handleDragStart} 
			onDragEnd={handleDragEnd} 
			onDragOver={handleDragOver}
			collisionDetection={closestCenter}
		>
			<div className={styles.desk_space}>
				<SortableContext items={statusOrder.map(s => s.id)} strategy={horizontalListSortingStrategy}>
					{statusOrder.map(d => <Desk
											key={d.id} 
											status={d}
											projectId={projectId}
											tasks={taskOrder.filter((t) => t.statusId === d.id && !t.isSubtask)}
										/>
					)}
				</SortableContext>
			</div>
			{createPortal(
				<DragOverlay>
					{activeTask && (<MiniTask 
										task={activeTask}
										status={{name: '', id: 0}}
										projectId={projectId}
									/>)
					}
					{activeColumn && (<Desk
										status={activeColumn.status}
										projectId={activeColumn.projectId}
										tasks={activeColumn.tasks}
										/>
					)}
				</DragOverlay>, document.body
			)}
		</DndContext>
			
	)
}
