import React, { useState, useEffect, useCallback } from "react"
import { CurrentBid } from "./components/CurrentBid"
import { BidForm } from "./components/BidForm"
import "./App.css"
import axios from "axios"

export default function App() {
  const [auctionState, setAuctionState] = useState({
    currentHighBid: null,
    timeRemaining: 1800,
    isActive: true,
  })
  const [bids, setBids] = useState([])
  const [connectionStatus, setConnectionStatus] = useState("connecting")

  useEffect(() => {
    const eventSource = new EventSource("http://127.0.0.1:8000/api/stream")

    eventSource.onopen = () => {
      setConnectionStatus("connected")
      console.log("Connected to auction stream")
    }

    eventSource.onmessage = (event) => {
      try {
        const streamEvent = JSON.parse(event.data)
        console.log("Data:", streamEvent)
        handleStreamEvent(streamEvent)
      } catch (error) {
        console.error("Error parsing stream event:", error)
      }
    }

    eventSource.onerror = (error) => {
      console.error("Stream connection error:", error)
      setConnectionStatus("disconnected")
    }

    return () => {
      eventSource.close()
    }
  }, [])

  const handleStreamEvent = useCallback((event) => {
    console.log("Event:", event);

    if (event.type === "auction_started") {
      setAuctionState((prev) => ({
        ...prev,
        auctionId: event.auctionId,
        isActive: event.active,
        endsAt: event.endsAt,
        currentHighBid: {
          amount: event.amount,
          bidder_name: event.bidder_name,
        },
      }));

      setBids([]); // reset bids when auction starts
    } else {
      console.log("Unknown event type:", event.type);
    }
  }, [])

  const handleBidSubmit = async (bidData) => {
    const response = await axios.post("http://127.0.0.1:8000/api/bids", bidData)

    if (!response) {
      if (response.status === 422) {
        const errorData = await response.json()
        throw { status: 422, errors: errorData.errors }
      }
      throw new Error("Failed to place bid")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Live Auction</h1>
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${connectionStatus === "connected"
                  ? "bg-green-500"
                  : connectionStatus === "connecting"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                  }`}
              ></div>
              <span className="text-sm text-gray-600 capitalize">{connectionStatus}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mx-auto">
          {/* Left Column */}
          <div>
            <CurrentBid currentBid={auctionState.currentHighBid} />

            <BidForm
              onSubmit={handleBidSubmit}
              isActive={auctionState.isActive}
              currentHighBid={auctionState.currentHighBid ? auctionState.currentHighBid.amount : 0}
            />
          </div>
        </div>

      </main>
    </div>
  )
}
