export function CurrentBid({ currentBid }) {
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-8 border-2 border-green-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Current High Bid</h3>
      {currentBid ? (
        <div className="space-y-2">
          <div className="text-4xl font-bold text-green-600">
            ${currentBid?.amount?.toLocaleString()}
          </div>
          <div className="text-lg text-gray-700">
            <span className="font-medium">Bidder:</span> {currentBid?.bidder_name}
          </div>
        </div>
      ) : (
        <div className="text-gray-500 text-lg">No bids yet - be the first!</div>
      )}
    </div>
  )
}
