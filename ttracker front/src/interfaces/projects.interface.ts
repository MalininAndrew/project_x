export interface Status {
  id: number
  name: string
  projectId: number
}

export interface ProjectStateResponse {
  id: number
  name: string
  description: string
  ownerId: number
  companyId: number
  statuses: Status[]
}