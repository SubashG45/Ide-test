import React, { useEffect, useRef } from "react"

export function LiveLog({ bids }) {
  const logRef = useRef(null)

  // Auto-scroll to bottom when new bids arrive
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [bids])

  return (
    <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Live Bidding Activity</h3>

      <div ref={logRef} className="h-64 overflow-y-auto space-y-2 bg-white rounded border p-4">
        {bids.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No bids yet - waiting for the action to begin!
          </div>
        ) : (
          bids.map((bid) => (
            <div
              key={bid.id}
              className="flex justify-between items-center p-3 bg-blue-50 rounded border-l-4 border-blue-400 animate-fade-in"
            >
              <div>
                <span className="font-semibold text-blue-800">{bid.bidder}</span>
                <span className="text-gray-600 ml-2">bid</span>
                <span className="font-bold text-green-600 ml-2">${bid.amount.toLocaleString()}</span>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(bid.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
      </div>

      {bids.length > 0 && (
        <div className="mt-2 text-sm text-gray-500 text-center">
          {bids.length} bid{bids.length !== 1 ? "s" : ""} placed
        </div>
      )}
    </div>
  )
}
