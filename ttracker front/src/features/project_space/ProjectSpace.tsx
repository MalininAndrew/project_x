import { useParams } from 'react-router-dom'
import DeskSpace from './desk_space/DeskSpace'
import Filters from './filters/Filters'
import Tabs from './tabs/Tabs'
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import { useEffect } from 'react';
import { getProjectTeam } from '../../store/project.slice';
import TaskWindow from '../../widgets/TaskWindow/TaskWindow';
import ProjectSettings from '../../widgets/ProjectSettings/ProjectSettings';

export default function ProjectSpace() {
	const { id } = useParams();
	const dispatch = useDispatch<AppDispatch>();
	
	useEffect(() => {
	  dispatch(getProjectTeam({projectId: Number(id)}))
	}, [])
	

	return (
		<div>
			<Tabs />
			<Filters />
			<DeskSpace projectId={Number(id)}/>
			<TaskWindow />
			<ProjectSettings />
		</div>
	)
}
