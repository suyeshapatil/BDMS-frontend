export default function FormTextarea({
  label,
  name,
  register,
  registerOptions,
  error,
  rows = 3,
  required = false,
  className = "",
  ...rest
}) {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}

      <textarea
        id={name}
        rows={rows}
        className={`form-control ${error ? "is-invalid" : ""} ${className}`}
        {...(register ? register(name, registerOptions) : {})}
        {...rest}
      />

      {error && <div className="invalid-feedback">{error.message}</div>}
    </div>
  );
}
