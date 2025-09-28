'use client'
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import InputField from '../InputField';
import Image from 'next/image';


const schema = z.object({
    name: z.string().min(3, { message: 'Class name must be 3 characters long' }).max(20, { message: 'Class name must be 20 characters long' }),
    capacity: z.string({ message: 'Capacity value is required' }),
    grade: z.string({ message: 'Grade is required' }),
    supervisor: z.string({ message: 'Supervisor name is required' }),

});

type Inputs = z.infer<typeof schema>;

const ClassForm = ({ type, data }: { type: "create" | "update", data?: any }) => {

    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({ resolver: zodResolver(schema) });

    const onSubmit = handleSubmit(data => {
        console.log(data)
    })
    return (
        <form className='flex flex-col gap-8' onSubmit={onSubmit}>
            <h1 className='text-xl font-semibold'>Create a new class</h1>

            <div className='flex flex-row flex-wrap justify-between gap-2'>
                <InputField label='Subject' name='subject' type='text' defaultValue={data?.name} register={register} error={errors.name} className='md:w-1/2' />
                <InputField label='Capacity' name='capacity' type='text' defaultValue={data?.teacher} register={register} error={errors.capacity} className='md:w-1/3' />

            </div>
            <div className='flex flex-row flex-wrap justify-between gap-2'>
                <InputField label='Supervisor' name='supervisor' type='text' defaultValue={data?.teacher} register={register} error={errors.supervisor} className='md:w-1/2' />
                <InputField label='Grade' name='grade' type='text' defaultValue={data?.teacher} register={register} error={errors.grade} className='md:w-1/3' />
            </div>
            <button className='bg-blue-400 text-white p-2 rounded-md'>{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    )
}

export default ClassForm
