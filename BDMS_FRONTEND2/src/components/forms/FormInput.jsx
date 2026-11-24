export default function FormInput({
  label,
  name,
  type = "text",
  register,
  registerOptions,
  error,
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

      <input
        id={name}
        type={type}
        className={`form-control ${error ? "is-invalid" : ""} ${className}`}
        {...(register ? register(name, registerOptions) : {})}
        {...rest}
      />

      {error && <div className="invalid-feedback">{error.message}</div>}
    </div>
  );
}
