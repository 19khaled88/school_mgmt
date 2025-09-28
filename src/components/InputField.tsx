import React from 'react'
import { FieldError } from 'react-hook-form'

type InputFieldProps = {
    label: string;
    type?: string;
    register: any;
    name: string;
    defaultValue?: string;
    error?: FieldError;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    className?:string;
}
const InputField = ({
    label, type = 'text', register, name, defaultValue, error, inputProps, className
}: InputFieldProps) => {
    return (
        <div className={`flex flex-col gap-2 w-full ${className}`}>
            <label htmlFor={name} className='text-xs text-gray-500'>{label}</label>
            <input
                id={name}
                type={type}
                {...register(name)}
                className='ring-[1.15px] ring-gray-300 p-2 rounded-md text-sm'
                {...inputProps}
                defaultValue={defaultValue}
            />
            {error?.message && (<p className='text-xs text-red-400'>{error?.message.toString()}</p>)}
        </div>
    )
}

export default InputField
