export default function Home() {
  return (
    <section className="max-w-3xl mx-auto text-center py-16">
      <h1 className="text-3xl font-bold mb-4">Welcome to Development Gateway</h1>
      <p className="text-base text-black/70 mb-8">A simpler way to manage planning and building control applications.</p>
      <div className="flex items-center justify-center gap-3">
        <a href="/signIn" className="px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white transition">Sign in</a>
        <a href="/register" className="px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white transition">Create account</a>
      </div>
    </section>
  );
}
