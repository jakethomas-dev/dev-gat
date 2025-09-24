import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readTokenFromRequest, verifyAuthToken } from "@/lib/auth/jwt";

async function getUserId(req: Request) {
  const token = readTokenFromRequest(req);
  if (!token) return null;
  try {
    const payload = await verifyAuthToken(token);
    return payload.sub as string;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const apps = await prisma.application.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      applicationName: true,
      siteLocation: true,
      applicationType: true,
      proposal: true,
      createdAt: true,
      statusOf: true,
      siteBoundary: true,
      actionPlan: true,
      applicationQuestions: true,
      plansAndDocuments: true,
      progressWeights: true,
    }
  });
  const withProgress = apps.map(a => {
    const weights = (a as any).progressWeights || { siteBoundary: 0.2, actionPlan: 0.2, applicationQuestions: 0.3, plansAndDocuments: 0.3 };
    const siteBoundaryDone = a.siteBoundary ? 1 : 0;
    const actionPlanDone = a.actionPlan ? 1 : 0;
    const questions = Array.isArray(a.applicationQuestions) ? a.applicationQuestions : [];
    const questionsDone = questions.length ? (questions.filter(Boolean).length / Math.max(questions.length, 1)) : 0;
    let plansDone = 0;
    if (Array.isArray(a.plansAndDocuments)) {
      const items = a.plansAndDocuments as any[];
      const required = items.filter(i => i.required !== false);
      if (required.length) plansDone = required.filter(i => i.uploaded).length / required.length;
    }
    const pct = (
      siteBoundaryDone * (weights.siteBoundary || 0) +
      actionPlanDone * (weights.actionPlan || 0) +
      questionsDone * (weights.applicationQuestions || 0) +
      plansDone * (weights.plansAndDocuments || 0)
    );
    return { ...a, progressPercent: Math.round(pct * 100) };
  });
  return NextResponse.json(withProgress);
}

export async function POST(req: Request) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { applicationName, siteLocation, applicationType, proposal } = await req.json();
  const record = await prisma.application.create({
    data: ({
      applicationName,
      siteLocation,
      applicationType,
      proposal,
      userId,
      applicationQuestions: Array(12).fill(false),
      plansAndDocuments: [
        { name: 'Site Plan', uploaded: false, required: true },
        { name: 'Location Plan', uploaded: false, required: true },
        { name: 'Design & Access Statement', uploaded: false, required: false },
      ],
      progressWeights: { siteBoundary: 0.2, actionPlan: 0.2, applicationQuestions: 0.3, plansAndDocuments: 0.3 },
    } as any),
  });
  return NextResponse.json(record);
}
