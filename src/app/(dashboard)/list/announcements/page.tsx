import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { Prisma, PrismaClient } from '@/generated/prisma'
import { annoucementsData, eventsData, examsData, lessonsData, resultsData, role, studentsData, teachersData } from '@/lib/data'
import { ITEM_PER_PAGE } from '@/lib/herlper'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Event = {
    id: number;
    title: string;
    class: string;
    date: string;
}

const prisma = new PrismaClient();
const columns = [

    {
        header: 'Title', accessor: 'title',
    },
    {
        header: 'Class', accessor: 'classe',
    },
    {
        header: 'Date', accessor: 'dates', className: 'hidden lg:table-cell',
    },
    {
        header: 'Actions', accessor: 'action',
    }
]

const renderRow = (item: Event) => {
    return (
        <tr key={item.id}>
            <td>{item.title}</td>
            <td>{item.class}</td>
            <td className='hidden md:table-cell'>{item.date}</td>
            <td>
                <div className='flex items-center gap-2'>

                    {
                        role === 'admin' && (
                            <>
                                <Link href={`/list/announcements/${item.id}`}>
                                    <FormModal table='announcement' type='update' data={item} />
                                </Link>
                                <FormModal table='announcement' type='delete' id={item.id} />
                            </>
                        )
                    }
                </div>
            </td>
        </tr>
    )
}

const AnnouncementsListPage = async ({ searchParams, }: { searchParams: { [key: string]: string | undefined } }) => {


    const params = await searchParams;
    const { page, ...queryParams } = params;
    const p = page ? parseInt(page) : 1;

    // optional filters an sorting logic 
    const query: Prisma.AnnouncementWhereInput = {};
    const sort: any = [
        {updatedAt:'desc'},
        {createdAt:'desc'}
    ]

    if (queryParams) {

    }

    const [data, count] = await prisma.$transaction([
        prisma.announcement.findMany({
            where: query,
            skip: ITEM_PER_PAGE * (p - 1),
            take: ITEM_PER_PAGE,
            orderBy: sort,
            include: {
                Class: true,
            }
        }),
        prisma.announcement.count({ where: query })
    ])
    return (
        <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
            {/*TOP*/}
            <div className='flex items-center justify-between'>
                <h1 className='hidden md:block text-lg font-semibold'>All Announcements</h1>
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
                                // <button className='w-8 h-8 flex items-center justify-center rounded-full bg-yellow-300'>
                                //     <Image src="/plus.png" alt='' width={14} height={14} />
                                // </button>
                                <FormModal table='announcement' type='create' />
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

export default AnnouncementsListPage