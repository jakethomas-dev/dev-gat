import TextBlock from "@/app/components/TextBlock";
import applicationTypes from "@/app/data/applicationTypes.json";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

interface PlansDocItem { name: string; uploaded?: boolean; required?: boolean }
interface ProgressWeights { siteBoundary: number; actionPlan: number; applicationQuestions: number; plansAndDocuments: number }
interface AppView {
  id: string;
  applicationName: string;
  siteLocation: string;
  applicationType: string;
  proposal: string;
  statusOf: string;
  createdAt: Date;
  updatedAt: Date;
  siteBoundary?: Prisma.JsonValue | null;
  actionPlan?: Prisma.JsonValue | null;
  applicationQuestions?: boolean[];
  plansAndDocuments?: Prisma.JsonValue | null;
  progressWeights?: Prisma.JsonValue | null;
}

interface Props { params: { id: string } }

function toWeights(json: Prisma.JsonValue | null): ProgressWeights {
  if (json && typeof json === 'object' && !Array.isArray(json)) {
    const j: any = json;
    return {
      siteBoundary: typeof j.siteBoundary === 'number' ? j.siteBoundary : 0.2,
      actionPlan: typeof j.actionPlan === 'number' ? j.actionPlan : 0.2,
      applicationQuestions: typeof j.applicationQuestions === 'number' ? j.applicationQuestions : 0.3,
      plansAndDocuments: typeof j.plansAndDocuments === 'number' ? j.plansAndDocuments : 0.3,
    };
  }
  return { siteBoundary: 0.2, actionPlan: 0.2, applicationQuestions: 0.3, plansAndDocuments: 0.3 };
}

function toPlans(json: Prisma.JsonValue | null): PlansDocItem[] {
  if (Array.isArray(json)) return json as any as PlansDocItem[];
  return [];
}

function computeProgress(app: AppView) {
  const weights = toWeights(app.progressWeights ?? null);
  const siteBoundaryDone = app.siteBoundary ? 1 : 0;
  const actionPlanDone = app.actionPlan ? 1 : 0;
  const questions = Array.isArray(app.applicationQuestions) ? app.applicationQuestions : [];
  const questionsDone = questions.length ? questions.filter(Boolean).length / questions.length : 0;
  const plans = toPlans(app.plansAndDocuments ?? null);
  const required = plans.filter(p => p.required !== false);
  const plansDone = required.length ? required.filter(p => p.uploaded).length / required.length : 0;
  const pct = (
    siteBoundaryDone * weights.siteBoundary +
    actionPlanDone * weights.actionPlan +
    questionsDone * weights.applicationQuestions +
    plansDone * weights.plansAndDocuments
  );
  return {
    progressPercent: Math.round(pct * 100),
    weights,
    siteBoundaryDone: !!app.siteBoundary,
    actionPlanDone: !!app.actionPlan,
    questionsAnswered: questions.filter(Boolean).length,
    questionsTotal: questions.length,
    plans,
  };
}

export default async function ViewFullApplicationPage({ params }: Props) {
  const app = await prisma.application.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      applicationName: true,
      siteLocation: true,
      applicationType: true,
      proposal: true,
      statusOf: true,
      createdAt: true,
      updatedAt: true,
    }
  }) as AppView | null;
  if (!app) {
    return <div className="max-w-5xl mx-auto"><TextBlock text="Application not found." /></div>;
  }

  const p = computeProgress(app);
  const typeMeta = applicationTypes.find(t => t.value === app.applicationType);

  return (
    <section className="max-w-5xl mx-auto flex flex-col gap-8">
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div><span className="font-medium">Name:</span> {app.applicationName}</div>
            <div><span className="font-medium">Location:</span> {app.siteLocation}</div>
            <div><span className="font-medium">Type:</span> {typeMeta?.label || app.applicationType}</div>
            <div><span className="font-medium">Status:</span> {app.statusOf}</div>
            <div><span className="font-medium">Created:</span> {new Date(app.createdAt).toLocaleString()}</div>
            <div><span className="font-medium">Updated:</span> {new Date(app.updatedAt).toLocaleString()}</div>
        </div>
        <div className="mt-4">
          <div className="flex items-center gap-2"><span className="font-medium text-sm">Overall Progress:</span><span className="text-xs font-semibold tabular-nums">{p.progressPercent}%</span></div>
          <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600" style={{ width: `${p.progressPercent}%` }} />
          </div>
        </div>
      </div>
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Proposal</h3>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{app.proposal}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <h4 className="font-semibold">Weighted Breakdown</h4>
          <ul className="text-xs flex flex-col gap-2">
            <li>Site Boundary: {(p.weights.siteBoundary || 0) * 100}% – {p.siteBoundaryDone ? 'Complete' : 'Pending'}</li>
            <li>Action Plan: {(p.weights.actionPlan || 0) * 100}% – {p.actionPlanDone ? 'Complete' : 'Pending'}</li>
            <li>Questions: {(p.weights.applicationQuestions || 0) * 100}% – {p.questionsAnswered}/{p.questionsTotal} answered</li>
            <li>Plans & Docs: {(p.weights.plansAndDocuments || 0) * 100}% – {(() => { const req = p.plans.filter(i => i.required !== false); return `${p.plans.filter(i => i.uploaded).length}/${req.length || 0} uploaded`; })()}</li>
          </ul>
        </div>
        <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <h4 className="font-semibold">Plans & Documents</h4>
          {p.plans.length > 0 ? (
            <ul className="text-xs divide-y">
              {p.plans.map((doc: any, idx: number) => (
                <li key={idx} className="py-2 flex items-center justify-between">
                  <span className="flex-1 truncate" title={doc.name}>{doc.name}</span>
                  <span className={`ml-2 text-[10px] font-semibold px-2 py-1 rounded ${doc.uploaded ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{doc.uploaded ? 'Uploaded' : 'Pending'}</span>
                  {doc.required === false && <span className="ml-2 text-[10px] text-gray-400">(optional)</span>}
                </li>
              ))}
            </ul>
          ) : <div className="text-xs text-gray-500">No documents added yet.</div>}
        </div>
      </div>
      <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col gap-4">
        <h4 className="font-semibold">Questions</h4>
        {p.questionsTotal > 0 ? (
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex items-center gap-2"><span>Answered:</span><span className="font-semibold">{p.questionsAnswered}/{p.questionsTotal}</span></div>
            <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500" style={{ width: `${Math.round((p.questionsAnswered / Math.max(p.questionsTotal,1)) * 100)}%` }} />
            </div>
          </div>
        ) : <div className="text-xs text-gray-500">No questions configured.</div>}
      </div>
    </section>
  );
}
