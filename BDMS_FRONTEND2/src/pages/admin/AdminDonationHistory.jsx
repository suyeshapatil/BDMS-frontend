import { useEffect, useMemo, useState } from "react";
import {
  FiActivity,
  FiCalendar,
  FiHeart,
  FiRefreshCw,
  FiRotateCcw,
} from "react-icons/fi";
import { toast } from "react-toastify";

import donationHistoryApi from "../../api/donationHistoryApi";

import Breadcrumb from "../../components/layout/Breadcrumb";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import DataTable from "../../components/tables/DataTable";
import StatCard from "../../components/dashboard/StatCard";

import usePagination from "../../hooks/usePagination";

import { formatDate } from "../../utils/formatters";

export default function AdminDonationHistory() {
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [dateFilter, setDateFilter] = useState("");

  const loadHistory = async () => {
    try {
      setLoading(true);

      const res = await donationHistoryApi.getAll();

      setHistory(res.data.data || []);
    } catch (err) {
      toast.error(err.message || "Failed to load donation history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const filteredHistory = useMemo(() => {
    return history.filter((record) => {
      const keyword = `${record.donorName}
         ${record.hospitalName}
         ${record.remarks || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const dateMatch = !dateFilter || record.donationDate === dateFilter;

      return keyword && dateMatch;
    });
  }, [history, search, dateFilter]);

  const { pageItems, currentPage, totalPages, setCurrentPage } =
    usePagination(filteredHistory);

  const totalUnits = history.reduce(
    (sum, record) => sum + (record.unitsDonated || 0),
    0,
  );

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

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Donation History</h3>

          <p className="text-muted mb-0">
            View every completed blood donation recorded in the system.
          </p>
        </div>

        <button className="btn btn-outline-danger" onClick={loadHistory}>
          <FiRefreshCw className="me-2" />
          Refresh
        </button>
      </div>

      <div className="row mb-4">
        <StatCard
          title="Total Donations"
          value={history.length}
          icon={FiHeart}
          color="danger"
        />

        <StatCard
          title="Units Collected"
          value={totalUnits}
          icon={FiActivity}
          color="success"
        />
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-lg-6">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search donor or hospital..."
              />
            </div>

            <div className="col-lg-4">
              <input
                type="date"
                className="form-control"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>

            <div className="col-lg-2">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearch("");
                  setDateFilter("");
                }}
              >
                <FiRotateCcw className="me-2" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          {filteredHistory.length === 0 ? (
            <EmptyState
              icon={FiCalendar}
              message="No donation history found matching your filters."
            />
          ) : (
            <>
              <DataTable
                keyField="historyId"
                rows={pageItems}
                emptyMessage="No donation records available."
                columns={[
                  {
                    key: "donationDate",
                    header: "Donation Date",
                    render: (record) =>
                      record.donationDate
                        ? formatDate(record.donationDate)
                        : "-",
                  },
                  {
                    key: "donorName",
                    header: "Donor",
                  },
                  {
                    key: "hospitalName",
                    header: "Hospital",
                  },
                  {
                    key: "unitsDonated",
                    header: "Units",
                    render: (record) => (
                      <span className="badge bg-danger">
                        {record.unitsDonated}
                      </span>
                    ),
                  },
                  {
                    key: "remarks",
                    header: "Remarks",
                    render: (record) =>
                      record.remarks ? (
                        record.remarks
                      ) : (
                        <span className="text-muted">—</span>
                      ),
                  },
                ]}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
