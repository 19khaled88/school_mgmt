import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { Parent, Prisma, PrismaClient, Student } from '@/generated/prisma'
import { parentsData, role, studentsData } from '@/lib/data'
import { ITEM_PER_PAGE } from '@/lib/herlper'
import { getRole } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

// type Parent = {
//     id: number;
//     name: string;
//     email?: string;
//     students: string[];
//     phone: string;
//     address: string;
// }

type ParentList = Parent & { students: Student[] }

const columns = [
    {
        header: 'Info', accessor: 'info'
    },
    {
        header: 'Students Names', accessor: 'students', className: 'hidden md:table-cell',
    },
    {
        header: 'Phone', accessor: 'phone', className: 'hidden lg:table-cell',
    },
    {
        header: 'Address', accessor: 'address', className: 'hidden lg:table-cell',
    },
    {
        header: 'Actions', accessor: 'action',
    }
]

const prisma = new PrismaClient();

const renderRow = async (item: ParentList) => {
    // return item.students.map((studentId, index) => {
    //     const student = studentsData.find(s => String(s.id) === String(studentId));
    //     const studentName = student ? student.name : 'Unknown';


    // })

    // Usage in your component
    const role = await getRole();

    return (
        <tr key={`${item.id}`}>

            <td>
                <div className='flex flex-col'>
                    <h3 className='font-semibold'>{item.name}</h3>
                    <p className='text-xs text-gray-500'>{item?.email}</p>
                </div>
            </td>
            <td className='hidden md:table-cell'>{
                // studentsData.filter(student => item.students.map(String).includes(String(student.id))).map(student => student.name).join(', ') || "No Students"
                // studentName
                // item.students. parent.student


                // parentsData.filter(parent => parent.id === item.id).flatMap(parent => parent.students).map(studentId => {
                //     const student = studentsData.find(s => String(s.id) === String(studentId));
                //     return student ? student.name : 'Unknown';
                // }).join(', ') || "No Students"


            }</td>
            <td className='hidden md:table-cell'>{item.phone}</td>
            <td className='hidden md:table-cell'>{item.address}</td>
            <td>
                <div className='flex items-center gap-2'>

                    {
                        role === 'admin' && (
                            <>
                                <Link href={`/list/parents/${item.id}`}>
                                    <FormModal table='parent' type='update' data={item} />
                                </Link>
                                <FormModal table='parent' type='delete' id={item.id} />
                            </>
                        )
                    }
                </div>
            </td>
        </tr>
    )
}

const ParentListPage = async ({ searchParams, }: { searchParams: { [key: string]: string | undefined } }) => {

    // Usage in your component
    const role = await getRole();

    const params = await searchParams;
    const { page, ...queryParams } = params;
    const p = page ? parseInt(page) : 1;

    const query: Prisma.ParentWhereInput = {};
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
                    default:
                        break;
                }
            }
        }
    }

    const [data, count] = await prisma.$transaction([
        prisma.parent.findMany({
            where: query,
            include: { students: true },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
            orderBy: sort,
        }),
        prisma.parent.count({ where: query })
    ])


    return (
        <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
            {/*TOP*/}
            <div className='flex items-center justify-between'>
                <h1 className='hidden md:block text-lg font-semibold'>All Parents</h1>
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
                                <FormModal table='parent' type='create' />
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

export default ParentListPage