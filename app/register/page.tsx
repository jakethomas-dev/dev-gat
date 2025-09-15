export default function RegisterPage() {
  return (
    <section className="max-w-md mx-auto py-16">
      <h1 className="text-2xl font-bold mb-6 text-center">Create your account</h1>
      <form className="space-y-4" action="#" method="post">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Full name</label>
          <input id="name" name="name" type="text" required className="w-full border border-black rounded-md px-3 py-2 bg-white" placeholder="Jane Doe" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input id="email" name="email" type="email" required className="w-full border border-black rounded-md px-3 py-2 bg-white" placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
          <input id="password" name="password" type="password" required className="w-full border border-black rounded-md px-3 py-2 bg-white" placeholder="••••••••" />
        </div>
        <button type="submit" className="w-full px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white transition">Create account</button>
      </form>
      <p className="text-sm mt-4 text-center">
        Already have an account? <a href="/signIn" className="underline">Sign in</a>
      </p>
    </section>
  );
}
