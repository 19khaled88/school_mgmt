// import { PrismaClient, Day, UserSex } from '../src/generated/prisma'
// import {Day, UserSex} from '../src/generated/prisma'


import prisma from "@/lib/prisma";
import { Day,UserSex } from "@prisma/client";


// test

async function main() {
    // ADMIN 
    await prisma.admin.create({
        data: {
            id: "admin1",
            username: 'admin1'
        },
    });

    await prisma.admin.create({
        data: {
            id: 'admin2',
            username: 'admin2'
        }
    });

    // Grade 
    for (let i = 1; i <= 6; i++) {
        await prisma.grade.create({
            data: {
                level: 1,
            }
        })
    }

    // CLASS 
    for (let i = 1; i <= 6; i++) {
        await prisma.class.create({
            data: {
                id: i,
                name: `${i}A`,
                gradeId: i,
                capacity: Math.floor(Math.random() * (20 - 15 + 1) + 15)
            }
        });
    }

    // SUBJECT 
    const subjectData = [
        { name: 'Mathematics' },
        { name: 'English Language' },
        { name: 'Social Studies' },
        { name: 'General Science' },
        { name: 'Physical Education' },
        { name: 'Music' },
        { name: 'Drama' },
        { name: 'Foreign Language' },
        { name: 'Economics' },
        { name: 'Business Studies' }
    ];

    for (const subject of subjectData) {
        await prisma.subject.create({ data: subject });
    }

    // TEACHER 
    for (let i = 1; i <= 15; i++) {
        await prisma.teacher.create({
            data: {
                id: `teacher${i}`,
                username: `teacher${i}`,
                
                name: `TName${i}`,
                surname:`TSurname${i}`,
                email: `teacher${i}@example.com`,
                phone: `123-456-789${i}`,
                address: `Address${i}`,
                bloodType: 'A+',
                sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
                subjects: { connect:[{id:(i % 10) + 1 }]},
                classes:{connect: [{id: (i % 6) + 1 }]}
            },
        });
    }

    // LESSON 
    for (let i = 1; i <= 30; i++) {
        await prisma.lesson.create({
            data: {
                name: `Lesson${i}`,
                day: Day[
                    Object.keys(Day)[
                    Math.floor(Math.random() * Object.keys(Day).length)
                    ] as keyof typeof Day
                ],
                startTime:new Date(new Date().setHours(new Date().getHours() + 1)),
                endTime:new Date(new Date().setHours(new Date().getHours() + 3)),
                subjectId:(i % 10) + 1,
                classId:(i % 6) + 1,
                teacherId:`teacher${(i % 15) + 1}`,
            }
        })
    }


    // PARENT    
    for (let i = 1; i <= 25; i++) {
        await prisma.parent.create({
            data: {
                id: `parentId${i}`,
                username: `parentId${i}`,
                name: `PName ${i}`,
                surname: `pSurname ${i}`,
                email: `parent${i}@exmple.com`,
                phone: `123-456-789${i}`,
                address: `Address${i}`,
            }
        })
    }

    // student 
    for (let i = 1; i <= 15; i++) {
        await prisma.student.create({
            data: {
                id: `student${i}`,
                username: `student${i}`,
                name: `TName${i}`,
                surname: `SSurname ${i}`,
                email: `student${i}@example.com`,
                phone: `123-456-789${i}`,
                address: `Address${i}`,
                bloodType: 'A+',
                sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
                parentId: `parentId${Math.ceil(i / 2) % 25 || 25}`,
                gradeId: (i % 6) + 1,
                classId: (i % 6) + 1,
            },
        });
    }

    // exam 
    for (let i = 1; i <= 10; i++) {
        await prisma.exam.create({
            data: {

                title: `Exam ${i}`,
                startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
                endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
                lessonId: (i % 30) + 1,

            },
        });
    }

    // ASSIGNMENT 
    for (let i = 1; i <= 15; i++) {
        await prisma.assignment.create({
            data: {
                title: `Assignment ${i}`,
                startDate: new Date(new Date().setHours(new Date().getHours() + 1)),
                dueDate: new Date(new Date().setHours(new Date().getHours() + 1)),
                lessonId: (i % 30) + 1,
            },
        });
    }


    // RESULT 
    for (let i = 1; i <= 10; i++) {
        await prisma.result.create({
            data: {
                score: 90,
                studentId: `student${i}`,
                ...(i <= 5 ? { examId: i } : { assignmentId: i - 5 }),

            },
        });
    }

    // ATTENDANCE 
    for (let i = 1; i <= 15; i++) {
        await prisma.attendance.create({
            data: {
                date: new Date(),
                present: true,
                studentId: `student${i}`,
                lessonId: (i % 30) + 1,
            },
        });
    }

    // EVENT 
    for (let i = 1; i <= 15; i++) {
        await prisma.event.create({
            data: {
                title: `Event ${i}`,
                description: `Description for Event ${i}`,
                startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
                endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
                classId: (i % 5) + 1,
            },
        });
    }

    // ANNOUNCEMENT 
    for (let i = 1; i <= 15; i++) {
        await prisma.announcement.create({
            data: {
                title: `Announcement ${i}`,
                description: `Description for Announcement ${i}`,
                date: new Date(),
                classId: (i % 5) + 1,
            },
        });
    }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });