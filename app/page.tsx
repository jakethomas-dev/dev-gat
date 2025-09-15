import Sidebar from "./components/Sidebar";
import Card from "./components/Card";

export default function Home() {
  return (
  <section className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card title="Card A" content="This is card A content." />
        <Card title="Card B" content="This is card B content." />
      </div>
    </section>
  );
}
