import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import FormInput from "../../components/forms/FormInput";
import FormSelect from "../../components/forms/FormSelect";
import FormTextarea from "../../components/forms/FormTextarea";
import Spinner from "../../components/common/Spinner";
import useAuth from "../../hooks/useAuth";

import { ROLES } from "../../constants/roles";
import { BLOOD_GROUPS } from "../../constants/enums";
import { ROUTES } from "../../constants/routes";

const HOME_BY_ROLE = {
  [ROLES.ADMIN]: ROUTES.ADMIN_DASHBOARD,
  [ROLES.DONOR]: ROUTES.DONOR_DASHBOARD,
  [ROLES.HOSPITAL]: ROUTES.HOSPITAL_DASHBOARD,
};

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: ROLES.DONOR,
    },
  });

  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);

  const selectedRole = watch("role");
  const password = watch("password");

  const onSubmit = async (data) => {
    setSubmitting(true);

    try {
      const payload = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: data.role,
      };

      if (data.role === ROLES.DONOR) {
        Object.assign(payload, {
          age: Number(data.age),
          gender: data.gender,
          bloodGroup: data.bloodGroup,
          mobile: data.mobile,
          city: data.city,
          address: data.address,
        });
      }

      // if (data.role === ROLES.HOSPITAL) {
      //   Object.assign(payload, {
      //     hospitalName: data.hospitalName,
      //     registrationNo: data.registrationNo,
      //     contactNo: data.contactNo,
      //     city: data.city,
      //     address: data.address,
      //   });
      // }
      if (data.role === ROLES.HOSPITAL) {
        Object.assign(payload, {
          hospitalName: data.fullName,
          registrationNo: data.registrationNo,
          contactNo: data.contactNo,
          city: data.city,
          address: data.address,
        });
      }

      if (data.role === ROLES.ADMIN) {
        Object.assign(payload, {
          designation: data.designation,
        });
      }

      const authResponse = await registerUser(payload);

      if (data.role === ROLES.HOSPITAL) {
        toast.success(
          "Hospital registered successfully. Await admin approval.",
        );
      } else {
        toast.success("Registration successful!");
      }

      navigate(HOME_BY_ROLE[authResponse.role] || ROUTES.HOME, {
        replace: true,
      });
    } catch (err) {
      toast.error(err?.message ?? "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 650 }}>
      <div className="card shadow border-0 rounded-4">
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-danger">
              Join Blood Donation Management System
            </h2>

            <p className="text-muted">Create your account to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormSelect
              label="Register As"
              name="role"
              required
              register={register}
              registerOptions={{
                required: "Role is required",
              }}
              error={errors.role}
              options={[
                { value: ROLES.DONOR, label: "Donor" },
                { value: ROLES.HOSPITAL, label: "Hospital" },
                { value: ROLES.ADMIN, label: "Admin" },
              ]}
            />

            <div className="row">
              <div className="col-md-6">
                {/* <FormInput
                  label="Full Name"
                  name="fullName"
                  required
                  register={register}
                  registerOptions={{
                    required: "Full name is required",
                  }}
                  error={errors.fullName}
                /> */}
                <FormInput
                  label={selectedRole === ROLES.HOSPITAL ? "Hospital Name" : "Full Name"}
                  name="fullName"
                  required
                  register={register}
                  registerOptions={{
                  required:
                  selectedRole === ROLES.HOSPITAL
                  ? "Hospital name is required"
                  : "Full name is required",
                  }}
                  error={errors.fullName}
                  />
              </div>

              <div className="col-md-6">
                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  required
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
              </div>
            </div>

            <FormInput
              label="Password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
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

            <FormInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              register={register}
              registerOptions={{
                required: "Confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              }}
              error={errors.confirmPassword}
            />

            {selectedRole === ROLES.DONOR && (
              <>
                <div className="row">
                  <div className="col-md-4">
                    <FormInput
                      label="Age"
                      name="age"
                      type="number"
                      required
                      register={register}
                      registerOptions={{
                        required: "Age is required",
                        min: {
                          value: 18,
                          message: "Must be at least 18",
                        },
                      }}
                      error={errors.age}
                    />
                  </div>

                  <div className="col-md-4">
                    <FormSelect
                      label="Gender"
                      name="gender"
                      required
                      register={register}
                      registerOptions={{
                        required: "Gender is required",
                      }}
                      options={["Male", "Female", "Other"]}
                      error={errors.gender}
                    />
                  </div>

                  <div className="col-md-4">
                    <FormSelect
                      label="Blood Group"
                      name="bloodGroup"
                      required
                      register={register}
                      registerOptions={{
                        required: "Blood group is required",
                      }}
                      options={BLOOD_GROUPS}
                      error={errors.bloodGroup}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <FormInput
                      label="Mobile"
                      name="mobile"
                      required
                      register={register}
                      registerOptions={{
                        required: "Mobile number is required",
                      }}
                      error={errors.mobile}
                    />
                  </div>

                  <div className="col-md-6">
                    <FormInput
                      label="City"
                      name="city"
                      required
                      register={register}
                      registerOptions={{
                        required: "City is required",
                      }}
                      error={errors.city}
                    />
                  </div>
                </div>

                <FormTextarea
                  label="Address"
                  name="address"
                  required
                  register={register}
                  registerOptions={{
                    required: "Address is required",
                  }}
                  error={errors.address}
                />
              </>
            )}

            {selectedRole === ROLES.HOSPITAL && (
              <>
                {/* <FormInput
                  label="Hospital Name"
                  name="hospitalName"
                  required
                  register={register}
                  registerOptions={{
                    required: "Hospital name is required",
                  }}
                  error={errors.hospitalName}
                /> */}

                <FormInput
                  label="Registration Number"
                  name="registrationNo"
                  required
                  register={register}
                  registerOptions={{
                    required: "Registration number is required",
                  }}
                  error={errors.registrationNo}
                />

                <FormInput
                  label="Contact Number"
                  name="contactNo"
                  required
                  register={register}
                  registerOptions={{
                    required: "Contact number is required",
                  }}
                  error={errors.contactNo}
                />

                <FormInput
                  label="City"
                  name="city"
                  required
                  register={register}
                  registerOptions={{
                    required: "City is required",
                  }}
                  error={errors.city}
                />

                <FormTextarea
                  label="Address"
                  name="address"
                  required
                  register={register}
                  registerOptions={{
                    required: "Address is required",
                  }}
                  error={errors.address}
                />

                <div className="alert alert-info">
                  Your hospital account must be approved by an administrator
                  before you can create blood requests.
                </div>
              </>
            )}

            {selectedRole === ROLES.ADMIN && (
              <FormInput
                label="Designation"
                name="designation"
                required
                register={register}
                registerOptions={{
                  required: "Designation is required",
                }}
                error={errors.designation}
              />
            )}

            <button
              type="submit"
              className="btn btn-danger w-100 d-flex justify-content-center align-items-center"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Spinner className="me-2" />
                  Registering...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <hr className="my-4" />

          <p className="text-center mb-0">
            Already have an account? <Link to={ROUTES.LOGIN}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
