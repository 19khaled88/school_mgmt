import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { Prisma, PrismaClient } from '@/generated/prisma'
import { assignmentsData, examsData, lessonsData, role, teachersData } from '@/lib/data'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Assignment = {
    id: number;
    subjectName: string;
    class: string;
    teacherId: string;
    due_date: string;
}

const prisma = new PrismaClient();
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
    {
        header: 'Actions', accessor: 'action',
    }
]

const renderRow = (item: Assignment) => {
    return (
        <tr key={item.id}>
            <td >{item.subjectName}</td>
            <td className='hidden md:table-cell'>{item.class}</td>
            <td className='hidden md:table-cell'>{
                teachersData.filter(teacher => (item.teacherId) === String(teacher.teacherId)).map(ls => ls.name).join(', ')
            }</td>
            <td className='hidden md:table-cell'>{item.due_date}</td>
            <td>
                <div className='flex items-center gap-2'>

                    {
                        role === 'admin' && (
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

    const params = await searchParams;
    const { page, ...queryParams } = params;
    const p = page ? parseInt(page) : 1;

    const query: Prisma.AssignmentWhereInput = {};

    if (queryParams) {

    }

    const [data, count] = await prisma.$transaction([
        prisma.exam.findMany({

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
                            role === 'admin' && (
                                <FormModal table='assignment' type='create' />
                            )
                        }
                    </div>
                </div>
            </div>

            {/*LIST*/}
            <Table columns={columns} renderRow={renderRow} data={assignmentsData} />
            {/*PAGINATION*/}
            <Pagination page={p} count={count} />

        </div>
    )
}

export default AssignmentsListPage