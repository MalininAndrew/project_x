export interface CommentPr {
	id: number;
	description: string;
	taskId: number;
	userId: number;
	createDate: Date;
}

export interface CommentProps {
	comment: CommentPr
}

export interface CreateCommentDto {
	description: string;
	taskId: number;
	userId: number;
}

export interface UpdateCommentDto {
	id: number;
	description: string;
}