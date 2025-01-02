import React from "react";

interface InputBoxProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputBox: React.FC<InputBoxProps> = ({ type = "text", placeholder, value, onChange }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="px-4 py-3 rounded-lg border-2 border-gray-500 w-full max-w-md"
    />
  );
};

export default InputBox;