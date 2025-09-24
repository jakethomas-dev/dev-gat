-- AlterTable
ALTER TABLE "public"."Application" ADD COLUMN     "actionPlan" JSONB,
ADD COLUMN     "applicationQuestions" BOOLEAN[] DEFAULT ARRAY[]::BOOLEAN[],
ADD COLUMN     "plansAndDocuments" JSONB,
ADD COLUMN     "progressWeights" JSONB,
ADD COLUMN     "siteBoundary" JSONB;
