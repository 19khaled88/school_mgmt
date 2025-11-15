import { auth } from "@clerk/nextjs/server";

export const getRole = async()=>{
    const { userId,sessionClaims } =await auth();
    return {
        role :(sessionClaims?.metadata as { role?: string })?.role,
        currentUserId : userId
    }
}

const currentWorkWeek = () =>{
    
    const currentDate = new Date();
    

    // Get the current day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const currentDay = currentDate.getDay();


    // Get the current date of the month like, 16th June 2024 => 16
    const get_Date = currentDate.getDate();

    // Calculate start of week ( Monday )
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(get_Date - (currentDay === 0 ? 6 : currentDay - 1)); // Adjust for Sunday
    startOfWeek.setHours(0, 0, 0, 0); // Set to start of the day

    // Calculate end of week ( Sunday )
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999); // Set to end of the day

    return {startOfWeek,endOfWeek}; 
}


export const adjustScheduleToCurrentWeek=(
    lessons:{title:string;start:Date;end:Date}[]
):{title:string;start:Date;end:Date}[]=>{

    const {startOfWeek,endOfWeek} = currentWorkWeek();

    return lessons.map(lesson=>{
        const lessionDayOfWeek = lesson.start.getDay(); // 0 (Sun) to 6 (Sat)

        const daysFromMonday = lessionDayOfWeek === 0 ? 6 : lessionDayOfWeek - 1;

        const adjustedStartDate = new Date(startOfWeek);
        adjustedStartDate.setDate(startOfWeek.getDate() + daysFromMonday);
        adjustedStartDate.setHours(
            lesson.start.getHours(),
            lesson.start.getMinutes(),
            lesson.start.getSeconds()
        );


        const adjustedEndDate = new Date(adjustedStartDate);
        adjustedEndDate.setHours(
            lesson.end.getHours(),
            lesson.end.getMinutes(),
            lesson.end.getSeconds()
        );

        return{
            title: lesson.title,
            start: adjustedStartDate,
            end: adjustedEndDate
        }

    })
}

