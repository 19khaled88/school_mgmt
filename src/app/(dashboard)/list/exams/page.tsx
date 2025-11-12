import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { Class, Exam, Prisma, PrismaClient, Subject, Teacher } from '@/generated/prisma'
import { examsData, lessonsData, role, teachersData } from '@/lib/data'
import { ITEM_PER_PAGE } from '@/lib/herlper'
import { getRole } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'


type ExamList = Exam & {
    lesson: {
        subject: Subject;
        class: Class;
        teacher: Teacher;
    }
}

const prisma = new PrismaClient();


const renderRow = async (item: ExamList) => {
    // Usage in your component
    const { role } = await getRole();

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
            <td className='hidden md:table-cell'>{
                // new Date(item.startTime).toLocaleDateString()} - {new Date(item.endTime).toLocaleDateString()
                new Intl.DateTimeFormat('en-US').format(new Date(item.startTime))
            }</td>

            <td>
                <div className='flex items-center gap-2'>

                    {
                        (role === 'admin' || role === 'teacher') && (
                            <>
                                <Link href={`/list/exams/${item.id}`}>
                                    <button className='w-7 h-7 flex items-center justify-center rounded-full bg-blue-300'>
                                        <Image src="/edit.png" alt='' width={16} height={16} />
                                    </button>
                                </Link>
                                <button className='w-7 h-7 flex items-center justify-center rounded-full bg-purple-300'>
                                    <Image src="/delete.png" alt='' width={16} height={16} />
                                </button>
                            </>
                        )
                    }
                </div>
            </td>
        </tr>
    )
}

const ExamsListPage = async ({ searchParams, }: { searchParams: { [key: string]: string | undefined } }) => {

    // Usage in your component
    const { role ,currentUserId} = await getRole();

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
        ...(role === 'admin' ? [{
            header: 'Actions', accessor: 'action',
        }] : [])
    ]

    const params = await searchParams;
    const { page, ...queryParams } = params;
    const p = page ? parseInt(page) : 1;

    // optional filters an sorting logic 
    const query: Prisma.ExamWhereInput = {};
    const sort: any = [
        { updatedAt: 'desc' },
        { createdAt: 'desc' }
    ]

    query.lesson = {};
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'classId':
                        query.lesson.classId= parseInt(value);
                        break;
                    case 'teacherId':
                        query.lesson.teacherId= value;
                        break;
                    case "search":
                        query.lesson.subject= {
                                name: { contains: value, mode: 'insensitive' }
                            }
                        break;
                    default:
                        break;
                }
            }
        }
    }

    // ROLE CONDITION 
    switch (role) {
        case 'admin':
            
            break;
        case 'teacher':
            query.lesson.teacherId = currentUserId!;
            break;
        case 'student':
            query.lesson.class = {
                students:{
                    some:{
                        id:currentUserId!
                    }
                }
            }
            break;
        case 'parent':
            query.lesson.class ={
                students:{
                    some:{
                        parentId:currentUserId!
                    }
                }
            }
            break;
        default:
            break;
    }

    const [data, count] = await prisma.$transaction([
        prisma.exam.findMany({
            where: query,
            skip: ITEM_PER_PAGE * (p - 1),
            take: ITEM_PER_PAGE,
            orderBy: sort,
            include: {
                lesson: {
                    // include:{subject:true,class:true,teacher:true}
                    select: {
                        subject: { select: { name: true } },
                        class: { select: { name: true } },
                        teacher: { select: { name: true, surname: true } },
                    }
                },
                results: true
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
                            (role === 'admin' || role === 'teacher') && (
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