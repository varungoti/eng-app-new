// import React, { useState, useRef } from 'react';

// interface PopupTriggerProps {
//   icon: React.ReactNode;
//   value: string;
//   label: string;
//   isActive: boolean;
//   onClick: () => void;
//   onButtonClick: () => void;
//   onHover: () => void;
//   onLeave: () => void;
// }

// const PopupTrigger: React.FC<PopupTriggerProps> = ({
//   icon,
//   value,
//   label,
//   isActive,
//   onClick,
//   onButtonClick,
//   onHover,
//   onLeave,
// }) => {
//   const popupRef = useRef<HTMLDivElement>(null);

//   return (
//     <div
//       className="relative"
//       onMouseEnter={onHover}
//       onMouseLeave={onLeave}
//     >
//       <div onClick={onClick} className="cursor-pointer">
//         {icon}
//       </div>
//       {isActive && (
//         <div
//           ref={popupRef}
//           className="absolute top-full mt-2 left-0 bg-white p-2 shadow-lg rounded-md"
//         >
//           <p>{label}</p>
//           <p>Value: {value}</p>
//           <button
//             className="mt-2 px-4 py-1 bg-blue-500 text-white rounded"
//             onClick={onButtonClick}
//           >
//             Click me
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PopupTrigger;


// import React, { useState, useRef, useEffect, ReactNode } from 'react'

// interface PopupTriggerProps {
//   icon: ReactNode
//   label: string
//   value: string
//   children: ReactNode
// }

// export default function PopupTrigger({ icon, label, value, children }: PopupTriggerProps) {
//   const [isOpen, setIsOpen] = useState(false)
//   const triggerRef = useRef<HTMLDivElement>(null)
//   const popupRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (popupRef.current && !popupRef.current.contains(event.target as Node) &&
//           triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
//         setIsOpen(false)
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside)
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside)
//     }
//   }, [])

//   const handleToggle = () => {
//     setIsOpen(!isOpen)
//   }

//   return (
//     <div className="relative" ref={triggerRef}>
//       <button
//         className="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-100"
//         onClick={handleToggle}
//         onMouseEnter={() => setIsOpen(true)}
//       >
//         {icon}
//         <span className="font-semibold">{value}</span>
//       </button>
//       {isOpen && (
//         <div
//           ref={popupRef}
//           className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-10"
//           onMouseLeave={() => setIsOpen(false)}
//         >
//           {children}
//         </div>
//       )}
//     </div>
//   )
// }


import React, { useRef, useEffect, ReactNode } from 'react'

interface PopupTriggerProps {
  icon: ReactNode
  label: string
  value: string
  children: ReactNode
  isActive: boolean
  onToggle: () => void
  onClose: () => void
}

export default function PopupTrigger({
  icon,
  label,
  value,
  children,
  isActive,
  onToggle,
  onClose
}: PopupTriggerProps) {
  const triggerRef = useRef<HTMLDivElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  return (
    <div className="relative" ref={triggerRef}>
      <button
        className={`flex items-center space-x-1 p-2 rounded-full ${
          isActive ? 'bg-gray-200' : 'hover:bg-gray-100'
        }`}
        onClick={onToggle}
        onMouseEnter={onToggle}
        aria-label={label}
      >
        {icon}
        <span className="font-semibold">{value}</span>
      </button>
      {isActive && (
        <div
          ref={popupRef}
          className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-10"
          onMouseLeave={onClose}
        >
          {children}
        </div>
      )}
    </div>
  )
}
