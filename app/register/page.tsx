import Register from "../components/Forms/Register/Register";
import NavBar from "../components/NavBar";

export default function RegisterPage() {
  return (
    <>
          <NavBar />
          <section className="max-w-md mx-auto pt-32">
            <Register />
          </section>
        </>
  );
}
