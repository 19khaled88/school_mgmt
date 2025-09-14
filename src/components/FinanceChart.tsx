'use client'
import React from 'react'
import Image from 'next/image';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
    {
        name: 'Jan',
        income: '3400',
        expense: '4300',
    },
    {
        name: 'Feb',
        income: '4200',
        expense: '3800',
    },
    {
        name: 'Mar',
        income: '5100',
        expense: '4500',
    },
    {
        name: 'Apr',
        income: '3800',
        expense: '4200',
    },
    {
        name: 'May',
        income: '4700',
        expense: '3900',
    },
    {
        name: 'Jun',
        income: '5300',
        expense: '4800',
    },
    {
        name: 'Jul',
        income: '4900',
        expense: '5100',
    },
    {
        name: 'Aug',
        income: '5600',
        expense: '4700',
    },
    {
        name: 'Sep',
        income: '4400',
        expense: '4600',
    },
    {
        name: 'Oct',
        income: '5200',
        expense: '4400',
    },
    {
        name: 'Nov',
        income: '4800',
        expense: '4900',
    },
    {
        name: 'Dec',
        income: '6100',
        expense: '5300',
    }
];

const FinanceChart = () => {
    return (
        <div className='bg-white rounded-xl w-full h-full p-4'>
            {/*TITLE*/}
            <div className='flex justify-between items-center'>
                <h1 className='text-lg font-semibold'>Finance</h1>
                <Image src="/moreDark.png" alt='' width={20} height={20} />
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart width={500} height={300} data={data} margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                }}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#ddd' />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tick={{ fill: '#d1d5db' }}
                        tickLine={false}
                        tickMargin={20}
                    />
                    <YAxis axisLine={false} tick={{ fill: '#d1d5db' }} tickLine={false} />
                    <Tooltip />
                    <Legend 
                      align='center'
                      verticalAlign='top'
                      wrapperStyle={{paddingTop:'10px', paddingBottom:'30px'}}
                    />
                    <Line
                        type="monotone"
                        dataKey="income"
                        stroke='#8884d8'
                        strokeWidth={5}
                    />
                    <Line type="monotone" dataKey="expense" stroke='#82ca9d' strokeWidth={5}/>
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default FinanceChart
