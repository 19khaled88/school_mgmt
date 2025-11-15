import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server';
import React from 'react'

const Announcements = async () => {

    const session = await auth();
    const { userId, sessionClaims } = session;
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    const roleConditions = {

        teacher: { lessons: { some: { teacherId: userId! } } },
        student: { students: { some: { id: userId! } } },
        parent: { students: { some: { parentId: userId! } } }
    }

    const data = await prisma.announcement.findMany({
        take: 3,
        orderBy: { date: 'desc' },
        where: {
            ...(role !== "admin" && {
                OR: [
                    { classId: null },
                    { Class: roleConditions[role as keyof typeof roleConditions] || {} },
                ],
            })
        },
    });



    return (
        <div className='bg-white p-4 rounded-md'>
            <div className='flex items-center justify-between'>
                <h1 className='text-xl font-semibold'>Annoucements</h1>
                <span className='text-xs text-gray-400'>View All</span>
            </div>
            <div className='flex flex-col gap-4 mt-4'>
                {
                    data.length > 0 && data.map((annountment,index)=>(
                        
                        <div key={index} className='bg-sky-100 rounded-md p-4'>
                            <div className='flex items-center justify-between'>
                                <h2 className='font-medium'>{annountment.title}</h2>
                                <span className='text-xs text-gray-400 bg-white rounded-md px-1 py-1'>
                                    {new Intl.DateTimeFormat('en-GB').format(annountment.date)}
                                </span>
                            </div>
                            <p className='text-sm text-gray-400 mt-1'>
                                {annountment.description}
                            </p>
                        </div>
                    
                    ))
                }
            </div>
            
        </div>
    )
}

export default Announcements