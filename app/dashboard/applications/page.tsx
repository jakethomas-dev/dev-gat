// Ensure the Card component exists at the correct path, or update the import path accordingly.
// For example, if Card is in 'app/components/Card.tsx', use:
import ApplicationsList from "@/app/components/Applications/ApplicationsList";
import Card from "../../components/Card";
import TextBlock from "@/app/components/TextBlock";

export default function ApplicationsPage() {
  return (
    <section className="max-w-5xl mx-auto">
      <TextBlock text="Manage, view and edit your applications here. Create new applications to get started with our services." />
      <ApplicationsList />
    </section>
  );
}
