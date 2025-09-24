import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { annoucementsData, eventsData, examsData, lessonsData, resultsData, role, studentsData, teachersData } from '@/lib/data'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Event = {
    id: number;
    title: string;
    class: string;
    date: string;
}

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


const AnnouncementsListPage = () => {
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
            <Table columns={columns} renderRow={renderRow} data={annoucementsData} />
            {/*PAGINATION*/}
            <Pagination />

        </div>
    )
}

export default AnnouncementsListPage