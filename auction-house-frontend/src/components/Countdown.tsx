import React from "react"

export function Countdown({ timeRemaining, isActive }) {
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="text-center mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        {isActive ? "Time Remaining" : "Auction Ended"}
      </h2>
      <div
        className={`text-6xl md:text-8xl font-bold font-mono ${
          isActive
            ? timeRemaining <= 60
              ? "text-red-600 animate-pulse"
              : "text-blue-600"
            : "text-gray-500"
        }`}
      >
        {formatTime(timeRemaining)}
      </div>
      {isActive && timeRemaining <= 60 && (
        <p className="text-red-500 font-semibold mt-2 animate-bounce">Final minute!</p>
      )}
    </div>
  )
}
