-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "create_date" TIMESTAMP(3) NOT NULL,
    "update_date" TIMESTAMP(3) NOT NULL,
    "fk_company_id" INTEGER NOT NULL,
    "fk_role_id" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "create_date" TIMESTAMP(3) NOT NULL,
    "update_date" TIMESTAMP(3) NOT NULL,
    "fk_user_owner" INTEGER NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "user_owner_id" INTEGER NOT NULL,
    "fk_company_id" INTEGER NOT NULL,
    "create_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Status" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "fk_project_id" INTEGER NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Priority" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "fk_project_id" INTEGER NOT NULL,

    CONSTRAINT "Priority_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "executorId" INTEGER NOT NULL,
    "fk_project_id" INTEGER NOT NULL,
    "task_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "create_date" TIMESTAMP(3) NOT NULL,
    "update_date" TIMESTAMP(3) NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "fk_status_id" INTEGER NOT NULL,
    "fk_priority_id" INTEGER NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL,
    "time_spent" TIMESTAMP(3) NOT NULL,
    "fk_parent_task_id" INTEGER NOT NULL,
    "is_subtask" BOOLEAN NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "fk_task_id" INTEGER NOT NULL,
    "fk_user_id" INTEGER NOT NULL,
    "create_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectUserRole" (
    "id" SERIAL NOT NULL,
    "fk_user_id" INTEGER NOT NULL,
    "fk_project_id" INTEGER NOT NULL,
    "fk_role_id" INTEGER NOT NULL,

    CONSTRAINT "ProjectUserRole_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_fk_company_id_fkey" FOREIGN KEY ("fk_company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_fk_role_id_fkey" FOREIGN KEY ("fk_role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_fk_user_owner_fkey" FOREIGN KEY ("fk_user_owner") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_user_owner_id_fkey" FOREIGN KEY ("user_owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_fk_company_id_fkey" FOREIGN KEY ("fk_company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Status" ADD CONSTRAINT "Status_fk_project_id_fkey" FOREIGN KEY ("fk_project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Priority" ADD CONSTRAINT "Priority_fk_project_id_fkey" FOREIGN KEY ("fk_project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_executorId_fkey" FOREIGN KEY ("executorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_fk_project_id_fkey" FOREIGN KEY ("fk_project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_fk_status_id_fkey" FOREIGN KEY ("fk_status_id") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_fk_priority_id_fkey" FOREIGN KEY ("fk_priority_id") REFERENCES "Priority"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_fk_parent_task_id_fkey" FOREIGN KEY ("fk_parent_task_id") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_fk_task_id_fkey" FOREIGN KEY ("fk_task_id") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUserRole" ADD CONSTRAINT "ProjectUserRole_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUserRole" ADD CONSTRAINT "ProjectUserRole_fk_project_id_fkey" FOREIGN KEY ("fk_project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUserRole" ADD CONSTRAINT "ProjectUserRole_fk_role_id_fkey" FOREIGN KEY ("fk_role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
