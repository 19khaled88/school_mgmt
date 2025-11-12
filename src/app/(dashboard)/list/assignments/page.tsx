import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { Assignment, Class, Prisma, Subject, Teacher } from '../../../../generated/prisma'
import { assignmentsData, examsData, lessonsData, teachersData } from '@/lib/data'
import { ITEM_PER_PAGE } from '@/lib/herlper'
import { getRole } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import prisma from '@/lib/prisma'

type AssignmentList = Assignment & {
    lesson: {
        subject: Subject;
        class: Class,
        teacher: Teacher
    }
}



const renderRow = async (item: AssignmentList) => {
    // Usage in your component
    const {role} = await getRole();

    return (
        <tr key={item.id} className=''>
            <td  className='' >{item.lesson.subject.name}</td>
            <td  className=' hidden lg:table-cell'>{item.lesson?.class.name}</td>
            <td  className=' hidden lg:table-cell'>{item.lesson?.teacher?.name + " " + item.lesson?.teacher.surname}</td>
            <td  className=' hidden lg:table-cell'>{new Date(item.dueDate).toLocaleDateString()}</td>
            <td  className=''>
                <div className='flex items-center gap-2'>

                    {
                        ( role === 'admin' || role === 'teacher' ) && (
                            <>
                                <Link href={`/list/assignments/${item.id}`}>
                                    <FormModal table='assignment' type='update' data={item} />
                                </Link>
                                <FormModal table='assignment' type='delete' id={item.id} />
                            </>
                        )

                    }
                </div>
            </td>
        </tr>
    )
}

const AssignmentsListPage = async ({ searchParams, }: { searchParams: { [key: string]: string | undefined } }) => {

    // Usage in your component
    const {role,currentUserId} = await getRole();

    const columns = [

        {
            header: 'Subject', accessor: 'subject',
        },
        {
            header: 'Class', accessor: 'classe', className: 'hidden lg:table-cell',
        },
        {
            header: 'Teacher', accessor: 'teacher', className: 'hidden lg:table-cell',
        },
        {
            header: 'Due Date', accessor: 'dueDate', className: 'hidden lg:table-cell',
        },
        ...(role === 'admin' || role === 'teacher' ? [{
            header: 'Actions', accessor: 'action',
        }] : [])
    ]

    const params = await searchParams;
    const { page, ...queryParams } = params;
    const p = page ? parseInt(page) : 1;


    // URL CONDITION
    // optional filters an sorting logic 
    const query: Prisma.AssignmentWhereInput = {};
    const sort: any = [
        { updatedAt: 'desc' },
        { createdAt: 'desc' }
    ]


    query.lesson = {}

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'classId':
                        query.lesson.classId = parseInt(value);
                        break;
                    case 'teacherId':
                        query.lesson.teacherId = value;
                        break;
                    case "search":
                        query.lesson.subject = {name: { contains: value, mode: 'insensitive' }};
                        break;
                    default:
                        break;
                }
            }
        }
    }


    // ROLE CONDITION 
    switch(role){
        case "admin":
            break;
        case 'teacher':
            query.lesson.teacherId = currentUserId!;
        case 'student':
            query.lesson.class ={
                students:{
                    some:{
                        id:currentUserId!,
                    }
                }
            }
            break;
        case 'parent':
            query.lesson.class ={
                students:{
                    some:{
                        parentId:currentUserId!,
                    }
                }
            }
            break;
        default:
            break;
    }


    const [data, count] = await prisma.$transaction([
        prisma.assignment.findMany({
            where: query,
            skip: ITEM_PER_PAGE * (p - 1),
            take: ITEM_PER_PAGE,
            orderBy: sort,
            include: {
                lesson: {
                    // include: {
                    //     class: true,
                    //     teacher: true,
                    // }
                    select: {
                        class: { select: { name: true } },
                        subject: { select: { name: true } },
                        teacher: { select: { name: true, surname: true } },
                    }

                },
                results: true
            }
        }),
        prisma.assignment.count({ where: query })
    ])


    

    return (
        <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
            {/*TOP*/}
            <div className='flex items-center justify-between'>
                <h1 className='hidden md:block text-lg font-semibold'>All Assignments</h1>
                <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
                    <TableSearch />
                    <div className='flex items-center gap-4 self-end'>
                        <button className='w-8 h-8 flex items-center justify-center rounded-full bg-yellow-300'>
                            <Image src="/filter.png" alt='' width={14} height={14} />
                        </button>

                        <button className='w-8 h-8 flex items-center justify-center rounded-full bg-yellow-300'>
                            <Image src="/sort.png" alt='' width={14} height={14} />
                        </button>

                        {
                            (role === 'admin' || role === 'teacher') && (
                                <FormModal table='assignment' type='create' />
                            )
                        }
                    </div>
                </div>
            </div>

            {/*LIST*/}
            <Table columns={columns} renderRow={renderRow} data={data} />
            {/*PAGINATION*/}
            <Pagination page={p} count={count} />

        </div>
    )
}

export default AssignmentsListPage