import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { Prisma, PrismaClient } from '@/generated/prisma'
import { examsData, lessonsData, resultsData, role, studentsData, teachersData } from '@/lib/data'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Result = {
    id: number;
    subject: string;
    class: string;
    teacher: string;
    student: string;
    type: "exam" | "assignment";
    date: string;
    score: number;
}


const prisma = new PrismaClient()

const columns = [

    {
        header: 'Subject', accessor: 'subject',
    },
    {
        header: 'Class', accessor: 'classe',
    },
    {
        header: 'Teacher', accessor: 'teacher', className: 'hidden lg:table-cell',
    },
    {
        header: 'Type', accessor: 'types', className: 'hidden lg:table-cell',
    },
    {
        header: 'Date', accessor: 'dates', className: 'hidden lg:table-cell',
    },
    {
        header: 'Score', accessor: 'score', className: 'hidden lg:table-cell',
    },
    {
        header: 'Actions', accessor: 'action',
    }
]
const renderRow = (item: Result) => {
    return (
        <tr key={item.id}>
            <td>{item.subject}</td>
            <td>{item.class}</td>
            <td className='hidden md:table-cell'>{
                teachersData.filter(teacher => (item.teacher) === String(teacher.teacherId)).map(ls => ls.name).join(', ')
            }</td>
            <td className='hidden md:table-cell'>{
                studentsData.filter(student => (item.student) === String(student.studentId)).map(ls => ls.name).join(', ')
            }</td>
            <td className='hidden md:table-cell'>{item.date}</td>
            <td className='hidden md:table-cell'>{item.score}</td>
            <td>
                <div className='flex items-center gap-2'>
                    <Link href={`/list/exams/${item.id}`}>
                        <button className='w-7 h-7 flex items-center justify-center rounded-full bg-blue-300'>
                            <Image src="/edit.png" alt='' width={16} height={16} />
                        </button>
                    </Link>
                    {
                        role === 'admin' && (
                            <button className='w-7 h-7 flex items-center justify-center rounded-full bg-purple-300'>
                                <Image src="/delete.png" alt='' width={16} height={16} />
                            </button>
                        )
                    }
                </div>
            </td>
        </tr>
    )
}

const ResultsListPage = async ({ searchParams, }: { searchParams: { [key: string]: string | undefined } }) => {
    const params = await searchParams;
    const { page, ...queryParams } = params;
    const p = page ? parseInt(page) : 1;

    const query: Prisma.ResultWhereInput = {};


    if (queryParams) { 

    }

    const [data, count] = await prisma.$transaction([ 
        prisma.result.findMany({

        }),
        prisma.result.count({ where: query })
    ])
    return (
        <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
            {/*TOP*/}
            <div className='flex items-center justify-between'>
                <h1 className='hidden md:block text-lg font-semibold'>All Results</h1>
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
                                <FormModal table='result' type='create' />
                            )
                        }
                    </div>
                </div>
            </div>

            {/*LIST*/}
            <Table columns={columns} renderRow={renderRow} data={resultsData} />
            {/*PAGINATION*/}
            <Pagination page={p} count={count}/>

        </div>
    )
}

export default ResultsListPage