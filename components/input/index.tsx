"use client";
import Search from "@/assets/search.svg";
import classNames from "classnames";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  LegacyRef,
  forwardRef,
  useState,
} from "react";

type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "file"
  | "textarea"
  | "search";
type InputSize = "small" | "medium" | "large";

export type InputPropsType = {
  id?: string;
  name?: string;
  label?: string;
  type?: InputType;
  size?: InputSize;
  className?: string;
  value?: string;
} & Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  "size"
>;

const sizeMap: { [key in InputSize]: string } = {
  small: "py-4 text-base",
  medium: "py-6 text-base",
  large: "py-8 text-base",
};

const Input = (
  {
    id,
    name,
    label,
    type = "text",
    size = "small",
    className,
    placeholder,
    value,
    onChange,
    ...props
  }: InputPropsType,
  ref: LegacyRef<HTMLInputElement> | any
) => {
  const [textType, ,] = useState(type);
  const searchParams = useSearchParams();
  const router = useRouter();

  const removeParamsFromURL = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("query");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex relative">
      {type === "search" && (
        <div className="absolute top-5 left-3">
          <Image src={Search} alt="search" className="w-4 h-4" />
        </div>
      )}
      <input
        ref={ref}
        type={textType}
        id={id}
        name={name}
        value={value}
        aria-label={label}
        placeholder={placeholder}
        onChange={onChange}
        autoComplete="off"
        className={classNames(
          `w-full block px-10 outline-none bg-secondary text-[#B8C1D2] text-white rounded-sm font-medium  placeholder:font-medium placeholder:text-sm`,
          sizeMap[size],
          className
        )}
        {...props}
      />
    </div>
  );
};

export default forwardRef(Input);
