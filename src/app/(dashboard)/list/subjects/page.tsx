import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { Prisma, Subject, Teacher } from '@/generated/prisma'
import { parentsData, role, studentsData, subjectsData, teachersData } from '@/lib/data'
import { ITEM_PER_PAGE } from '@/lib/herlper'
import { getRole } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import prisma from '@/lib/prisma'

// type Subject = {
//     id: number;
//     name: string;
//     teachers: string[];

// }

type SubjectList = Subject & { teachers: Teacher[] }
const columns = [

    {
        header: 'Subjects', accessor: 'names', className: 'hidden md:table-cell',
    },
    {
        header: 'Teachers', accessor: 'teachers', className: 'hidden md:table-cell',
    },
    {
        header: 'Actions', accessor: 'action',
    }
]



const renderRow = async (item: SubjectList) => {
    // return item.teachers.map((teacherName, index) => {
    //     const teacher = teachersData.find(s => String(s.name) === String(teacherName));
    //     const teacher_Name = teacher ? teacher.name : 'Unknown';

    // })


    // Usage in your component
    const {role} = await getRole();

    return (
        <tr key={`${item.id}`}>
            <td>
                <div className='flex flex-col'>
                    <h3 className='font-semibold'>{item.name}</h3>

                </div>
            </td>
            <td className='hidden md:table-cell'>{
                // studentsData.filter(student => item.students.map(String).includes(String(student.id))).map(student => student.name).join(', ') || "No Students"
                // teacher_Name
                item.teachers.map((teacher:any) => teacher.name).join(',')
            }</td>

            <td>
                <div className='flex items-center gap-2'>
                    {/* <Link href={`/list/subjects/${item.id}`}>
                        <button className='w-7 h-7 flex items-center justify-center rounded-full bg-blue-300'>
                            <Image src="/edit.png" alt='' width={16} height={16} />
                        </button>
                    </Link> */}

                    {/*Replace link with formModal for update*/}
                    <FormModal table='subject' type='update' data={{
                        id: item.id,
                        name: item.name, 
                        teachers: item.teachers.map((teacher:any) => teacher.id)
                    }} />

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

const SubjectListPage = async ({ searchParams, }: { searchParams: { [key: string]: string | undefined } }) => {
    // Usage in your component
    const {role} = await getRole();

    const params = await searchParams;
    const { page, ...queryParams } = params;
    const p = page ? parseInt(page) : 1;

    const query: Prisma.SubjectWhereInput = {};
    const sort: any = [
        { updatedAt: 'desc' },
        { createdAt: 'desc' }
    ]

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {

                    case "search":
                        query.name = { contains: value, mode: 'insensitive' }
                        break;
                }
            }
        }
    }

    const [data, count] = await prisma.$transaction([
        prisma.subject.findMany({
            where: query,
            include: {
                teachers: true
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
            orderBy: sort,
        }),
        prisma.subject.count({ where: query })
    ])
    return (
        <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
            {/*TOP*/}
            <div className='flex items-center justify-between'>
                <h1 className='hidden md:block text-lg font-semibold'>All Subjects</h1>
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
                                <FormModal table='subject' type='create' />
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

export default SubjectListPage