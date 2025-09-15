import Card from "../components/Card";

export default function ApplicationsPage() {
  return (
  <section className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card title="My Applications" content="List of recent applications will appear here." />
        <Card title="Statistics" content="Some quick stats about applications." />
      </div>
    </section>
  );
}
