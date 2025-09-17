'use client'
import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar'
import moment from 'moment'
import { calendarEvents } from '@/lib/data'

import "react-big-calendar/lib/css/react-big-calendar.css"
import { useState } from 'react'

const localizer = momentLocalizer(moment)

const BigCalendar = () => {
    const [view, setView] = useState<View>(Views.WORK_WEEK);
    const handleOnChangeView = (selectedView: View) => {
        setView(selectedView)
    }
    return (
        <div>
            <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                titleAccessor={event => event.title || "No Title"}
                views={[Views.WORK_WEEK, Views.DAY]}
                view={view}
                onView={handleOnChangeView}
                defaultDate={new Date(2024, 7, 12)} // 👈 Show August 2024 events
                style={{ height: '98vh' }}
                min={new Date(2025, 7, 12, 8, 0, 0)}
                max={new Date(2025, 7, 12, 17, 0, 0)}
            />
        </div>
    )
}

export default BigCalendar