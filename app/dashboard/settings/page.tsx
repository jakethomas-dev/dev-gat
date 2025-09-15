import Card from "../../components/Card";

export default function SettingsPage() {
  return (
  <section className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card title="Profile" content="Update your profile and preferences." />
        <Card title="Security" content="Manage security settings." />
      </div>
    </section>
  );
}
