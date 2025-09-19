import ApplicationsList from "@/app/components/Applications/ApplicationsList";
import TextBlock from "@/app/components/TextBlock";

export default function ApplicationsPage() {
  return (
    <section className="max-w-5xl mx-auto">
      <TextBlock text="Manage, view and edit your applications here. Create new applications to get started with our services." />
      <ApplicationsList />
    </section>
  );
}
