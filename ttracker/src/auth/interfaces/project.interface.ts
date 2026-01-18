interface StatusReturned {
	id: number;
	name: string;
	projectId: number;
}

export interface ProjectReturned {
	id: number;
	name: string;
	description: string | null;
	ownerId: number;
	companyId: number;
	createDate: Date;
	statuses: StatusReturned[]
}

