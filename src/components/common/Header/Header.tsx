import React, { useEffect, useState } from 'react'
import CoursePopup from './CoursePopup'
import StreakPopup from './StreakPopup'
import GemsPopup from './GemsPopup'
import HeartsPopup from './HeartsPopup'

export default function Header() {
  const [activePopup, setActivePopup] = useState<string | null>(null)

  const handlePopupToggle = (popup: string) => {
    setActivePopup(prevPopup => prevPopup === popup ? null : popup)
  }

  const handlePopupClose = () => {
    setActivePopup(null)
  }
  function MyComponent() {
    const [currentTime, setCurrentTime] = useState<number | null>(null);

    useEffect(() => {
        setCurrentTime(Date.now())
    }, []);

    return (
        <div>
            {currentTime ? <p>Current Time: {currentTime}</p> : <p>Loading...</p>}
        </div>
    );
}
  return (
    <header className="flex justify-between items-center p-4  shadow-md">
      <div className="flex items-center">
      </div>
      <div className="flex items-center space-x-4">
        <CoursePopup
          isActive={activePopup === 'course'}
          onToggle={() => handlePopupToggle('course')}
          onClose={handlePopupClose}
        />
        <StreakPopup
          isActive={activePopup === 'streak'}
          onToggle={() => handlePopupToggle('streak')}
          onClose={handlePopupClose}
        />
        <GemsPopup
          isActive={activePopup === 'gems'}
          onToggle={() => handlePopupToggle('gems')}
          onClose={handlePopupClose}
        />
        <HeartsPopup
          isActive={activePopup === 'hearts'}
          onToggle={() => handlePopupToggle('hearts')}
          onClose={handlePopupClose}
        />
      </div>
    </header>
  )
}
