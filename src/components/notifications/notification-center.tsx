"use client"

import { useEffect, useState } from "react"
import { Bell, X, Check, Trophy, Heart, MessageCircle, Award } from "lucide-react"
import Link from "next/link"

type Notification = {
  id: string
  type: string
  title: string
  message: string
  link: string | null
  read: boolean
  createdAt: string
}

export function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      fetchNotifications()
    }
  }, [open])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/notifications")
      const data = await response.json()
      setNotifications(data.notifications)
      setUnreadCount(data.unreadCount)
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId?: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notificationId,
          markAllAsRead: !notificationId,
        }),
      })
      fetchNotifications()
    } catch (error) {
      console.error("Failed to mark as read:", error)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="w-5 h-5 text-pink-400" />
      case "comment":
        return <MessageCircle className="w-5 h-5 text-blue-400" />
      case "badge_earned":
        return <Award className="w-5 h-5 text-yellow-400" />
      case "challenge_complete":
        return <Trophy className="w-5 h-5 text-cyan-400" />
      default:
        return <Bell className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 hover:bg-white/10 rounded-full transition-colors relative"
      >
        <Bell className="w-5 h-5 text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 mt-2 w-96 bg-[#1a1d2e] border border-cyan-500/20 rounded-2xl shadow-2xl z-50 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-cyan-400" />
                通知
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h3>
              {notifications.length > 0 && (
                <button
                  onClick={() => markAsRead()}
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  全て既読
                </button>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block w-6 h-6 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                </div>
              ) : notifications.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-white/5 transition-colors ${
                        !notification.read ? "bg-cyan-500/5" : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-semibold text-white">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-cyan-400 hover:text-cyan-300"
                                title="既読にする"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mt-1">
                            {notification.message}
                          </p>
                          {notification.link && (
                            <Link
                              href={notification.link}
                              onClick={() => {
                                setOpen(false)
                                if (!notification.read) {
                                  markAsRead(notification.id)
                                }
                              }}
                              className="text-xs text-cyan-400 hover:text-cyan-300 mt-2 inline-block"
                            >
                              詳細を見る →
                            </Link>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(notification.createdAt).toLocaleString(
                              "ja-JP"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">通知はありません</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
