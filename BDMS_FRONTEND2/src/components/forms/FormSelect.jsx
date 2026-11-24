export default function FormSelect({
  label,
  name,
  options = [],
  register,
  registerOptions,
  error,
  placeholder = "Select...",
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

      <select
        id={name}
        className={`form-select ${error ? "is-invalid" : ""} ${className}`}
        {...(register ? register(name, registerOptions) : {})}
        {...rest}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value ?? option} value={option.value ?? option}>
            {option.label ?? option}
          </option>
        ))}
      </select>

      {error && <div className="invalid-feedback">{error.message}</div>}
    </div>
  );
}
