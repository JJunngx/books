export default function createData(
  label,
  type,
  typeName,
  placeholder,
  register,
  errors
) {
  return { label, type, typeName, placeholder, register, errors };
}

export const url = "http://localhost:5000/";
