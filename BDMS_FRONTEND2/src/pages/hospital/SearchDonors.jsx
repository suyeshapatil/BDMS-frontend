import { useEffect, useMemo, useState } from "react";
import {
  FiDroplet,
  FiMapPin,
  FiRefreshCw,
  FiRotateCcw,
  FiSearch,
  FiUsers,
} from "react-icons/fi";
import { toast } from "react-toastify";

import donorApi from "../../api/donorApi";

import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import DataTable from "../../components/tables/DataTable";
import StatusBadge from "../../components/common/StatusBadge";
import Breadcrumb from "../../components/layout/Breadcrumb";
import StatCard from "../../components/dashboard/StatCard";

import { BLOOD_GROUPS } from "../../constants/enums";

import { formatDate } from "../../utils/formatters";

export default function SearchDonors() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [city, setCity] = useState("");
  const [availability, setAvailability] = useState("");

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDonors = async (params = {}) => {
    try {
      setLoading(true);

      const res = await donorApi.getAll(params);

      setDonors(res.data.data || []);
    } catch (err) {
      toast.error(err.message || "Unable to load donors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonors();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    const params = {};

    if (bloodGroup) params.bloodGroup = bloodGroup;

    if (city.trim()) params.city = city.trim();

    if (availability !== "") params.availability = availability === "true";

    loadDonors(params);
  };

  const resetFilters = () => {
    setBloodGroup("");
    setCity("");
    setAvailability("");

    loadDonors();
  };

  const availableCount = useMemo(
    () => donors.filter((d) => d.availability).length,
    [donors],
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <Breadcrumb
        items={[{ label: "Dashboard" }, { label: "Search Donors" }]}
      />

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">Search Donors</h3>

          <p className="text-muted mb-0">
            Find eligible blood donors using filters.
          </p>
        </div>

        <button className="btn btn-outline-danger" onClick={() => loadDonors()}>
          <FiRefreshCw className="me-2" />
          Refresh
        </button>
      </div>

      <div className="row mb-4">
        <StatCard
          title="Total Donors"
          value={donors.length}
          icon={FiUsers}
          color="primary"
        />

        <StatCard
          title="Available"
          value={availableCount}
          icon={FiDroplet}
          color="success"
        />
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <form onSubmit={handleSearch} className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Blood Group</label>

              <select
                className="form-select"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
              >
                <option value="">All</option>

                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">City</label>

              <input
                className="form-control"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Availability</label>

              <select
                className="form-select"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              >
                <option value="">All</option>

                <option value="true">Available</option>

                <option value="false">Unavailable</option>
              </select>
            </div>

            <div className="col-md-3 d-flex align-items-end gap-2">
              <button className="btn btn-danger flex-grow-1" type="submit">
                <FiSearch className="me-2" />
                Search
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={resetFilters}
              >
                <FiRotateCcw />
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          {donors.length === 0 ? (
            <EmptyState
              icon={FiUsers}
              message="No donors match your search criteria."
            />
          ) : (
            <DataTable
              keyField="donorId"
              rows={donors}
              emptyMessage="No donors available."
              columns={[
                {
                  key: "fullName",
                  header: "Donor",
                },
                {
                  key: "bloodGroup",
                  header: "Blood Group",
                  render: (row) => (
                    <span className="badge bg-danger">{row.bloodGroup}</span>
                  ),
                },
                {
                  key: "city",
                  header: "City",
                  render: (row) => (
                    <span>
                      <FiMapPin className="me-1 text-danger" />
                      {row.city}
                    </span>
                  ),
                },
                {
                  key: "mobile",
                  header: "Mobile",
                },
                {
                  key: "availability",
                  header: "Availability",
                  render: (row) => <StatusBadge status={row.availability} />,
                },
                {
                  key: "totalDonations",
                  header: "Donations",
                  render: (row) => (
                    <span className="badge bg-primary">
                      {row.totalDonations}
                    </span>
                  ),
                },
                {
                  key: "lastDonationDate",
                  header: "Last Donation",
                  render: (row) =>
                    row.lastDonationDate
                      ? formatDate(row.lastDonationDate)
                      : "-",
                },
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
}
