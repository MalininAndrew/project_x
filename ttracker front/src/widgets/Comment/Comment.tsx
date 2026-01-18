import UserIcon from '../../components/UserIcon/UserIcon';
import type { CommentProps } from '../../interfaces/comment.interface';
import styles from './Comment.module.css';
import deleteIcon from '../../assets/delete.png';
import edit from '../../assets/edit.svg';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
import { format } from 'date-fns';
import { ru as Ru} from 'date-fns/locale';
import { deleteComment, updateComment } from '../../store/comments.slice';
import { useEffect, useRef, useState } from 'react';



export default function CommentComponent({ comment }: CommentProps ) {
	const dispatch = useDispatch<AppDispatch>();

	const userComment = useSelector((s: RootState) => s.projects.currentProjectTeam?.find(t => t.id === comment.userId));
	const currentUser = useSelector((s: RootState) => s.user.profile);

	const editComment = useRef<HTMLTextAreaElement>(null)
	const [editMode, setEditMode] = useState<boolean>(false);
	const [description, setDescription] = useState<string>(comment.description);

	const dateFormat = (date: Date) => {
		if (date) {
			const date2 = format(date, "d MMMM yyyy, HH:mm:ss", { locale: Ru });
			return date2
		}
	}

	const deleteCommentHandle = () => {
		dispatch(deleteComment({ id: comment.id}))
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === 'Enter' && event.ctrlKey || event.key === 'Enter' && event.metaKey) {
			event.preventDefault();
			if (description.trim() === '' || description.trim() === comment.description) {
					setEditMode(false);
					setDescription(comment.description);
				} else {
					dispatch(updateComment({id: comment.id, description}));
					setEditMode(false);
				}
		} else if (event.key === 'Escape') {
			setEditMode(false);
			setDescription(comment.description);
		}
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (editComment.current && !editComment.current.contains(event.target as Node)) {
				if (description.trim() === '' || description.trim() === comment.description) {
					setEditMode(false);
					setDescription(comment.description);
				} else {
					dispatch(updateComment({id: comment.id, description}));
					setEditMode(false);
				}
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
		document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div className={styles.comment}>
			<div className={styles.header}>
				<div className={styles.author_info}>
					<UserIcon id={comment.userId}/>
					<div className={styles.name}>{userComment?.name}</div>
					<div className={styles.date}>{dateFormat(comment.createDate)}</div>
				</div>
				{comment.userId === currentUser?.id && (<div className={styles.control_btn}>
					<img onClick={() => setEditMode(!editMode)} className={styles.menu_icon} src={edit} alt="" />
					<img onClick={deleteCommentHandle} className={styles.menu_icon} src={deleteIcon} alt="" />
				</div>)}
			</div>
			<div className={styles.description}>
				<div className={styles.line}></div>
				{!editMode ? <div className={styles.message}>{comment.description}</div> :
				<textarea ref={editComment}
						value={description} 
						className={styles.input}  
						onChange={(e) => setDescription(e.target.value)}
						onKeyDown={handleKeyDown}
						autoFocus
				/>}
			</div>
		</div>
	)
}
