import prisma from '@/lib/prisma'
import { getRole } from '@/lib/utils'
import React from 'react'

interface SingleSubjectPageProps {
  params: {
    id: string
  }
}

const SingleSubjectPage = async({params}:SingleSubjectPageProps) => {
  const {role} = await getRole();
  const subjectId = parseInt(params.id);

  // Fetch subject details if needed using subjectId
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
    include: { 
      teachers:true,
      lessons:true}
     }, 
  );

  return (
    <div>
      
    </div>
  )
}

export default SingleSubjectPage