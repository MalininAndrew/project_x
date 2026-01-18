import styles from './EmptyUserIcon.module.css';
import icon from '../../assets/emptyUserIcon.svg';

interface EmptyUserIconProps {
	onClick: () => void;
	elementId: string
}

export default function EmptyUserIcon({onClick, elementId}: EmptyUserIconProps) {
	return (
		<div id={elementId} className={styles.user_icon} onClick={onClick}>
			<img className={styles.icon} src={icon} alt="" title='Назначить исполнителя'/>
		</div>
	)
}
