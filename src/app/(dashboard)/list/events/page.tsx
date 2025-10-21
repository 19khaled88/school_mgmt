import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { Class, Event, Prisma, PrismaClient } from '@/generated/prisma'
import { eventsData, examsData, lessonsData, resultsData, role, studentsData, teachersData } from '@/lib/data'
import { ITEM_PER_PAGE } from '@/lib/herlper'
import { getRole } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

// type Event = {
//     id: number;
//     title: string;
//     class: string;
//     date: string;
//     startTime: string;
//     endTime: string;
// }

type EventList = Event & { Class: Class }

const prisma = new PrismaClient();
const columns = [

    {
        header: 'Title', accessor: 'title',
    },
    {
        header: 'Class', accessor: 'class',
    },
    {
        header: 'Date', accessor: 'dates', className: 'hidden lg:table-cell',
    },
    {
        header: 'Start Date', accessor: 'startDate', className: 'hidden lg:table-cell',
    },
    {
        header: 'End Date', accessor: 'endDate', className: 'hidden lg:table-cell',
    },
    {
        header: 'Actions', accessor: 'action',
    }
]

const renderRow = async(item: EventList) => {
    // Usage in your component
    const role = await getRole();

    return (
        <tr key={item.id}>
            <td>{item.title}</td>
            <td>{item.Class.name}</td>
            <td className='hidden md:table-cell'>{new Intl.DateTimeFormat('en-US').format(new Date(item.startTime))}</td>
            <td className='hidden md:table-cell'>{item.startTime.toLocaleTimeString("en-US", {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            })}</td>
            <td className='hidden md:table-cell'>{item.endTime.toLocaleTimeString("en-US", {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            })}</td>

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

const EventListPage = async ({ searchParams, }: { searchParams: { [key: string]: string | undefined } }) => {

    // Usage in your component
    const role = await getRole();
    

    const params = await searchParams;
    const { page, ...queryParams } = params;
    const p = page ? parseInt(page) : 1;

    // optional filters an sorting logic
    const query: Prisma.EventWhereInput = {};
    const sort: any = [
        { updatedAt: 'desc' },
        { createdAt: 'desc' }
    ]

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'search':
                        query.OR = [
                            { title: { contains: value, mode: 'insensitive' } },
                            { Class: { name: { contains: value, mode: 'insensitive' } } },
                        ];
                        break;
                    default:
                        break;
                }
            }
        }
    }


    const [data, count] = await prisma.$transaction([
        prisma.event.findMany({
            where: query,
            skip: ITEM_PER_PAGE * (p - 1),
            take: ITEM_PER_PAGE,
            orderBy: sort,
            include: {
                Class: {
                    select: {
                        name: true
                    }
                }
            }
        }),
        prisma.event.count({ where: query })
    ])

    return (
        <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
            {/*TOP*/}
            <div className='flex items-center justify-between'>
                <h1 className='hidden md:block text-lg font-semibold'>All Events</h1>
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
                                <FormModal table='event' type='create' />
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

export default EventListPage