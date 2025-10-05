import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { Prisma, Lesson, PrismaClient, Subject, Class, Teacher } from '@/generated/prisma'
import { lessonsData, role, teachersData } from '@/lib/data'
import { ITEM_PER_PAGE } from '@/lib/herlper'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

// type Lesson = {
//     id: number;
//     subjectName: string;
//     class: string;
//     teacherId: string;
// }

const prisma = new PrismaClient();
// type LessonList = Lesson & {subject:{id:string,name:string}} & {class:{id:string,name:string}}
type LessonList = Lesson & { subject: Subject } & { class: Class } & { teacher: Teacher }

const columns = [

    {
        header: 'Subject Names', accessor: 'subjects',
    },
    {
        header: 'Class', accessor: 'classes', className: 'hidden lg:table-cell',
    },
    {
        header: 'Teacher', accessor: 'teachers', className: 'hidden lg:table-cell',
    },
    {
        header: 'Actions', accessor: 'action',
    }
]


const renderRow = (item: LessonList) => {
  console.log(item)
    return (
        <tr key={item.id}>
            <td>{
                item.subject.name
            }</td>
            <td className='hidden md:table-cell'>{
                item.class.name
            }</td>
            <td className='hidden md:table-cell'>{
                // teachersData.filter(teacher=>(item.teacherId) === String(teacher.id)).map(ls =>ls.name).join(', ') 
                item.teacherId
            }</td>
            <td>
                <div className='flex items-center gap-2'>
                    <Link href={`/list/lessons?${item.id}`}>
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
const LessonListPage = async ({ searchParams, }: { searchParams: { [key: string]: string | undefined } }) => {

    const { page, ...queryParams } = searchParams;
    const p = page ? parseInt(page) : 1;

    const query: Prisma.LessonWhereInput = {};

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'classId':
                        query.classId = parseInt(value);
                        break;
                    case 'teacherId':
                        query.teacherId = value;
                        break;
                    case "search":
                        // query.name = { contains: value, mode: 'insensitive' }
                        query.OR = [
                            { subject: { name: { contains: value, mode: 'insensitive' } } },
                            { teacher: { name: { contains: value, mode: 'insensitive' } } }
                        ];
                        break;
                    default:
                        break;
                }
            }
        }
    }
    const [data, count] = await prisma.$transaction([
        prisma.lesson.findMany({
            where: query,
            include: {
                assignments: true,
                attendances: true,
                subject: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                class: {
                    select: {
                        id: true,
                        name: true
                    }
                },

            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
        }),
        prisma.lesson.count({ where: query })
    ])

    return (
        <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
            {/*TOP*/}
            <div className='flex items-center justify-between'>
                <h1 className='hidden md:block text-lg font-semibold'>All Lessons</h1>
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
                                <FormModal table='lesson' type='create' />
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

export default LessonListPage