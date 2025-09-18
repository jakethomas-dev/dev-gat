// Ensure the Card component exists at the correct path, or update the import path accordingly.
// For example, if Card is in 'app/components/Card.tsx', use:
import ApplicationsList from "@/app/components/Applications/ApplicationsList";
import Card from "../../components/Card";

export default function ApplicationsPage() {
  return (
    <section className="max-w-5xl mx-auto">
      <ApplicationsList />
    </section>
  );
}
