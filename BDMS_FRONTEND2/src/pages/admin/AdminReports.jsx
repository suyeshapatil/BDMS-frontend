import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiFileText,
  FiRefreshCw,
  FiBarChart2,
  FiDatabase,
} from "react-icons/fi";
import { toast } from "react-toastify";

import reportApi from "../../api/reportApi";

import Breadcrumb from "../../components/layout/Breadcrumb";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import DataTable from "../../components/tables/DataTable";
import StatCard from "../../components/dashboard/StatCard";
import FormInput from "../../components/forms/FormInput";

import usePagination from "../../hooks/usePagination";

import { formatDateTime } from "../../utils/formatters";

export default function AdminReports() {
  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);

  const [generating, setGenerating] = useState(false);

  const [search, setSearch] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const loadReports = async () => {
    try {
      setLoading(true);

      const res = await reportApi.getAll();

      setReports(res.data.data || []);
    } catch (err) {
      toast.error(err.message || "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const filteredReports = useMemo(() => {
    return reports.filter((report) =>
      `${report.reportName}
       ${report.generatedByAdminName}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [reports, search]);

  const { pageItems, currentPage, totalPages, setCurrentPage } =
    usePagination(filteredReports);

  const onSubmit = async (data) => {
    setGenerating(true);

    try {
      await reportApi.generate(data.reportName);

      toast.success("Report generated successfully.");

      reset();

      await loadReports();
    } catch (err) {
      toast.error(err.message || "Failed to generate report.");
    } finally {
      setGenerating(false);
    }
  };

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
            label: "Reports",
          },
        ]}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Reports</h3>

          <p className="text-muted mb-0">Generate and manage system reports.</p>
        </div>

        <button className="btn btn-outline-danger" onClick={loadReports}>
          <FiRefreshCw className="me-2" />
          Refresh
        </button>
      </div>

      <div className="row mb-4">
        <StatCard
          title="Generated Reports"
          value={reports.length}
          icon={FiFileText}
          color="danger"
        />

        <StatCard
          title="Analytics"
          value="Ready"
          icon={FiBarChart2}
          color="success"
        />

        <StatCard
          title="Database"
          value="Connected"
          icon={FiDatabase}
          color="primary"
        />
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white">
          <h6 className="mb-0 d-flex align-items-center">
            <FiFileText className="me-2" />
            Generate New Report
          </h6>
        </div>

        <div className="card-body">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="row g-3"
            noValidate
          >
            <div className="col-lg-9">
              <FormInput
                name="reportName"
                register={register}
                registerOptions={{
                  required: "Report name is required",
                }}
                error={errors.reportName}
                placeholder="Monthly Donation Report"
              />
            </div>

            <div className="col-lg-3">
              <button className="btn btn-danger w-100" disabled={generating}>
                {generating ? "Generating..." : "Generate"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0">Generated Reports</h6>

            <div style={{ width: 300 }}>
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search reports..."
              />
            </div>
          </div>
        </div>

        <div className="card-body">
          {filteredReports.length === 0 ? (
            <EmptyState icon={FiFileText} message="No reports found." />
          ) : (
            <>
              <DataTable
                keyField="reportId"
                rows={pageItems}
                emptyMessage="No reports available."
                columns={[
                  {
                    key: "reportName",
                    header: "Report Name",
                    render: (report) => (
                      <span className="fw-semibold">{report.reportName}</span>
                    ),
                  },
                  {
                    key: "generatedByAdminName",
                    header: "Generated By",
                    render: (report) => report.generatedByAdminName || "-",
                  },
                  {
                    key: "generatedOn",
                    header: "Generated On",
                    render: (report) =>
                      report.generatedOn
                        ? formatDateTime(report.generatedOn)
                        : "-",
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
