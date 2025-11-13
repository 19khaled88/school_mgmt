import prisma from '@/lib/prisma'
import React from 'react'

const EventList = async ({ dateParams }: { dateParams: string | undefined }) => {

    // If no dateParams — don't query Prisma yet
    if (!dateParams) {
        return (
            <div className="text-gray-400 text-sm">
                Please select a date to view events.
            </div>
        );
    }


    const baseDate = dateParams ? new Date(dateParams) : new Date();

    // Create *separate copies* to avoid mutation
    const startOfDay = new Date(baseDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(baseDate);
    endOfDay.setHours(23, 59, 59, 999);

    const data = await prisma.event.findMany({
        where: {
            startTime: {
                gte: startOfDay,
                lte: endOfDay,
            }
        }
    });

  

    if (data.length === 0) {
        return (
            <div className="text-gray-400 text-sm">
                No events found for {baseDate.toDateString()}.
            </div>
        );

    }

     return (
            <>
                {
                    data.map(event => (
                        <div className='p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-blue-500 even:border-t-purple-500' key={event.id}>
                            <div className='flex items-center justify-between'>
                                <h1 className='font-semibold text-gray-600'>{event.title}</h1>
                                <span className='text-gray-300 text-xs'>{event.startTime.toLocaleDateString("en-GB", {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                })}</span>
                            </div>
                            <p className='mt-2 text-gray-400 text-sm'>{event.description}</p>
                        </div>
                    ))
                }
            </>
        )

}

export default EventList
