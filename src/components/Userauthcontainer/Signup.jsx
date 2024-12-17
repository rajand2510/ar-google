
import SignUpForm from "./SignUpForm";
import Navbar from "../homecontainer/Navbar";
import Footer from "../homecontainer/Footer";

const Signup = () => {
  return (
    <>
    <Navbar />
    <main className="flex justify-center mt-[70px] px-4 mb-12">
      <section className="bg-white rounded-3xl shadow-xl w-full max-w-3xl mt-10 p-4">
        <div className="flex gap-5 flex-col md:flex-row items-stretch">
          <div className="flex flex-col w-full md:w-1/2">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/b42740852dc534f878d1be25ea623d6461eea7eea6787be3a28f894f20b19cbb?apiKey=980db322e33a4a39a5052caa449e1da6&"
              alt="Sign up illustration"
              className="w-full h-full rounded-s-2xl shadow-sm object-cover"
            />
          </div>
          <div className="flex flex-col w-full md:w-1/2 justify-center">
            <SignUpForm />
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </>
  );
};

export default Signup;