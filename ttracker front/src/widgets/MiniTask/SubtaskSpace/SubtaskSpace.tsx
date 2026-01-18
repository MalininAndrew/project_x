import styles from './SubtaskSpace.module.css';
import plus from '../../../assets/plus.svg';
import arrow_down from '../../../assets/keyboard_arrow_down.svg';
import arrow_up from '../../../assets/arrow_up.svg';
import Subtask from '../Subtask/Subtask';
import type { MiniTask } from '../MiniTask';
import CreateTask from '../../CreateTask/CreateTask';
import type { Status } from '../../../features/project_space/desk_space/desk/Desk';

interface SubtaskSpace {
	subtasks: MiniTask[]
	projectId: number;
	parentTask: MiniTask;
	status: Status;
	isSubtasksShown: boolean;
	setIsSubtasksShown: (arg: boolean) => void;
	isVisCrTask: boolean;
	setIsVisCrTask: (arg: boolean) => void;
}

export default function SubtaskSpace({ 
	subtasks, 
	projectId, 
	parentTask, 
	status, 
	isSubtasksShown, 
	setIsSubtasksShown,
	isVisCrTask,
	setIsVisCrTask
}: SubtaskSpace) {
	
	const countDone = subtasks.filter((t) => t.isDone === true)

	return (
		<div className={styles.subtask_space}>
			<div className={styles.progress}>
				<progress className={styles.progress_bar} id='subtasks' max={subtasks.length} value={countDone.length}></progress>
				<div> {countDone.length}/{subtasks.length} </div>
				<img src={!isSubtasksShown ? arrow_down : arrow_up} alt="Показать" title='Показать подзадачи' onClick={() => setIsSubtasksShown(!isSubtasksShown)} />
			</div>
			{isSubtasksShown && 
			<div className={styles.subtask_list}>
				{!isVisCrTask && 
					(<div className={styles.add_subtask} onClick={() => setIsVisCrTask(!isVisCrTask)}>
						<img src={plus} alt="" />
						<span className={styles.text}>Добавить подзадачу</span>
					</div>)
				}	
				{isVisCrTask && <CreateTask 
							projectId={projectId}
							parentTask={parentTask}
							status={status}
							isSubtask={true}
							setIsVisCrTask={setIsVisCrTask}
				/>
				}	
				{subtasks.map((t) => (<Subtask key={t.id} task={t}/>))}
			</div>
			}
		</div>
		
	)
}
