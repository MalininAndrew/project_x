/*
  Warnings:

  - A unique constraint covering the columns `[fk_user_id,fk_project_id]` on the table `ProjectUserRole` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProjectUserRole_fk_user_id_fk_project_id_key" ON "ProjectUserRole"("fk_user_id", "fk_project_id");
