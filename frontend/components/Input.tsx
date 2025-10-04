import React from 'react';
interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, ...rest }: Props) {
  return (
    <label className="block">
      {label && <span className="text-sm text-gray-600">{label}</span>}
      <input {...rest} className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2" />
    </label>
  );
}
