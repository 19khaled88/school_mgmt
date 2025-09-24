'use client'
import React from 'react'
import {PieChart, Pie, Sector, Cell, ResponsiveContainer} from 'recharts'

const data =[
    {name:'Group A', value:88,fill:'#c3ebfa'},
    {name:'Group B', value:12,fill:'#fae27c'}
    
]
const Performance = () => {
  return (
    <div className='bg-white b-4 rounded-md h-80'>
        <div className='flex items-center justify-between'>
            <h1>
                
            </h1>
        </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
            <Pie 
                dataKey="value"
                startAngle={180}
                endAngle={0}
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill='#8884d8'
                label
            />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Performance
