import CreateApplicationWizard from "@/app/components/Applications/CreateApplicationWizard";
import TextBlock from "@/app/components/TextBlock";

export default function CreateApplicationPage() {
  return (
    <section className="max-w-5xl mx-auto">
      <TextBlock text="Start a new planning application by providing some basic information." />
      <div className="mt-8">
        <CreateApplicationWizard />
      </div>
    </section>
  );
}
