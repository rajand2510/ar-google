import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import Navbar from '../homecontainer/Navbar';
import Footer from '../homecontainer/Footer';

const InputField = ({ label, type = "text", value, onChange, error }) => (
  <div className="mt-4">
    <label className="block text-sm font-medium text-zinc-600 mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={`block w-full bg-white rounded-xl shadow-sm border ${error ? 'border-red-500' : 'border-gray-300'} h-10 px-3`}
      aria-label={label}
    />
    {error && <span className="text-red-500 text-xs">{error}</span>}
  </div>
);

function LogInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { handleLogin } = useAuth();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{6,}$/;
    return re.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateEmail(email)) {
      newErrors.email = "Invalid email address";
    }
    if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters long and include at least one number, one lowercase letter, one uppercase letter, and one special symbol";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      axios.post('https://room-craft-api.vercel.app/api/person/login', {
        email,
        password,
      })
        .then(response => {
          const { token } = response.data;
          handleLogin(token); // Use handleLogin from AuthContext
          navigate('/');
        })
        .catch(error => {
          console.error("Login failed:", error);
          setErrors({ email: 'Invalid username or password' });
        });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col my-auto text-base text-left text-zinc-500 px-4">
      <h2 className="self-center mb-2 text-2xl font-bold text-green-800">Welcome Back</h2>
      <h2 className="self-center text-2xl font-bold text-green-800">Log in</h2>
      <InputField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <InputField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />
      <button
        type="submit"
        className="mt-4 h-10 bg-green-800 rounded-xl text-white font-medium"
      >
        Log in
      </button>
      <div className="flex gap-2 self-start mt-4 text-sm text-green-800">
        <p className="grow">Don&apos;t have an account</p>
        <a href="/login"
         className="text-green-800 hover:text-green-600"
         onClick={(e) => {
          e.preventDefault();
          navigate('/signup');
        }}>
          Sign Up
        </a>
      </div>
    </form>
  );
}

const Login = () => {
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
              <LogInForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Login;
