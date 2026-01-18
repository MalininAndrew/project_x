import styles from './DatePicker.module.css';
import calendar from '../../assets/calendar.svg';
import { useRef, useState } from 'react';
import { DayPicker } from "react-day-picker";
import { ru } from "react-day-picker/locale"
import { format } from 'date-fns';
import { ru as Ru} from 'date-fns/locale';
import { useClickOutside } from '../../helpers/hooks/useClickOutside';

interface DatePickerCreateTaskProps {
	date: Date | null;
	setDate: (date: Date | null) => void;
}

export default function DatePickerCreateTask({ date, setDate }: DatePickerCreateTaskProps) {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const calendarRef = useRef<HTMLDivElement>(null);

	const handleSelectDate = async (date: Date | undefined) => {
		if (date) {
			setDate(date)
			setIsOpen(false);
		}
	};

	const handlDeleteDate = () => {
		setDate(null)
		setIsOpen(false);
	};

	const dateFormat = (date: Date) => {
		if (date) {
			const date2 = format(date, "d MMM", { locale: Ru });
			return date2.slice(0, -1);
		}
	}

	useClickOutside(calendarRef, () => setIsOpen(false));

	return (
		<div className={styles.wrapper}>
			<div className={styles.iconContainer} onClick={() => setIsOpen(!isOpen)}>
				{!date && <img src={calendar} alt="" />}
				{date && <span className={styles.date}>{dateFormat(date)}</span>}
			</div>

			{isOpen && (
				<div className={styles.popup} ref={calendarRef}>
					{date && <div className={styles.delete_date} onClick={() => handlDeleteDate()}>Убрать дату</div>}
					<DayPicker
						locale={ru}
						mode="single"
						selected={date ?? undefined}
						onSelect={handleSelectDate}
					/>
				</div>
			)}
		</div>
	);
}
