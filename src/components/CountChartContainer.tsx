import Image from 'next/image';
import React from 'react'
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';
import CountChart from './CountChart';
import prisma from '@/lib/prisma';

const CountChartContainer = async () => {

    const data = await prisma.student.groupBy({ by:['sex'],_count:true})

    
    const boys = data.find((d:any)=>d.sex === 'MALE')?._count || 0;
    const girls = data.find((d:any)=>d.sex === 'FEMALE')?._count || 0;

    return (
        <div className='bg-white rounded-xl w-full h-full p-4'>
            {/*TITLE*/}
            <div className='flex justify-between items-center'>
                <h1 className="heading-reset text-lg font-semibold">Student</h1>
                <Image src="/moreDark.png" alt='' width={20} height={20} />
            </div>

            {/*CHART*/}
            <CountChart boys={boys} girls={girls}/>
            {/*BOTTOM*/}
            <div className='flex justify-center gap-16'>
                <div className='flex flex-col gap-1'>
                    <div className='w-5 h-5 bg-blue-200 rounded-full'>

                    </div>
                    <h1 className='heading-reset font-bold text-xl'>{boys}</h1>
                    <h2 className='text-xs text-black-300'>Boys ({Math.round(boys / (boys + girls) * 100)}%)</h2>
                </div>
                <div className='flex flex-col gap-1'>
                    <div className='w-5 h-5 bg-yellow-200 rounded-full'>

                    </div>
                    <h1 className='heading-reset font-bold text-xl'>{girls}</h1>
                    <h2 className='text-xs text-black-300'>Girls ({Math.round(girls / (boys + girls) * 100)}%)</h2>
                </div>
            </div>
        </div>
    )
}

export default CountChartContainer
