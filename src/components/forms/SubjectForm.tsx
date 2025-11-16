'use client'
import { zodResolver } from '@hookform/resolvers/zod';
import React, { Dispatch, SetStateAction, useActionState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { set, success, z } from 'zod';
import InputField from '../InputField';
import Image from 'next/image';
import { subjectSchema, SubjectSchema } from '@/lib/formValidationSchema';
import { createSubject } from '@/lib/actions';
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';




// type Inputs = z.infer<typeof schema>;

const SubjectForm = ({ type, data, setOpen }: { type: "create" | "update", data?: any, setOpen: Dispatch<SetStateAction<boolean>> }) => {

    const { register, handleSubmit, formState: { errors } } = useForm<SubjectSchema>({ resolver: zodResolver(subjectSchema) });

    // After react 19 it will be "useactionstate"
    const [state, formAction] = useActionState(createSubject, { success: false, error: false })
 
    const router = useRouter();

    // Prevent event propagation in the form
    const handleFormClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    }

    const onSubmit = handleSubmit(data => {
        formAction(data)
    });

   

    useEffect(() => {
        if (state.success) {
            toast(`Subject ${type === 'create' ? 'created' : 'updated'} successfully`);
            setOpen(false);
            router.refresh();
        }
    }, [state])
    return (
        <form className='flex flex-col gap-8' onSubmit={onSubmit} onClick={handleFormClick}>
            <h1 className='text-xl font-semibold'>{type === 'create' ? "Create a new subject" : "Update the subject"}</h1>

            <div className='flex flex-col flex-wrap justify-between gap-4'>

                <InputField label='Subject' name='name' type='text' defaultValue={data?.name} register={register} error={errors.name} className='md:w-1/2' />

            </div>
            {state.error && <span className='text-red-500'>There was an error processing your request.</span>}
            <button className='bg-blue-400 text-white p-2 rounded-md'>{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    )
}

export default SubjectForm
