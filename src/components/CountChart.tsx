import React from 'react'
'use clinet'
import Image from 'next/image';
import {RadialBarChart, RadialBar, Legend,ResponsiveContainer} from 'recharts' ;



const data =[
    {
        name:'18-24',
        uv:31.47,
        pv:2400,
        fill:'#8884d8',
    },
    {
        name:'25-29',
        uv:26.69,
        pv:4567,
        fill:'#83a6ed',
    },
    {
        name:'30-34',
        uv:15.69,
        pv:1394,
        fill:'#8dd1e1',
    },
]

const CountChart = () => {
  return (
    <div className=''>
    {/*TITLE*/}
    <div className=''>
        <h1 className=''>Student</h1>
        <Image src="more.png" alt='' width={25} height={25} />
    </div>

    {/*CHART*/}
    <div className=''></div>
    </div>
  )
}

export default CountChart
