'use client'
import { Button } from '@/components/ui/button';
import { Folder } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react'

const ProjectList = () => {
    const [projectList, setProjectList] = useState([]);
  return (
    <div>
        {projectList.length === 0 ? (
            <div className='flex flex-col items-center p-10 border rounded-xl mt-10 gap-3'>
                {/* <Folder className='h-12 w-12'/>
                 */}
                 <Image src="/folder.png" alt='folder image' width={90} height={90}/>
                <h2 className='text-2xl font-bold'>No Boards Found</h2>
                <p className='text-muted-foreground'>Create you first board to start brainstorming, Planning !</p>
                <Button>+ Create New Board</Button>
            </div>
        ):
        <div>

        </div>
        }
    </div>
  )
}

export default ProjectList