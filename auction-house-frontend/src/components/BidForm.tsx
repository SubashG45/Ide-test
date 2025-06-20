import React, { useState } from "react"

export function BidForm({ onSubmit, isActive, currentHighBid }) {
  const [formData, setFormData] = useState({
    amount: 0,
    bidder_name: "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isActive) return

    setIsSubmitting(true)
    setErrors({})

    try {
      await onSubmit(formData)
      // Clear amount but keep bidder name
      setFormData({ amount: 0, bidder_name: formData.bidder_name })
    } catch (error) {
      if (error.status === 422 && error.errors) {
        setErrors(error.errors)
      } else {
        setErrors({ general: "Failed to place bid. Please try again." })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const minBid = currentHighBid + 1

  return (
    <div className="bg-white rounded-lg p-6 border-2 border-gray-200 mb-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Place Your Bid</h3>

      {!isActive && (
        <div className="bg-gray-100 text-gray-600 p-4 rounded-lg text-center">
          Auction has ended - no more bids accepted
        </div>
      )}

      {isActive && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.general}
            </div>
          )}

          <div>
            <label htmlFor="bidder" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="bidder"
              value={formData.bidder_name}
              onChange={(e) => setFormData({ ...formData, bidder_name: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.bidder_name ? "border-red-500" : "border-gray-300"
                }`}
              placeholder="Enter your name"
              required
            />
            {errors.bidder_name && <p className="text-red-500 text-sm mt-1">{errors.bidder_name}</p>}
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Bid Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                id="amount"
                value={formData.amount || ""}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.amount ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder={`Minimum: $${minBid.toLocaleString()}`}
                min={minBid}
                required
              />
            </div>
            {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
            <p className="text-gray-500 text-sm mt-1">Minimum bid: ${minBid.toLocaleString()}</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-md transition-colors duration-200"
          >
            {isSubmitting ? "Placing Bid..." : "Place Bid"}
          </button>
        </form>
      )}
    </div>
  )
}
