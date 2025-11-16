'use client'
import { zodResolver } from '@hookform/resolvers/zod';
import React, { Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import InputField from '../InputField';
import Image from 'next/image';


const schema = z.object({
    username: z.string().min(3, { message: 'User name must be 3 characters long' }).max(20, { message: 'User name must be 20 characters long' }),
    email: z.email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long!' }),
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    phone: z.string().min(1, { message: 'Phone is required' }),
    address: z.string().min(1, { message: 'Address is required' }),
    
});

type Inputs = z.infer<typeof schema>;

const ParentForm = ({ type, data,setOpen }: { type: "create" | "update", data?: any,setOpen: Dispatch<SetStateAction<boolean>> }) => {

    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({ resolver: zodResolver(schema) });

    const onSubmit = handleSubmit(data => {
        console.log(data)
    })
    return (
        <form className='flex flex-col gap-8' onSubmit={onSubmit}>
            <h1 className='text-xl font-semibold'>Create a new parent</h1>
            <span className='text-xs text-gray-400 font-medium'>
                Authentication Information
            </span>
            <div className='flex flex-wrap justify-between gap-4'>


                <InputField label='Username' name='username' type='text' defaultValue={data?.username} register={register} error={errors.username} className='md:w-1/4'/>
                <InputField label='Email' name='email' type='email' defaultValue={data?.email} register={register} error={errors.email} className='md:w-1/4'/>
                <InputField label='Password' name='password' type='password' defaultValue={data?.password} register={register} error={errors.password} className='md:w-1/4'/>
            </div>
            <span className='text-xs text-gray-400 font-medium'>
                Personal information
            </span>

            <div className='flex flex-wrap justify-between gap-4'>
                <InputField label='First Name' name='firstName' type='text' defaultValue={data?.firstName} register={register} error={errors.firstName} className='md:w-1/4'/>
                <InputField label='Last Name' name='lastName' type='text' defaultValue={data?.lastName} register={register} error={errors.lastName} className='md:w-1/4'/>
                <InputField label='Phone' name='phone' type='text' defaultValue={data?.phone} register={register} error={errors.phone} className='md:w-1/4'/>
                <InputField label='Address' name='address' type='text' defaultValue={data?.address} register={register} error={errors.address} className='md:w-1/4'/>
            </div>
            <button className='bg-blue-400 text-white p-2 rounded-md'>{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    )
}

export default ParentForm
