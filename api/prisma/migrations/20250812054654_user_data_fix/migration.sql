-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "token" TEXT;
