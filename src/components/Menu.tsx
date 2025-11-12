'use client'
import { role } from '@/lib/data'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const menuItems = [
    {
        title: 'MENU',
        items: [
            {
                icon: '/home.png',
                label: 'Home',
                href: '/',
                visible: ['admin', 'teacher', 'student', 'parent']
            },
            {
                icon: '/teacher.png',
                label: 'Teachers',
                href: '/list/teachers',
                visible: ['admin', 'teacher']
            },
            {
                icon: '/student.png',
                label: 'Students',
                href: '/list/students',
                visible: ['admin', 'teacher']
            },
            {
                icon: '/parent.png',
                label: 'Parents',
                href: '/list/parents',
                visible: ['admin', 'teacher', 'parent']
            },
            {
                icon: '/subject.png',
                label: 'Subjects',
                href: '/list/subjects',
                visible: ['admin', 'teacher', 'parent']
            },
            {
                icon: '/class.png',
                label: 'Classes',
                href: '/list/classes',
                visible: ['admin', 'teacher', 'student']
            },
            {
                icon: '/lesson.png',
                label: 'Lessons',
                href: '/list/lessons',
                visible: ['admin', 'teacher', 'student']
            },
            {
                icon: '/exam.png',
                label: 'Exams',
                href: '/list/exams',
                visible: ['admin', 'teacher', 'student']
            },
            {
                icon: '/assignment.png',
                label: 'Assignments',
                href: '/list/assignments',
                visible: ['admin', 'teacher', 'student', 'parent']
            },
            {
                icon: '/result.png',
                label: 'Results',
                href: '/list/results',
                visible: ['admin', 'teacher', 'student', 'parent']
            },
            {
                icon: '/attendance.png',
                label: 'Attendance',
                href: '/list/attendance',
                visible: ['admin', 'teacher', 'student', 'parent']
            },
            {
                icon: '/calendar.png',
                label: 'Events',
                href: '/list/events',
                visible: ['admin', 'teacher', 'student', 'parent']
            },
            {
                icon: '/message.png',
                label: 'Messages',
                href: '/list/messages',
                visible: ['admin', 'teacher', 'student', 'parent']
            },
            {
                icon: '/announcement.png',
                label: 'Announcements',
                href: '/list/announcements',
                visible: ['admin', 'teacher', 'student', 'parent']
            }
        ]
    },
    {
        title: 'OTHER',
        items: [
            {
                icon: "/profile.png",
                label: 'Profile',
                href: '/profile',
                visible: ['admin', 'teacher', 'student', 'parent']
            },
            {
                icon: '/setting.png',
                label: 'Settings',
                href: '/settings',
                visible: ['admin', 'teacher', 'student', 'parent']
            },
            {
                icon: '/logout.png',
                label: 'Logout',
                href: '/logout',
                visible: ['admin', 'teacher', 'student', 'parent']
            }
        ]
    }
]
const Menu = () => {
    const { user, isLoaded } = useUser();

    // get role from user's public metadata 
    const role = user?.publicMetadata?.role as string;

    

    // show loading state while clerk is loading
    if (!isLoaded) {
        return (
            <div className='mt-4 text-sm'>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2">
                        <div className="animate-pulse bg-gray-200 rounded-md w-5 h-5"></div>
                        <span className="hidden lg:block bg-gray-200 rounded h-4 w-20 animate-pulse"></span>
                    </div>
                </div>
            </div>
        );
    }

    // If no user or role, show basic menu or redirect
    if (!user || !role) {
        return (
            <div className='mt-4 text-sm'>
                <div className="flex flex-col gap-2">
                    <Link href="/" className='flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-blue-200'>
                        <>
                            <Image src="/home.png" alt='Home' width={20} height={20} />
                            <span className='hidden lg:block'>Home</span>
                        </>
                    </Link>
                    <Link href="/login" className='flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-blue-200'>
                        <Image src="/logout.png" alt='Login' width={20} height={20} />
                        <span className='hidden lg:block'>Login</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className='mt-4 text-sm'>
            {
                menuItems.map(i => (
                    <div className='flex flex-col gap-2' key={i.title}>
                        <span className='hidden lg:block text-gray-400 font-light my-4'>
                            {i.title}
                        </span>
                        {
                            i.items.map((item) => {
                                if (item.visible?.includes(role)) {
                                    return (
                                        <Link href={item.href} key={item.label} className='flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-blue-200'>
                                            <Image src={item.icon} alt='' width={20} height={20} />
                                            <span className='hidden lg:block'>{item.label}</span>
                                        </Link>
                                    )
                                }
                            })
                        }
                    </div>
                ))
            }
        </div>
    )
}

export default Menu
