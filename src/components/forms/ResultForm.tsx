'use client'
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import InputField from '../InputField';
import Image from 'next/image';


const schema = z.object({
    subjectName: z.string().min(3, { message: 'Subject name must be 3 characters long' }).max(20, { message: 'Subject name must be 20 characters long' }),
    class: z.string({ message: 'class value is required' }),
    teacher: z.string({ message: 'Teacher is required' }),
    student: z.string({ message: 'Student is required' }),
    type: z.enum(["exam", "assignment"], {
        error: () => ({ message: 'Invalid type selected' })
    }),
    date: z.date({ message: 'Due date is required' }),
    score: z.number({ message: 'Score is required' }),
});

type Inputs = z.infer<typeof schema>;

const ResultForm = ({ type, data }: { type: "create" | "update", data?: any }) => {

    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({ resolver: zodResolver(schema) });

    const onSubmit = handleSubmit(data => {
        console.log(data)
    })
    return (
        <form className='flex flex-col gap-8' onSubmit={onSubmit}>
            <h1 className='text-xl font-semibold'>Create a new result</h1>

            <div className='flex flex-row flex-wrap justify-between gap-2'>
                <InputField label='Subject' name='subject' type='text' defaultValue={data?.name} register={register} error={errors.subjectName} className='md:w-1/4' />
                <InputField label='Class' name='class' type='text' defaultValue={data?.teacher} register={register} error={errors.class} className='md:w-1/4' />

                <InputField label='Teacher' name='teacher' type='text' defaultValue={data?.teacher} register={register} error={errors.teacher} className='md:w-1/4' />
            </div>
            <div className='flex flex-row flex-wrap justify-between gap-2'>
                <InputField label='Student' name='student' type='text' defaultValue={data?.teacher} register={register} error={errors.student} className='md:w-1/4' />
                <InputField label='type' name='type' type='text' defaultValue={data?.teacher} register={register} error={errors.type} className='md:w-1/4' />
                <InputField label='Date' name='date' type='date' defaultValue={data?.teacher} register={register} error={errors.date} className='md:w-1/4' />

            </div>
            <div className='flex flex-row flex-wrap justify-between gap-2'>
                <InputField label='Score' name='score' type='text' defaultValue={data?.teacher} register={register} error={errors.score} className='md:w-1/1' />


            </div>
            <button className='bg-blue-400 text-white p-2 rounded-md'>{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    )
}

export default ResultForm
