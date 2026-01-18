-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_executorId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_fk_parent_task_id_fkey";

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "executorId" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "deadline" DROP NOT NULL,
ALTER COLUMN "completed_at" DROP NOT NULL,
ALTER COLUMN "time_spent" DROP NOT NULL,
ALTER COLUMN "fk_parent_task_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_executorId_fkey" FOREIGN KEY ("executorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_fk_parent_task_id_fkey" FOREIGN KEY ("fk_parent_task_id") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;
