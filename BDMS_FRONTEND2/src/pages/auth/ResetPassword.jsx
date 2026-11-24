import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState } from 'react';
import FormInput from '../../components/forms/FormInput';
import FormTextarea from '../../components/forms/FormTextarea';
import authApi from '../../api/authApi';
import { ROUTES } from '../../constants/routes';

export default function ResetPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await authApi.resetPassword({ token: data.token, newPassword: data.newPassword });
      toast.success('Password reset successful. Please log in.');
      navigate(ROUTES.LOGIN);
    } catch (err) {
      toast.error(err.message || 'Reset failed. Your token may be invalid or expired.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 460 }}>
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h3 className="fw-bold text-center mb-1 text-danger">Reset Password</h3>
          <p className="text-muted text-center mb-4">Paste the token emailed to you and choose a new password</p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormTextarea
              label="Reset Token"
              name="token"
              rows={3}
              register={register}
              registerOptions={{ required: 'Reset token is required' }}
              error={errors.token}
              placeholder="Paste the token from your email"
            />
            <FormInput
              label="New Password"
              name="newPassword"
              type="password"
              register={register}
              registerOptions={{ required: 'New password is required', minLength: { value: 6, message: 'Minimum 6 characters' } }}
              error={errors.newPassword}
            />
            <button type="submit" className="btn btn-danger w-100" disabled={submitting}>
              {submitting ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <p className="text-center mt-4 mb-0">
            <Link to={ROUTES.LOGIN}>Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
