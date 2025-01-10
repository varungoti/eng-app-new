// import React from 'react'
// import PopupTrigger from './PopupTrigger'
// import { Heart } from 'lucide-react'

// export default function HeartsPopup() {
//   return (
//     <PopupTrigger
//       icon={<Heart className="w-6 h-6 text-red-500" />}
//       label="Hearts"
//       value="5"
//     >
//       <div className="p-4">
//         <h3 className="font-bold mb-2">Hearts</h3>
//         <div className="flex space-x-1 mb-2">
//           {[1, 2, 3, 4, 5].map((_, index) => (
//             <Heart key={index} className="w-6 h-6 text-red-500" fill="currentColor" />
//           ))}
//         </div>
//         <p className="mb-2">You have full hearts</p>
//         <p className="text-sm text-gray-600 mb-4">Keep on learning</p>
//         <button className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 mb-2">GET SUPER</button>
//         <button className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-100">REFILL HEARTS</button>
//       </div>
//     </PopupTrigger>
//   )
// }

import React from 'react'
import PopupTrigger from './PopupTrigger'
import { Heart } from 'lucide-react'

interface HeartsPopupProps {
  isActive: boolean
  onToggle: () => void
  onClose: () => void
}

export default function HeartsPopup({ isActive, onToggle, onClose }: HeartsPopupProps) {
  return (
    <PopupTrigger
      icon={<Heart className="w-6 h-6 text-red-500" />}
      label="Hearts"
      value="5"
      isActive={isActive}
      onToggle={onToggle}
      onClose={onClose}
    >
      <div className="p-4">
        <h3 className="font-bold mb-2">Hearts</h3>
        <div className="flex space-x-1 mb-2">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <Heart key={index} className="w-6 h-6 text-red-500" fill="currentColor" />
          ))}
        </div>
        <p className="mb-2">You have full hearts</p>
        <p className="text-sm text-gray-600 mb-4">Keep on learning</p>
        <button className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 mb-2">GET SUPER</button>
        <button className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-100">REFILL HEARTS</button>
      </div>
    </PopupTrigger>
  )
}