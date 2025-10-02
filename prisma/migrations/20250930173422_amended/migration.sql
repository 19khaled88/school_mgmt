/*
  Warnings:

  - The values [RFIDAY] on the enum `Day` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `_ClassToTeacher` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Day_new" AS ENUM ('SATARDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY');
ALTER TABLE "public"."Lesson" ALTER COLUMN "day" TYPE "public"."Day_new" USING ("day"::text::"public"."Day_new");
ALTER TYPE "public"."Day" RENAME TO "Day_old";
ALTER TYPE "public"."Day_new" RENAME TO "Day";
DROP TYPE "public"."Day_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."_ClassToTeacher" DROP CONSTRAINT "_ClassToTeacher_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ClassToTeacher" DROP CONSTRAINT "_ClassToTeacher_B_fkey";

-- AlterTable
ALTER TABLE "public"."Class" ADD COLUMN     "teacherId" TEXT,
ALTER COLUMN "supervisorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Student" ALTER COLUMN "img" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Teacher" ALTER COLUMN "img" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."_ClassToTeacher";

-- AddForeignKey
ALTER TABLE "public"."Class" ADD CONSTRAINT "Class_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "public"."Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
