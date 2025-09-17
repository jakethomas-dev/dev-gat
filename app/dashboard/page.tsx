import Card from "../components/Card";
import TextBlock from "../components/TextBlock";
export default function DashboardPage() {
  return (
    <section className="max-w-5xl mx-auto">
        <TextBlock text="Welcome to your dashboard! Here you'll get an overview of yor stats, and access to some quick actions." />
        <TextBlock text="What would you like to do today?" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card title="Recent activity" content="You have 2 applications in progress." />
        <Card title="Next steps" content="Review and submit your draft application." />
      </div>
    </section>
  );
}
