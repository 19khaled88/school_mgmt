import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { Announcement, Class, Lesson, Prisma, Student, Teacher } from '@/generated/prisma'
import { classesData, parentsData, role, studentsData } from '@/lib/data'
import { ITEM_PER_PAGE } from '@/lib/herlper'
import prisma from '@/lib/prisma'
import { getRole } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'



// type ClassList = Class & { lesson: Lesson[] } & { student: Student[] } & { event: Event[] } & { announcement: Announcement[] } & { supervisor: Teacher[] }

type ClassList = {
    id: string
    name: string
    capacity: number
    gradeId: number | null
    supervisorId: string | null
    grade: {
        id: number
        level: string
    } | null
    supervisor: {
        id: string
        name: string
        surname: string
    } | null
    events: Event[]
    announcements: Announcement[]
    lessons: Lesson[]
    students: Student[]

}

const columns = [
    {
        header: 'Class Name', accessor: 'class name',
    },
    {
        header: 'Capacity', accessor: 'capacity', className: 'hidden md:table-cell',
    },
    {
        header: 'Grade', accessor: 'grade', className: 'hidden lg:table-cell',
    },
    {
        header: 'Supervisor', accessor: 'supervisor',
    },
    ...(role === 'admin' ? [{
        header: 'Actions', accessor: 'action',
    }]:[])
]


const renderRow = async (item: ClassList) => {
    // Usage in your component
    const {role} = await getRole();

    return (
        <tr key={`${item.id}`}>
            <td >{item.name}</td>
            <td className='hidden md:table-cell'>{item.capacity}</td>
            <td className='hidden md:table-cell'>{item.grade?.level || 'No grade'}</td>
            <td>{item.supervisor?.name + " " + item.supervisor?.surname}</td>
            <td>
                <div className='flex items-center gap-2'>

                    {
                        role === 'admin' && (
                            <>
                                <Link href={`/list/classes/${item.id}`}>
                                    <FormModal table='class' type='update' data={item} />
                                </Link>
                                <FormModal table='class' type='delete' id={item.id} />
                            </>
                        )
                    }
                </div>
            </td>
        </tr>
    )
}
const ClassesListPage = async ({ searchParams, }: { searchParams: { [key: string]: string | undefined } }) => {

    // Usage in your component
    const {role} = await getRole();

    const params = await searchParams;
    const { page, ...queryParams } = params;
    const p = page ? parseInt(page) : 1;

    const query: Prisma.ClassWhereInput = {};
    const sort: any = [
        { updatedAt: 'desc' },
        { createdAt: 'desc' }
    ]

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'teacherId':
                        query.teacherId = value;
                        break;
                    case "search":
                        query.name = { contains: value, mode: 'insensitive' }
                        break;
                    default:
                        break;
                }
            }
        }
    }

    const [data, count] = await prisma.$transaction([
        prisma.class.findMany({
            where: query,
            include: {
                events: true,
                announcements: true,
                lessons: true,
                students: true,
                supervisor: {
                    select: {
                        id: true,
                        name: true,
                        surname: true
                    }
                },

                grade: {
                    select: {
                        id: true,
                        level: true
                    }
                }
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
            orderBy: sort,
        }),
        prisma.class.count({ where: query })
    ])
    return (
        <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
            {/*TOP*/}
            <div className='flex items-center justify-between'>
                <h1 className='hidden md:block text-lg font-semibold'>All Classes</h1>
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
                                <FormModal table='class' type='create' />
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

export default ClassesListPage