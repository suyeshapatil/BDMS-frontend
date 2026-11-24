import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FiEdit2, FiRefreshCw, FiCheckCircle, FiXCircle } from "react-icons/fi";

import donorApi from "../../api/donorApi";

import FormInput from "../../components/forms/FormInput";
import FormSelect from "../../components/forms/FormSelect";
import FormTextarea from "../../components/forms/FormTextarea";

import Loader from "../../components/common/Loader";
import ProfileCard from "../../components/common/ProfileCard";
import Breadcrumb from "../../components/layout/Breadcrumb";

import { BLOOD_GROUPS } from "../../constants/enums";

export default function DonorProfile() {
  const [donor, setDonor] = useState(null);

  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);

  const [saving, setSaving] = useState(false);

  const [changingAvailability, setChangingAvailability] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);

      const response = await donorApi.getMe();

      setDonor(response.data.data);

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
        age: data.age ? Number(data.age) : undefined,
        gender: data.gender,
        bloodGroup: data.bloodGroup,
        mobile: data.mobile,
        city: data.city,
        address: data.address,
      };

      const response = await donorApi.update(donor.donorId, payload);

      setDonor(response.data.data);

      reset(response.data.data);

      toast.success("Profile updated successfully.");

      setEditing(false);
    } catch (err) {
      toast.error(err?.message ?? "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailability = async () => {
    try {
      setChangingAvailability(true);

      const response = await donorApi.updateAvailability(
        donor.donorId,
        !donor.availability,
      );

      setDonor(response.data.data);

      toast.success(
        response.data.data.availability
          ? "You are now available for donation."
          : "You are now unavailable for donation.",
      );
    } catch (err) {
      toast.error(err?.message ?? "Unable to update availability.");
    } finally {
      setChangingAvailability(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container-fluid">
      <Breadcrumb items={[{ label: "Dashboard" }, { label: "My Profile" }]} />

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h2 className="fw-bold mb-1">My Profile</h2>

          <p className="text-muted mb-0">
            View and update your donor information.
          </p>
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
            <h5 className="mb-1">Donation Availability</h5>

            <p className="text-muted mb-0">
              {donor.availability
                ? "You are currently visible to hospitals."
                : "Hospitals cannot currently contact you."}
            </p>
          </div>

          <button
            className={`btn ${
              donor.availability ? "btn-success" : "btn-outline-secondary"
            }`}
            onClick={toggleAvailability}
            disabled={changingAvailability}
          >
            {donor.availability ? (
              <>
                <FiCheckCircle className="me-2" />
                Available
              </>
            ) : (
              <>
                <FiXCircle className="me-2" />
                Unavailable
              </>
            )}
          </button>
        </div>
      </div>

      {!editing ? (
        <ProfileCard
          title={donor.fullName}
          fields={[
            {
              label: "Email",
              value: donor.email,
            },
            {
              label: "Blood Group",
              value: donor.bloodGroup,
            },
            {
              label: "Age",
              value: donor.age,
            },
            {
              label: "Gender",
              value: donor.gender,
            },
            {
              label: "Mobile",
              value: donor.mobile,
            },
            {
              label: "City",
              value: donor.city,
            },
            {
              label: "Address",
              value: donor.address,
            },
            {
              label: "Total Donations",
              value: donor.totalDonations,
            },
            {
              label: "Last Donation",
              value: donor.lastDonationDate
                ? new Date(donor.lastDonationDate).toLocaleDateString()
                : "Never",
            },
          ]}
        />
      ) : (
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-md-4">
                  <FormInput
                    label="Age"
                    name="age"
                    type="number"
                    register={register}
                    registerOptions={{
                      min: {
                        value: 18,
                        message: "Minimum age is 18",
                      },
                    }}
                    error={errors.age}
                  />
                </div>

                <div className="col-md-4">
                  <FormSelect
                    label="Gender"
                    name="gender"
                    register={register}
                    options={["Male", "Female", "Other"]}
                    error={errors.gender}
                  />
                </div>

                <div className="col-md-4">
                  <FormSelect
                    label="Blood Group"
                    name="bloodGroup"
                    register={register}
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
                    register={register}
                    error={errors.mobile}
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
                error={errors.address}
                rows={4}
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
