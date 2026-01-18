export interface Profile {
	id: number;
	name: string;
	email: string;
	password: string;
	createDate: string;
	updateDate: string;
	roleId: number;
	companyId: number;
	img?: string;
}