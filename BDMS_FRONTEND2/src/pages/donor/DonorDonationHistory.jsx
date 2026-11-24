import { useEffect, useMemo, useState } from "react";
import { FiClock, FiDroplet, FiRefreshCw, FiSearch } from "react-icons/fi";

import { toast } from "react-toastify";

import donorApi from "../../api/donorApi";
import donationHistoryApi from "../../api/donationHistoryApi";

import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import DataTable from "../../components/tables/DataTable";
import Breadcrumb from "../../components/layout/Breadcrumb";
import StatCard from "../../components/dashboard/StatCard";

import { formatDate } from "../../utils/formatters";

export default function DonorDonationHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const loadHistory = async () => {
    try {
      const donorRes = await donorApi.getMe();

      const donorId = donorRes.data.data.donorId;

      const historyRes = await donationHistoryApi.getByDonor(donorId);

      setHistory(historyRes.data.data || []);
    } catch (err) {
      toast.error(err.message || "Failed to load donation history.");
    }
  };

  useEffect(() => {
    async function load() {
      setLoading(true);

      await loadHistory();

      setLoading(false);
    }

    load();
  }, []);

  const filteredHistory = useMemo(() => {
    if (!search.trim()) {
      return history;
    }

    const keyword = search.toLowerCase();

    return history.filter(
      (item) =>
        item.hospitalName?.toLowerCase().includes(keyword) ||
        item.remarks?.toLowerCase().includes(keyword),
    );
  }, [history, search]);

  const totalUnits = history.reduce(
    (sum, donation) => sum + donation.unitsDonated,
    0,
  );

  const lastDonation =
    history.length > 0
      ? history
          .slice()
          .sort(
            (a, b) => new Date(b.donationDate) - new Date(a.donationDate),
          )[0]
      : null;

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <Breadcrumb
        items={[
          {
            label: "Dashboard",
          },
          {
            label: "Donation History",
          },
        ]}
      />

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">My Donation History</h3>

          <p className="text-muted mb-0">
            View all of your previous blood donations.
          </p>
        </div>

        <button className="btn btn-outline-danger" onClick={loadHistory}>
          <FiRefreshCw className="me-2" />
          Refresh
        </button>
      </div>

      <div className="row">
        <StatCard
          title="Total Donations"
          value={history.length}
          icon={FiClock}
          color="primary"
        />

        <StatCard
          title="Units Donated"
          value={totalUnits}
          icon={FiDroplet}
          color="danger"
        />

        <StatCard
          title="Last Donation"
          value={lastDonation ? formatDate(lastDonation.donationDate) : "-"}
          icon={FiClock}
          color="success"
        />
      </div>

      <div className="card shadow-sm border-0 mt-3">
        <div className="card-body">
          <div className="input-group mb-3">
            <span className="input-group-text">
              <FiSearch />
            </span>

            <input
              className="form-control"
              placeholder="Search hospital or remarks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {filteredHistory.length === 0 ? (
            <EmptyState icon={FiDroplet} message="No donation history found." />
          ) : (
            <DataTable
              keyField="historyId"
              rows={filteredHistory}
              emptyMessage="No donation history available."
              columns={[
                {
                  key: "donationDate",
                  header: "Donation Date",
                  render: (row) => formatDate(row.donationDate),
                },
                {
                  key: "hospitalName",
                  header: "Hospital",
                },
                {
                  key: "unitsDonated",
                  header: "Units",
                  render: (row) => (
                    <span className="badge bg-danger">{row.unitsDonated}</span>
                  ),
                },
                {
                  key: "remarks",
                  header: "Remarks",
                  render: (row) => row.remarks || "-",
                },
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
}
