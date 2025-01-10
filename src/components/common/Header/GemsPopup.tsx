// import React from 'react'
// import PopupTrigger from './PopupTrigger'
// import { Diamond } from 'lucide-react'

// export default function GemsPopup() {
//   return (
//     <PopupTrigger
//       icon={<Diamond className="w-6 h-6 text-blue-500" />}
//       label="Gems"
//       value="500"
//     >
//       <div className="p-4">
//         <h3 className="font-bold mb-2">Gems</h3>
//         <p>You have 500 gems</p>
//         <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">GO TO SHOP</button>
//       </div>
//     </PopupTrigger>
//   )
// }

import React from 'react'
import PopupTrigger from './PopupTrigger'
import { Diamond } from 'lucide-react'

interface GemsPopupProps {
  isActive: boolean
  onToggle: () => void
  onClose: () => void
}

export default function GemsPopup({ isActive, onToggle, onClose }: GemsPopupProps) {
  return (
    <PopupTrigger
      icon={<Diamond className="w-6 h-6 text-blue-500" />}
      label="Gems"
      value="500"
      isActive={isActive}
      onToggle={onToggle}
      onClose={onClose}
    >
      <div className="p-4">
        <h3 className="font-bold mb-2">Gems</h3>
        <p>You have 500 gems</p>
        <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">GO TO SHOP</button>
      </div>
    </PopupTrigger>
  )
}