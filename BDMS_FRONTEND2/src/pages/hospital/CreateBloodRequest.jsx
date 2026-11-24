import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { FiDroplet, FiRefreshCw } from "react-icons/fi";

import bloodRequestApi from "../../api/bloodRequestApi";

import FormInput from "../../components/forms/FormInput";
import FormSelect from "../../components/forms/FormSelect";
import Breadcrumb from "../../components/layout/Breadcrumb";

import { BLOOD_GROUPS, URGENCY_LEVELS } from "../../constants/enums";

import { ROUTES } from "../../constants/routes";

export default function CreateBloodRequest() {
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const payload = {
        patientName: data.patientName,
        bloodGroup: data.bloodGroup,
        unitsRequired: Number(data.unitsRequired),
        city: data.city,
        urgencyLevel: data.urgencyLevel,
      };

      await bloodRequestApi.create(payload);

      toast.success(
        "Blood request created successfully. Matching donors have been notified.",
      );

      navigate(ROUTES.HOSPITAL_REQUESTS);
    } catch (err) {
      toast.error(err?.message ?? "Unable to create blood request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid">
      <Breadcrumb
        items={[{ label: "Dashboard" }, { label: "Create Blood Request" }]}
      />

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Create Blood Request</h2>

          <p className="text-muted mb-0">
            Hospitals can create emergency blood requests for eligible donors.
          </p>
        </div>

        <button className="btn btn-outline-secondary" onClick={() => reset()}>
          <FiRefreshCw className="me-2" />
          Clear Form
        </button>
      </div>

      <div className="alert alert-info">
        <strong>Note:</strong>
        <br />
        After submitting this request, all matching eligible donors in your city
        will automatically receive notifications and email alerts.
      </div>

      <div className="card shadow-sm border-0" style={{ maxWidth: "720px" }}>
        <div className="card-header bg-white">
          <h5 className="mb-0 d-flex align-items-center gap-2">
            <FiDroplet className="text-danger" />
            Blood Request Details
          </h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput
              label="Patient Name"
              name="patientName"
              register={register}
              registerOptions={{
                required: "Patient name is required",
                maxLength: {
                  value: 100,
                  message: "Maximum 100 characters",
                },
              }}
              error={errors.patientName}
            />

            <div className="row">
              <div className="col-md-6">
                <FormSelect
                  label="Blood Group"
                  name="bloodGroup"
                  register={register}
                  registerOptions={{
                    required: "Blood group is required",
                  }}
                  options={BLOOD_GROUPS}
                  error={errors.bloodGroup}
                />
              </div>

              <div className="col-md-6">
                <FormInput
                  label="Units Required"
                  name="unitsRequired"
                  type="number"
                  register={register}
                  registerOptions={{
                    required: "Units required is mandatory",
                    min: {
                      value: 1,
                      message: "Minimum 1 unit",
                    },
                    max: {
                      value: 20,
                      message: "Maximum 20 units",
                    },
                  }}
                  error={errors.unitsRequired}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <FormInput
                  label="City"
                  name="city"
                  register={register}
                  registerOptions={{
                    required: "City is required",
                  }}
                  error={errors.city}
                />
              </div>

              <div className="col-md-6">
                <FormSelect
                  label="Urgency Level"
                  name="urgencyLevel"
                  register={register}
                  registerOptions={{
                    required: "Urgency level is required",
                  }}
                  options={URGENCY_LEVELS}
                  error={errors.urgencyLevel}
                />
              </div>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="btn btn-danger"
                disabled={submitting}
              >
                {submitting ? "Creating Request..." : "Create Blood Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
