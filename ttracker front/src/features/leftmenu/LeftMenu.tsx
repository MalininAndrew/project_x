import styles from './LeftMenu.module.css';
import arrow_down from '../../assets/keyboard_arrow_down.svg'
import plus from '../../assets/plus.svg'
import ProjectList from './project_list/ProjectList';
import { useState } from 'react';
import AddProject from './add_project/AddProject';

export default function LeftMenu() {
	const [ listIsOpen, setListIsOpen ] = useState(true)
	const [ isCreateProjectShown, setIsCreateProjectShown ] = useState<boolean>(false)


		return (
			<div className={styles.left_menu}>
				<div className={styles.project_panel}>
					<div className={styles.project_panel_name}>
						Проекты
						<img className={styles.arrow_down} src={arrow_down} alt="Стрелка вниз" />
					</div>
					<img 
						className={styles.plus} 
						src={plus} 
						alt="Добавить проект" 
						title="Добавить проект"
						onClick={() => setIsCreateProjectShown(true)} 
					/>
				</div>
				{isCreateProjectShown && <AddProject setIsCreateProjectShown={setIsCreateProjectShown}/>}
				<ProjectList />
			</div>
		)
	}
