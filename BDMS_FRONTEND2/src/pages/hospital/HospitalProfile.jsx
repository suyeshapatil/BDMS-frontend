import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FiCheckCircle, FiEdit2, FiRefreshCw, FiXCircle } from "react-icons/fi";

import hospitalApi from "../../api/hospitalApi";

import FormInput from "../../components/forms/FormInput";
import FormTextarea from "../../components/forms/FormTextarea";

import Loader from "../../components/common/Loader";
import ProfileCard from "../../components/common/ProfileCard";
import Breadcrumb from "../../components/layout/Breadcrumb";

export default function HospitalProfile() {
  const [hospital, setHospital] = useState(null);

  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);

  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);

      const response = await hospitalApi.getMe();

      setHospital(response.data.data);

      reset(response.data.data);
    } catch (err) {
      toast.error(err?.message ?? "Unable to load profile.");
    } finally {
      setLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);

      const payload = {
        hospitalName: data.hospitalName,
        registrationNo: data.registrationNo,
        contactNo: data.contactNo,
        city: data.city,
        address: data.address,
      };

      const response = await hospitalApi.update(hospital.hospitalId, payload);

      setHospital(response.data.data);

      reset(response.data.data);

      toast.success("Hospital profile updated successfully.");

      setEditing(false);
    } catch (err) {
      toast.error(err?.message ?? "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container-fluid">
      <Breadcrumb
        items={[{ label: "Dashboard" }, { label: "Hospital Profile" }]}
      />

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Hospital Profile</h2>

          <p className="text-muted mb-0">Manage your hospital information.</p>
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-outline-danger" onClick={loadProfile}>
            <FiRefreshCw className="me-2" />
            Refresh
          </button>

          <button
            className="btn btn-outline-primary"
            onClick={() => setEditing(!editing)}
          >
            <FiEdit2 className="me-2" />

            {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h5 className="mb-1">Verification Status</h5>

            <p className="text-muted mb-0">
              {hospital.verified
                ? "Your hospital has been verified by the administrator."
                : "Your hospital registration is pending verification."}
            </p>
          </div>

          {hospital.verified ? (
            <div className="text-success fw-semibold d-flex align-items-center gap-2">
              <FiCheckCircle />
              Verified
            </div>
          ) : (
            <div className="text-warning fw-semibold d-flex align-items-center gap-2">
              <FiXCircle />
              Pending
            </div>
          )}
        </div>
      </div>

      {!editing ? (
        <ProfileCard
          title={hospital.hospitalName}
          fields={[
            {
              label: "Email",
              value: hospital.email,
            },
            {
              label: "Registration Number",
              value: hospital.registrationNo,
            },
            {
              label: "Contact Number",
              value: hospital.contactNo,
            },
            {
              label: "City",
              value: hospital.city,
            },
            {
              label: "Address",
              value: hospital.address,
            },
            {
              label: "Created",
              value: hospital.createdAt
                ? new Date(hospital.createdAt).toLocaleDateString()
                : "-",
            },
          ]}
        />
      ) : (
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-md-6">
                  <FormInput
                    label="Hospital Name"
                    name="hospitalName"
                    register={register}
                    registerOptions={{
                      required: "Hospital name is required",
                    }}
                    error={errors.hospitalName}
                  />
                </div>

                <div className="col-md-6">
                  <FormInput
                    label="Registration Number"
                    name="registrationNo"
                    register={register}
                    error={errors.registrationNo}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <FormInput
                    label="Contact Number"
                    name="contactNo"
                    register={register}
                    error={errors.contactNo}
                  />
                </div>

                <div className="col-md-6">
                  <FormInput
                    label="City"
                    name="city"
                    register={register}
                    error={errors.city}
                  />
                </div>
              </div>

              <FormTextarea
                label="Address"
                name="address"
                register={register}
                rows={4}
                error={errors.address}
              />

              <button
                type="submit"
                className="btn btn-danger"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
