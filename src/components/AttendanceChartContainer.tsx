import Image from 'next/image'
import React from 'react'
import AttendanceChart from './AttendanceChart'
import prisma from '@/lib/prisma'


const AttendanceChartContainer = async () => {

    const today = new Date()
    const dayOfWeek = today.getDay()
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1

    const lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - daysSinceMonday)



    const resData:{date:Date, present:boolean}[] = await prisma.attendance.findMany({
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
    

    const daysOfWeek = ["Mon", "Thu", "Wed", "Thu", "Fri"]

    const attendaceMap: Record<string, { present: number, absent: number }> = {
        Mon: { present: 0, absent: 0 },
        Tue: { present: 0, absent: 0 },
        Wed: { present: 0, absent: 0 },
        The: { present: 0, absent: 0 },
        Fri: { present: 0, absent: 0 },
        Sun: { present: 0, absent: 0 }
    }

    resData.forEach((item)=>{
        const itemDate = new Date(item.date);
        const dayOfWeek = itemDate.getDay();

         const daysOfWeek = ["Mon", "Thu", "Wed", "Thu", "Fri"]
         const dayName = daysOfWeek[dayOfWeek]


        if(dayOfWeek >= 1 && dayOfWeek <=5){
            const dayDame = daysOfWeek[dayOfWeek - 1];
            if(item.present){
                attendaceMap[dayName].present++; // Increment present count
            } else {
                attendaceMap[dayName].absent++; // Increment absent count
            }

            
        }


    })


 
    const data = daysOfWeek.map(day=>{
        const name = day
        const present = attendaceMap[day]?.present ?? 0;
        const absent = attendaceMap[day]?.absent ?? 0;
   
        return {
            name:name,
            present:present,
            absent:absent
        }
    })


     
    // resData.forEach(item => {
    //     const itemDate = new Date(item.date)

    //     if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    //         const dayName = daysOfWeek[dayOfWeek - 1] // ✅ Correct: array access

    //         if (item.present) {
    //             attendaceMap[dayName].present += 1;
    //         } else {
    //             attendaceMap[dayName].absent += 1;
    //         }
    //     }
    // });



    return (
        <div className='bg-white rounded-lg p-4 h-full'>
            <div className='flex justify-between items-center'>
                <h1 className='heading-reset text-lg font-semibold text-black-300'>Attendance</h1>
                <Image src="/moreDark.png" alt='' width={20} height={20} />
            </div>

            <AttendanceChart data={data}/>

        </div>
    )
}

export default AttendanceChartContainer
