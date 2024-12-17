import  { useState } from "react";
import { useNavigate } from 'react-router-dom';
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

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  const re = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{6,}$/;
  return re.test(password);
};

const validateMobile = (mobile) => {
  const re = /^[0-9]{10}$/;
  return re.test(mobile);
};

const Popup = ({ message, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-4 rounded-xl shadow-lg">
      <p className="text-zinc-700">{message}</p>
      <button
        onClick={onClose}
        className="mt-4 bg-green-800 text-white px-4 py-2 rounded-xl"
      >
        Close
      </button>
    </div>
  </div>
);

const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
  
    if (!name) newErrors.name = "Name is required";
    if (!validateEmail(email)) newErrors.email = "Invalid email address";
    if (!validateMobile(mobile)) newErrors.mobile = "Invalid mobile number";
    if (!address) newErrors.address = "Address is required";
    if (!validatePassword(password))
      newErrors.password = "Password must be at least 6 characters long and include at least one number, one lowercase letter, one uppercase letter, and one special symbol";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      // Send form data to backend API
      const formData = {
        name,
        email,
        mobile,
        address,
        password,
      };
      fetch('https://room-craft-api.vercel.app/api/person/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Assuming data is of the format { response: { ... }, token: "..." }
        if (data.token) {
          // Handle successful signup
          setPopupMessage("Sign up successful!");
          // Optionally, you can store the token in localStorage or sessionStorage for future API requests
          localStorage.setItem('token', data.token);
        } else {
          // Handle unexpected response format
          setPopupMessage("Sign up failed: Unexpected response format");
        }
        setShowPopup(true);
      })
      .catch(error => {
        setPopupMessage("Sign up error: " + error.message);
        setShowPopup(true);
      });
      
    }
  };
  
  const closePopup = () => {
    setShowPopup(false);
    setPopupMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col my-auto text-base text-left text-zinc-500 px-4">
      <h2 className="self-center text-2xl font-bold text-green-800">Sign Up</h2>
      <InputField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
      />
      <InputField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <InputField
        label="Mobile"
        type="tel"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        error={errors.mobile}
      />
      <InputField
        label="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        error={errors.address}
      />
      <InputField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />
      <InputField
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={errors.confirmPassword}
      />
      <button
        type="submit"
        className="mt-4 h-10 bg-green-800 rounded-xl text-white font-medium"
      >
        Sign Up
      </button>
      <div className="flex gap-2 self-start mt-4 text-sm text-green-800">
        <p className="text-zinc-500">Already have an account?</p>
        <a href="/login"
         className="text-green-800 hover:text-green-600"
         onClick={(e) => {
          e.preventDefault();
          navigate('/login');
        }}>
          Log In
        </a>
      </div>
      {showPopup && <Popup message={popupMessage} onClose={closePopup} />}
    </form>
  );
};

export default SignUpForm;
