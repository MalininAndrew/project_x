import styles from './ProjectList.module.css';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import ProjectItem from '../project_item/ProjectItem';




export default function ProjectList() {
	const projects = useSelector((s: RootState)  => s.projects.projects);

	return (
		<div>
			<ul className={styles.project_list}>
				{projects.map(i => (<ProjectItem key={i.id} project={i}/>))}
			</ul>
		</div>
	)
}
