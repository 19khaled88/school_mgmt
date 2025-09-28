'use client'
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import InputField from '../InputField';
import Image from 'next/image';


const schema = z.object({
    title: z.string().min(3, { message: 'Title must be 3 characters long' }).max(20, { message: 'Title must be 20 characters long' }),
    class: z.string({ message: 'class value is required' }),
    date: z.date({ message: 'Date is required' }),
    
    
});

type Inputs = z.infer<typeof schema>;

const AnnouncementForm = ({ type, data }: { type: "create" | "update", data?: any }) => {

    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({ resolver: zodResolver(schema) });

    const onSubmit = handleSubmit(data => {
        console.log(data)
    })
    return (
        <form className='flex flex-col gap-8' onSubmit={onSubmit}>
            <h1 className='text-xl font-semibold'>Create a new announcement</h1>

            <div className='flex flex-row flex-wrap justify-between gap-2'>
                <InputField label='Title' name='title' type='text' defaultValue={data?.title} register={register} error={errors.title} className='md:w-1/2' />
                <InputField label='Class' name='class' type='text' defaultValue={data?.class} register={register} error={errors.class} className='md:w-1/4' />

                
            </div>
            <div className='flex flex-row flex-wrap justify-between gap-2'>
                <InputField label='Date' name='date' type='date' defaultValue={data?.date} register={register} error={errors.date} className='md:w-1/2' />
                

            </div>
            
            <button className='bg-blue-400 text-white p-2 rounded-md'>{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    )
}

export default AnnouncementForm
