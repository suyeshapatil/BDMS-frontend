import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState } from 'react';
import FormInput from '../../components/forms/FormInput';
import authApi from '../../api/authApi';
import { ROUTES } from '../../constants/routes';

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await authApi.forgotPassword(data.email);
      setSent(true);
      toast.success('If that email exists, a reset link has been sent.');
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 460 }}>
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h3 className="fw-bold text-center mb-1 text-danger">Forgot Password</h3>
          <p className="text-muted text-center mb-4">We'll email you a reset token</p>

          {sent ? (
            <div className="alert alert-success">
              Check your email for a password reset token, then head to the{' '}
              <Link to={ROUTES.RESET_PASSWORD}>reset password page</Link>.
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <FormInput
                label="Email"
                name="email"
                type="email"
                register={register}
                registerOptions={{ required: 'Email is required' }}
                error={errors.email}
              />
              <button type="submit" className="btn btn-danger w-100" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          <p className="text-center mt-4 mb-0">
            <Link to={ROUTES.LOGIN}>Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
