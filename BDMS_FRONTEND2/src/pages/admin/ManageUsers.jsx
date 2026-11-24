import { useEffect, useMemo, useState } from "react";
import {
  FiRefreshCw,
  FiTrash2,
  FiUserCheck,
  FiUserX,
  FiUsers,
  FiShield,
  FiHeart,
  FiHome,
} from "react-icons/fi";
import { toast } from "react-toastify";

import adminUserApi from "../../api/adminUserApi";

import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ConfirmModal from "../../components/common/ConfirmModal";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import DataTable from "../../components/tables/DataTable";
import StatusBadge from "../../components/common/StatusBadge";
import Breadcrumb from "../../components/layout/Breadcrumb";
import StatCard from "../../components/dashboard/StatCard";

import usePagination from "../../hooks/usePagination";

import { formatDate } from "../../utils/formatters";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [busyId, setBusyId] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] = useState("");

  const [statusFilter, setStatusFilter] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);

      const res = await adminUserApi.getAll();

      setUsers(res.data.data || []);
    } catch (err) {
      toast.error(err.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleActive = async (user) => {
    setBusyId(user.userId);

    try {
      if (user.isActive) {
        await adminUserApi.deactivate(user.userId);

        toast.success(`${user.fullName} deactivated`);
      } else {
        await adminUserApi.activate(user.userId);

        toast.success(`${user.fullName} activated`);
      }

      await loadUsers();
    } catch (err) {
      toast.error(err.message || "Failed to update user status.");
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setBusyId(deleteTarget);

    try {
      await adminUserApi.remove(deleteTarget);

      toast.success("User deleted successfully.");

      await loadUsers();
    } catch (err) {
      toast.error(err.message || "Unable to delete user.");
    } finally {
      setBusyId(null);

      setDeleteTarget(null);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const keyword = `${user.fullName} ${user.email} ${user.role}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const roleMatch = !roleFilter || user.role === roleFilter;

      const statusMatch =
        !statusFilter || String(user.isActive) === statusFilter;

      return keyword && roleMatch && statusMatch;
    });
  }, [users, search, roleFilter, statusFilter]);

  const { pageItems, currentPage, totalPages, setCurrentPage } =
    usePagination(filteredUsers);

  const totalAdmins = users.filter((u) => u.role === "ADMIN").length;

  const totalDonors = users.filter((u) => u.role === "DONOR").length;

  const totalHospitals = users.filter((u) => u.role === "HOSPITAL").length;

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
            label: "Manage Users",
          },
        ]}
      />

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">Manage Users</h3>

          <p className="text-muted mb-0">
            View and manage all registered users.
          </p>
        </div>

        <button className="btn btn-outline-danger" onClick={loadUsers}>
          <FiRefreshCw className="me-2" />
          Refresh
        </button>
      </div>

      <div className="row mb-4">
        <StatCard
          title="Total Users"
          value={users.length}
          icon={FiUsers}
          color="primary"
        />

        <StatCard
          title="Admins"
          value={totalAdmins}
          icon={FiShield}
          color="warning"
        />

        <StatCard
          title="Donors"
          value={totalDonors}
          icon={FiHeart}
          color="danger"
        />

        <StatCard
          title="Hospitals"
          value={totalHospitals}
          icon={FiHome}
          color="success"
        />
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-lg-5">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search name, email or role..."
              />
            </div>

            <div className="col-lg-3">
              <select
                className="form-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>

                <option value="ADMIN">ADMIN</option>

                <option value="DONOR">DONOR</option>

                <option value="HOSPITAL">HOSPITAL</option>
              </select>
            </div>

            <div className="col-lg-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>

                <option value="true">Active</option>

                <option value="false">Inactive</option>
              </select>
            </div>

            <div className="col-lg-1">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearch("");
                  setRoleFilter("");
                  setStatusFilter("");
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          {filteredUsers.length === 0 ? (
            <EmptyState
              icon={FiUsers}
              message="No users found matching your filters."
            />
          ) : (
            <>
              <DataTable
                keyField="userId"
                rows={pageItems}
                emptyMessage="No users found."
                columns={[
                  {
                    key: "fullName",
                    header: "Name",
                  },
                  {
                    key: "email",
                    header: "Email",
                  },
                  {
                    key: "role",
                    header: "Role",
                    render: (user) => {
                      const badgeClass =
                        user.role === "ADMIN"
                          ? "bg-warning text-dark"
                          : user.role === "DONOR"
                            ? "bg-danger"
                            : "bg-primary";

                      return (
                        <span className={`badge ${badgeClass}`}>
                          {user.role}
                        </span>
                      );
                    },
                  },
                  {
                    key: "isActive",
                    header: "Status",
                    render: (user) => <StatusBadge status={user.isActive} />,
                  },
                  {
                    key: "createdAt",
                    header: "Joined",
                    render: (user) => formatDate(user.createdAt),
                  },
                  {
                    key: "actions",
                    header: "Actions",
                    render: (user) => (
                      <div className="d-flex gap-2">
                        <button
                          className={`btn btn-sm ${
                            user.isActive
                              ? "btn-outline-warning"
                              : "btn-outline-success"
                          }`}
                          disabled={busyId === user.userId}
                          title={
                            user.isActive ? "Deactivate User" : "Activate User"
                          }
                          onClick={() => toggleActive(user)}
                        >
                          {user.isActive ? <FiUserX /> : <FiUserCheck />}
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          disabled={busyId === user.userId}
                          title="Delete User"
                          onClick={() => setDeleteTarget(user.userId)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
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

      <ConfirmModal
        show={Boolean(deleteTarget)}
        title="Delete User"
        message="Are you sure you want to permanently delete this user? This action cannot be undone."
        confirmLabel="Delete"
        loading={busyId === deleteTarget}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
