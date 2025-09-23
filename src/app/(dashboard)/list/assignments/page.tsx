import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { assignmentsData, examsData, lessonsData, role, teachersData } from '@/lib/data'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Assignment = {
    id: number;
    subjectName: string;
    class: string;
    teacherId: string;
    due_date:string;
}

const columns = [
    
    {
        header: 'Subject', accessor: 'subject', 
    },
    {
        header: 'Class', accessor: 'classe', className: 'hidden lg:table-cell',
    },
    {
        header: 'Teacher', accessor: 'teacher', className:'hidden lg:table-cell',
    },
    {
        header: 'Due Date', accessor: 'dueDate', className:'hidden lg:table-cell',
    },
    {
        header: 'Actions', accessor: 'action',
    }
]


const AssignmentsListPage = () => {
    const renderRow = (item: Assignment) => {  
      return (
            <tr key={item.id}>
                <td >{item.subjectName}</td>
                <td className='hidden md:table-cell'>{item.class}</td>
                <td className='hidden md:table-cell'>{
                    teachersData.filter(teacher=>(item.teacherId) === String(teacher.teacherId)).map(ls =>ls.name).join(', ')   
                }</td>
                <td className='hidden md:table-cell'>{item.due_date}</td>
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
                                <button className='w-8 h-8 flex items-center justify-center rounded-full bg-yellow-300'>
                                    <Image src="/plus.png" alt='' width={14} height={14} />
                                </button>
                            )
                        }
                    </div>
                </div>
            </div>

            {/*LIST*/}
            <Table columns={columns} renderRow={renderRow} data={assignmentsData} />
            {/*PAGINATION*/}
            <Pagination />

        </div>
    )
}

export default AssignmentsListPage