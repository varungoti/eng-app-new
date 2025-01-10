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

import React from 'react'
import PopupTrigger from './PopupTrigger'
import Image from 'next/image'

interface CoursePopupProps {
  isActive: boolean
  onToggle: () => void
  onClose: () => void
}

export default function CoursePopup({ isActive, onToggle, onClose }: CoursePopupProps) {
  return (
    <PopupTrigger
      icon={<Image src="http://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_India.png" alt="Hindi flag" className="w-6 h-6" />}
      label="Courses"
      value="1"
      isActive={isActive}
      onToggle={onToggle}
      onClose={onClose}
    >
      <div className="p-4">
        <h3 className="font-bold mb-2">My Courses</h3>
        <div className="flex items-center space-x-2 mb-2">
          <Image src="http://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_India.png" alt="Hindi flag" className="w-6 h-6" />
          <span>Hindi</span>
        </div>
        <button className="text-blue-500 hover:underline">+ Add a new course</button>
      </div>
    </PopupTrigger>
  )
}