import React, { useState, type ReactNode } from 'react'
import styles from './DropDownContainer.module.css';
import down from '../../../assets/keyboard_arrow_down.svg';
import up_arrow from '../../../assets/arrow_up.svg';

interface DropDownContainerProps {
	name: string;
	children: ReactNode;
}

export default function DropDownContainer({name, children}: DropDownContainerProps) {
	const [isVisible, setIsVisible ] = useState<boolean>(true)

	return (
		<div className={styles.container}>
			<div className={styles.discription} >
				<div className={styles.name} onClick={() => setIsVisible(!isVisible)}>{name}</div>
				<img className={styles.arrown_down} onClick={() => setIsVisible(!isVisible)} src={isVisible ? up_arrow : down} alt="" />
			</div>
			{isVisible && children}
		</div>
	)
}
