import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import FormInput from "../../components/forms/FormInput";
import Spinner from "../../components/common/Spinner";
import useAuth from "../../hooks/useAuth";

import { ROLES } from "../../constants/roles";
import { ROUTES } from "../../constants/routes";

const HOME_BY_ROLE = {
  [ROLES.ADMIN]: ROUTES.ADMIN_DASHBOARD,
  [ROLES.DONOR]: ROUTES.DONOR_DASHBOARD,
  [ROLES.HOSPITAL]: ROUTES.HOSPITAL_DASHBOARD,
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (formData) => {
    setSubmitting(true);

    try {
      const authResponse = await login(formData);

      toast.success("Login successful!");

      const redirectTo =
        location.state?.from?.pathname ||
        HOME_BY_ROLE[authResponse.role] ||
        ROUTES.HOME;

      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err?.message ?? "Unable to login. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "460px" }}>
      <div className="card shadow border-0 rounded-4">
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-danger">
              Blood Donation Management System
            </h2>

            <p className="text-muted mb-0">Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              register={register}
              registerOptions={{
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email address",
                },
              }}
              error={errors.email}
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              register={register}
              registerOptions={{
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              }}
              error={errors.password}
            />

            <div className="d-flex justify-content-end mb-3">
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="text-decoration-none small"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn btn-danger w-100 d-flex justify-content-center align-items-center"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Spinner className="me-2" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <hr className="my-4" />

          <p className="text-center mb-0">
            Don't have an account?{" "}
            <Link
              to={ROUTES.REGISTER}
              className="text-decoration-none fw-semibold"
            >
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
