import Image from 'next/image'
import React from 'react'
import AttendanceChart from './AttendanceChart'
import prisma from '@/lib/prisma'


type AttendanceRecord = {
    date: Date;
    present: boolean;
};

type AttendanceSummary = {
    present: number;
    absent: number;
}



const AttendanceChartContainer = async () => {

    const today = new Date()
    const dayOfWeek = today.getDay()
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1

    const lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - daysSinceMonday)



    const resData: AttendanceRecord[] = await prisma.attendance.findMany({
        where: {
            date: {
                gte: lastMonday,
            },
        },
        select: {
            date: true,
            present: true
        }
    });


    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sun"] as const;

    const attendanceMap: Record<(typeof daysOfWeek)[number], AttendanceSummary> = {
        Mon: { present: 0, absent: 0 },
        Tue: { present: 0, absent: 0 },
        Wed: { present: 0, absent: 0 },
        Thu: { present: 0, absent: 0 },
        Fri: { present: 0, absent: 0 },
        Sun: { present: 0, absent: 0 }
    }

    resData.forEach((item) => {
        const dayOfWeek = new Date(item.date).getDay();
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            const dayName = daysOfWeek[dayOfWeek - 1];

            if (item.present) {
                attendanceMap[dayName].present++; // Increment present count
            } else {
                attendanceMap[dayName].absent++; // Increment absent count
            }
        }
    })


    // Convert map into chart-friendly array
    const data = daysOfWeek.map((day) => ({
        name: day,
        present: attendanceMap[day].present,
        absent: attendanceMap[day].absent,
    }));


    return (
        <div className='bg-white rounded-lg p-4 h-full'>
            <div className='flex justify-between items-center'>
                <h1 className='heading-reset text-lg font-semibold text-black-300'>Attendance</h1>
                <Image src="/moreDark.png" alt='' width={20} height={20} />
            </div>

            <AttendanceChart data={data} />

        </div>
    )
}

export default AttendanceChartContainer
