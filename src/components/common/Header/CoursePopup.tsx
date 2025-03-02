"use client";

// import React from 'react'
// import PopupTrigger from './PopupTrigger'

// export default function CoursePopup() {
//   return (
//     <PopupTrigger
//       icon={<img src="http://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_India.png" alt="Hindi flag" className="w-6 h-6" />}
//       label="Courses"
//       value="1"
//     >
//       <div className="p-4">
//         <h3 className="font-bold mb-2">My Courses</h3>
//         <div className="flex items-center space-x-2 mb-2">
//           <img src="http://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_India.png" alt="Hindi flag" className="w-6 h-6" />
//           <span>Hindi</span>
//         </div>
//         <button className="text-blue-500 hover:underline">+ Add a new course</button>
//       </div>
//     </PopupTrigger>
//   )
// }

import React, { useEffect, useState } from 'react'
import PopupTrigger from './PopupTrigger'
import Image from 'next/image'
import { useProcessedImage } from '@/utils/imageUtils'
import { ImagePreview } from '../ImagePreview';

interface CoursePopupProps {
  isActive: boolean
  onToggle: () => void
  onClose: () => void
}

export default function CoursePopup({ isActive, onToggle, onClose }: CoursePopupProps) {
  const [localImageUrl, setLocalImageUrl] = useState('');
  const imageUrl = "http://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_India.png";
  const processedImage = useProcessedImage(imageUrl);
  
  useEffect(() => {
    if (processedImage.url) {
      setLocalImageUrl(processedImage.url);
    }
  }, [processedImage.url]);

  return (
    <PopupTrigger
      icon={<Image
        src={localImageUrl || imageUrl}
        alt="Flag of India"
        width={0}
        height={0}
        className="rounded-sm object-cover"
        style={{ width: '24px', height: '24px' }}
      />}
      label="Courses"
      value="1"
      isActive={isActive}
      onToggle={onToggle}
      onClose={onClose}
    >
      <div className="p-4">
        <h3 className="font-bold mb-2">My Courses</h3>
        <div className="flex items-center space-x-2 mb-2">
          <ImagePreview
            imageUrl={localImageUrl || imageUrl}
            width={24}
            height={24}
            className="rounded-sm object-cover w-6 h-6"
          />
          <span>Hindi</span>
        </div>
        <button className="text-blue-500 hover:underline">+ Add a new course</button>
      </div>
    </PopupTrigger>
  )
}