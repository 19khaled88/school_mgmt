import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { Prisma, PrismaClient } from '@/generated/prisma'
import { examsData, lessonsData, role, teachersData } from '@/lib/data'
import { ITEM_PER_PAGE } from '@/lib/herlper'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Exam = {
    id: number;
    subjectName: string;
    class: string;
    teacherId: string;
    date: string;
    lesson:{
        subject:{name:string};
        class:{name:string};
        teacher:{name:string};
    } | null;

}

const prisma = new PrismaClient();
const columns = [

    {
        header: 'Subject', accessor: 'subjects',
    },
    {
        header: 'Class', accessor: 'classes', className: 'hidden lg:table-cell',
    },
    {
        header: 'Teacher', accessor: 'teachers', className: 'hidden lg:table-cell',
    },
    {
        header: 'Date', accessor: 'dates', className: 'hidden lg:table-cell',
    },
    {
        header: 'Actions', accessor: 'action',
    }
]

const renderRow = (item: Exam) => {
    
    return (
        <tr key={item.id}>
            <td>{
            item.lesson?.subject.name
            }</td>
            <td className='hidden md:table-cell'>{item.lesson?.class.name}</td>
            <td className='hidden md:table-cell'>{
                item.lesson?.teacher.name
                // teachersData.filter(teacher => (item.teacherId) === String(teacher.teacherId)).map(ls => ls.name).join(', ')
            }</td>
            <td className='hidden md:table-cell'>{item.date}</td>
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

const ExamsListPage = async ({ searchParams, }: { searchParams: { [key: string]: string | undefined } }) => {


    const params = await searchParams;
    const { page, ...queryParams } = params;
    const p = page ? parseInt(page) : 1;
    
    // optional filters an sorting logic 
    const query: Prisma.ExamWhereInput = {};
    const sort: any = [
        {updatedAt:'desc'},
        {createdAt:'desc'}
    ]

    if (queryParams) {

    }

    const [data, count] = await prisma.$transaction([
        prisma.exam.findMany({
            where: query,
            skip:ITEM_PER_PAGE * (p - 1),
            take: ITEM_PER_PAGE,
            orderBy: sort,
            include:{
                lesson:{
                    include:{subject:true,class:true,teacher:true}
                },
                results:true
            }
        }),
        prisma.exam.count({ where: query })
    ])
    return (
        <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
            {/*TOP*/}
            <div className='flex items-center justify-between'>
                <h1 className='hidden md:block text-lg font-semibold'>All Exams</h1>
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
                                <FormModal table='exam' type='create' />
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

export default ExamsListPage