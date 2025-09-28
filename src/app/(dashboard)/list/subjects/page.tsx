import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { parentsData, role, studentsData, subjectsData, teachersData } from '@/lib/data'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Subject = {
    id: number;
    name: string;
    teachers: string[];
    
}

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


const SubjectListPage = () => {
    const renderRow = (item: Subject) => {
        return item.teachers.map((teacherName, index) => {
            const teacher = teachersData.find(s => String(s.name) === String(teacherName));
            const teacher_Name = teacher ? teacher.name : 'Unknown';
            return (
                <tr key={`${item.id} - ${index}`}>
                    <td>
                        <div className='flex flex-col'>
                            <h3 className='font-semibold'>{item.name}</h3>
                            
                        </div>
                    </td>
                    <td className='hidden md:table-cell'>{
                        // studentsData.filter(student => item.students.map(String).includes(String(student.id))).map(student => student.name).join(', ') || "No Students"
                        teacher_Name
                    }</td>
                    
                    <td>
                        <div className='flex items-center gap-2'>
                            <Link href={`/list/subjects/${item.id}`}>
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
        })
    }
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
                                <FormModal table='subject' type='create'  />
                                
                            )
                        }
                    </div>
                </div>
            </div>

            {/*LIST*/}
            <Table columns={columns} renderRow={renderRow} data={subjectsData} />
            {/*PAGINATION*/}
            <Pagination />

        </div>
    )
}

export default SubjectListPage