'use client'
import React from 'react'
import Image from 'next/image';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';



const CountChart = ({ boys, girls }: { boys: number; girls: number }) => {

    const data = [
    {
        name: 'Totals',
        count: boys + girls,
        fill: 'white',
    },
    {
        name: 'Girls',
        count: girls,
        fill: '#f7e9a8',
    },
    {
        name: '25-29',
        count: boys,
        fill: '#c5d8fa',
    }
]
    return (
        < div className='w-full h-[75%] relative' >
            <ResponsiveContainer>
                <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="100%" barSize={32} data={data}>
                    <RadialBar
                        label={{ position: "insideStart", fill: "#fff" }}
                        background
                        dataKey="count"
                    />

                </RadialBarChart>
            </ResponsiveContainer>
            <Image src="/maleFemale.png" alt='' width={50} height={50} className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
        </div >
    )
}

export default CountChart
