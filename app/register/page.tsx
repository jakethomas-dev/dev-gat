import Register from "../components/Forms/Register/Register";

export default function RegisterPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 md:px-12 pt-24 md:pt-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <div className="max-w-md mx-auto md:mx-0">
              <Register />
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-full h-full min-h-[360px] rounded-md bg-sidebar" aria-hidden="true" />
          </div>
        </div>
      </section>
    </>
  );
}
