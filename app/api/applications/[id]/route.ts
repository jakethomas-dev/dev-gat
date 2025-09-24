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

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const userId = await getUserId(_req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const id = params.id;
  try {
    const existing = await prisma.application.findFirst({ where: { id, userId } });
    if (!existing) return NextResponse.json({ message: "Not found" }, { status: 404 });
    await prisma.application.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const id = params.id;
  const app = await prisma.application.findFirst({
    where: { id, userId },
    select: {
      id: true,
      applicationName: true,
      siteLocation: true,
      applicationType: true,
      proposal: true,
      createdAt: true,
      updatedAt: true,
      statusOf: true,
      siteBoundary: true,
      actionPlan: true,
      applicationQuestions: true,
      plansAndDocuments: true,
      progressWeights: true,
    }
  });
  if (!app) return NextResponse.json({ message: "Not found" }, { status: 404 });

  const weights = (app as any).progressWeights || { siteBoundary: 0.2, actionPlan: 0.2, applicationQuestions: 0.3, plansAndDocuments: 0.3 };
  const siteBoundaryDone = app.siteBoundary ? 1 : 0;
  const actionPlanDone = app.actionPlan ? 1 : 0;
  const questions = Array.isArray(app.applicationQuestions) ? app.applicationQuestions : [];
  const questionsDone = questions.length ? (questions.filter(Boolean).length / Math.max(questions.length, 1)) : 0;
  let plansDone = 0;
  let plansBreakdown: any[] = [];
  if (Array.isArray(app.plansAndDocuments)) {
    const items = app.plansAndDocuments as any[];
    const required = items.filter(i => i.required !== false);
    if (required.length) plansDone = required.filter(i => i.uploaded).length / required.length;
    plansBreakdown = items;
  }
  const pct = (
    siteBoundaryDone * (weights.siteBoundary || 0) +
    actionPlanDone * (weights.actionPlan || 0) +
    questionsDone * (weights.applicationQuestions || 0) +
    plansDone * (weights.plansAndDocuments || 0)
  );
  return NextResponse.json({
    ...app,
    progressPercent: Math.round(pct * 100),
    progress: {
      weights,
      siteBoundary: { complete: !!app.siteBoundary },
      actionPlan: { complete: !!app.actionPlan },
      applicationQuestions: { answered: questions.filter(Boolean).length, total: questions.length },
      plansAndDocuments: { items: plansBreakdown },
    }
  });
}
