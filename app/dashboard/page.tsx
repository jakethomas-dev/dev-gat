import Card from "../components/Card";

export default function DashboardPage() {
  return (
    <section className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card title="Recent activity" content="You have 2 applications in progress." />
        <Card title="Next steps" content="Review and submit your draft application." />
      </div>
    </section>
  );
}
