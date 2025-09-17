import React from 'react'

const Pagination = () => {
  return (
    <div className='p-4 flex items-center justify-between text-gray-500'>
        <button disabled className='by-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed'>Prev</button>
        <div className='flex flex-center gap-2 text-sm'>
            <button className='px-2 rounded-sm bg-blue-200'>1</button>
            <button className='px-2 rounded-sm bg-blue-200'>2</button>
            <button className='px-2 rounded-sm bg-blue-200'>3</button>
        </div>
        <button className='by-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed'>Next</button>
    </div>
  )
}

export default Pagination