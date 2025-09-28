'use client'
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import InputField from '../InputField';
import Image from 'next/image';


const schema = z.object({
    name: z.string().min(3, { message: 'Subject name must be 3 characters long' }).max(20, { message: 'Subject name must be 20 characters long' }),
    teacher: z.string({ message: 'Teacher name is required' }),

});

type Inputs = z.infer<typeof schema>;

const SubjectForm = ({ type, data }: { type: "create" | "update", data?: any }) => {

    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({ resolver: zodResolver(schema) });

    const onSubmit = handleSubmit(data => {
        console.log(data)
    })
    return (
        <form className='flex flex-col gap-8' onSubmit={onSubmit}>
            <h1 className='text-xl font-semibold'>Create a new subject</h1>

            <div className='flex flex-col flex-wrap justify-between gap-4'>

                <InputField label='Subject' name='name' type='text' defaultValue={data?.name} register={register} error={errors.name} className='md:w-1/2'/>
                <InputField label='Teacher' name='teacher' type='text' defaultValue={data?.teacher} register={register} error={errors.teacher}  className='md:w-1/2'/>

            </div>
            <button className='bg-blue-400 text-white p-2 rounded-md'>{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    )
}

export default SubjectForm
