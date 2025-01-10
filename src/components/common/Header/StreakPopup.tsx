// import React from 'react'
// import PopupTrigger from './PopupTrigger'
// import { FireExtinguisher } from 'lucide-react'

// export default function StreakPopup() {
//   return (
//     <PopupTrigger
//       icon={<FireExtinguisher className="w-6 h-6 text-orange-500" />}
//       label="Streak"
//       value="0"
//     >
//       <div className="p-4">
//         <h3 className="font-bold mb-2">0 day streak</h3>
//         <p className="mb-4">Do a lesson today to start a new streak!</p>
//         <div className="grid grid-cols-7 gap-1 mb-4">
//           {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
//             <div key={index} className="w-8 h-8 bg-gray-200 flex items-center justify-center rounded-full">{day}</div>
//           ))}
//         </div>
//         <div className="bg-gray-100 p-2 rounded-lg">
//           <h4 className="font-semibold">Streak Society</h4>
//           <p className="text-sm">Reach a 7 day streak to join the Streak Society and earn exclusive rewards.</p>
//         </div>
//         <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">VIEW MORE</button>
//       </div>
//     </PopupTrigger>
//   )
// }

import React from 'react'
import PopupTrigger from './PopupTrigger'
import { FireExtinguisher } from 'lucide-react'

interface StreakPopupProps {
  isActive: boolean
  onToggle: () => void
  onClose: () => void
}

export default function StreakPopup({ isActive, onToggle, onClose }: StreakPopupProps) {
  return (
    <PopupTrigger
      icon={<FireExtinguisher className="w-6 h-6 text-orange-500" />}
      label="Streak"
      value="0"
      isActive={isActive}
      onToggle={onToggle}
      onClose={onClose}
    >
      <div className="p-4">
        <h3 className="font-bold mb-2">0 day streak</h3>
        <p className="mb-4">Do a lesson today to start a new streak!</p>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div key={index} className="w-8 h-8 bg-gray-200 flex items-center justify-center rounded-full">{day}</div>
          ))}
        </div>
        <div className="bg-gray-100 p-2 rounded-lg">
          <h4 className="font-semibold">Streak Society</h4>
          <p className="text-sm">Reach a 7 day streak to join the Streak Society and earn exclusive rewards.</p>
        </div>
        <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">VIEW MORE</button>
      </div>
    </PopupTrigger>
  )
}