import React, { useEffect, useState } from "react";
import "../css/signup.css";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const SignUp = () => {
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: localStorage.getItem("user") || "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  // Redirect if already logged in
  useEffect(() => {
    const user = localStorage.getItem("NGO");
    if (user) {
      navigate("/donate");
    }
  }, [navigate]);

  const handleInputChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setErrors({ email: true });
      return false;
    }

    if (form.password.length < 8) {
      setErrors({ password: true });
      return false;
    }

    if (form.password !== form.confirmPassword) {
      setErrors({ confirmPassword: true });
      return false;
    }

    setErrors({
      email: false,
      password: false,
      confirmPassword: false,
    });
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/registration`,
        {
          email: form.email,
          password: form.confirmPassword,
        }
      );

      console.log("Response:", response.data);

      await MySwal.fire({
        title: "Registration Successful!",
        text: `Verification mail has been sent to ${form.email}`,
        icon: "success",
      });

      localStorage.removeItem("user");
      navigate("/donate");
    } catch (error) {
      console.error(error);

      MySwal.fire({
        title: "Request Failed!",
        text: "Check your credentials and internet connection, then try again.",
        icon: "error",
      });
    }
  };

  return (
    <>
      <Navbar />

      <div className="wrapper d-flex align-items-center justify-content-center">
        <div className="signUp">
          <h2 className="title text-center pb-2 mb-3 border-bottom border-warning">
            Sign Up
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-group mb-2">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                name="email"
                id="email"
                placeholder="Enter Your Email"
                autoComplete="email"
                value={form.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <div className="alert alert-danger">
                  Please enter a valid email.
                </div>
              )}
            </div>

            {/* Password */}
            <div className="form-group mb-2">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                name="password"
                id="password"
                placeholder="Enter Password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleInputChange}
              />
              {errors.password && (
                <div className="alert alert-danger">
                  Use 8 characters or more for your password.
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group mb-2">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm Password"
                autoComplete="current-password"
                value={form.confirmPassword}
                onChange={handleInputChange}
              />
              {errors.confirmPassword && (
                <div className="alert alert-danger">
                  Those passwords didn’t match. Try again.
                </div>
              )}
            </div>

            {/* Show password */}
            <div className="form-check text-end">
              <input
                className="form-check-input"
                type="checkbox"
                id="check"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label className="form-check-label" htmlFor="check">
                Show Password
              </label>
            </div>

            {/* Terms */}
            <div className="form-check terms">
              <input
                className="form-check-input"
                type="checkbox"
                id="invalidCheck"
                required
              />
              <label className="form-check-label" htmlFor="invalidCheck">
                Agree to terms and conditions.
              </label>
            </div>

            <button type="submit" className="btn btn-success w-100 mb-2">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
