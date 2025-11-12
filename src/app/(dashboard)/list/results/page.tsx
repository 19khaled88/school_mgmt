import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { Assignment, Exam, Prisma, PrismaClient } from '@prisma/client'
import { examsData, lessonsData, resultsData, role, studentsData, teachersData } from '@/lib/data'
import { ITEM_PER_PAGE } from '@/lib/herlper'
import { getRole } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Result = {
    id: number;
    title: string;
    studentName: string;
    studentSurname: string;
    teacherName: string;
    teacherSurname: string;
    className: string;
    score: string;
    startTime: Date;
}

type ResultList = Result & { exam: Exam[] } & { assignment: Assignment[] }


const prisma = new PrismaClient()



const renderRow = async (item: ResultList) => {
    // Usage in your component
    const { role } = await getRole();

    return (
        <tr key={item.id}>
            <td>{item.title}</td>
            <td>{item.teacherName + " " + item.teacherSurname}</td>

            <td>{item.studentName + " " + item.studentSurname}</td>
            <td className='hidden md:table-cell'>{item.className}</td>
            <td className='hidden md:table-cell'>{item.score}</td>
            <td className='hidden md:table-cell'>{new Intl.DateTimeFormat("en-US").format(new Date(item.startTime))}</td>
            <td>
                <div className='flex items-center gap-2'>

                    {
                        (role === 'admin' || role === 'teacher') && (
                            <>
                                {/* <Link href={`/list/exams/${item.id}`}>
                                    <button className='w-7 h-7 flex items-center justify-center rounded-full bg-blue-300'>
                                        <Image src="/edit.png" alt='' width={16} height={16} />
                                    </button>
                                </Link>
                                <button className='w-7 h-7 flex items-center justify-center rounded-full bg-purple-300'>
                                    <Image src="/delete.png" alt='' width={16} height={16} />
                                </button> */}
                                <FormModal table='result' type='update' data={item} />
                                <FormModal table='result' type='delete' id={item.id} />
                            </>
                        )
                    }
                </div>
            </td>
        </tr>
    )
}

const ResultsListPage = async ({ searchParams, }: { searchParams: { [key: string]: string | undefined } }) => {
    // Usage in your component
    const { role, currentUserId } = await getRole();



    const columns = [

        {
            header: 'Title', accessor: 'title',
        },

        {
            header: 'Teacher', accessor: 'teacher', className: 'hidden lg:table-cell',
        },
        {
            header: 'Student', accessor: 'student', className: 'hidden lg:table-cell',
        },

        {
            header: 'Class', accessor: 'class',
        },
        {
            header: 'Score', accessor: 'score', className: 'hidden lg:table-cell',
        },
        {
            header: 'Date', accessor: 'date', className: 'hidden lg:table-cell',
        },

        ...(role === 'admin' || role === 'teacher') ? [{
            header: 'Actions', accessor: 'action',
        }] : []
    ]

    const params = await searchParams;
    const { page, ...queryParams } = params;
    const p = page ? parseInt(page) : 1;

    // optional filters an sorting logic 
    const query: Prisma.ResultWhereInput = {};
    const sort: any = [
        { updatedAt: 'desc' },
        { createdAt: 'desc' }
    ]

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'studentId':
                        query.studentId = value;
                        break;
                    case 'search':
                        query.OR = [
                            { exam: { title: { contains: value, mode: 'insensitive' } } },
                            { student: { name: { contains: value, mode: 'insensitive' } } },
                            { assignment: { title: { contains: value, mode: 'insensitive' } } },
                        ];
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
            query.OR = [
                { exam: { lesson: { teacherId: currentUserId! } } },
                { assignment: { lesson: { teacherId: currentUserId! } } },
            ]
            break;
        case 'student':
            query.studentId = currentUserId!
            break;
        case 'parent':
            query.student = {
                parentId: currentUserId!
            }
            break;
        default:
            break;
    }


    const [dataResponse, count] = await prisma.$transaction([
        prisma.result.findMany({
            where: query,
            skip: ITEM_PER_PAGE * (p - 1),
            take: ITEM_PER_PAGE,
            orderBy: sort,
            include: {
                exam: {
                    include: {
                        lesson: {
                            select: {
                                class: { select: { name: true } },
                                teacher: { select: { name: true, surname: true } }
                            }
                        }
                    }
                },
                assignment: {
                    include: {
                        lesson: {
                            select: {
                                class: { select: { name: true } },
                                teacher: { select: { name: true, surname: true } }
                            }
                        }
                    }
                },
                student: true,
            }
        }),
        prisma.result.count({ where: query })
    ])

    
    const data = dataResponse.map((item) => {

        const assessment = item.exam || item.assignment;

        if (!assessment) return null;

        const isExam = "startTime" in assessment;

        return {
            id: item.id,
            title: assessment.title,
            studentName: item.student?.name,
            studentSurname: item.student?.surname,
            teacherName: assessment?.lesson?.teacher.name,
            teacherSurname: assessment?.lesson?.teacher.surname,
            className: assessment?.lesson?.class.name,
            score: item.score,
            startTime: isExam ? assessment.startTime.toISOString().split('T')[0] : assessment.startDate.toISOString().split('T')[0],

        }
    })



    return (
        <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
            {/*TOP*/}
            <div className='flex items-center justify-between'>
                <h1 className='hidden md:block text-lg font-semibold'>All Results</h1>
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
                                <FormModal table='result' type='create' />
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

export default ResultsListPage