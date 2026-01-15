'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface UseCasesSectionProps {
  userId: string
}

export function UseCasesSection({ userId }: UseCasesSectionProps) {
  const [showAll, setShowAll] = useState(false)

  const allUseCases = [
    // First row (always visible)
    {
      id: 1,
      title: 'Research my competitors',
      description: 'Get detailed competitor analysis and market insights',
      category: 'Business',
      color: 'blue',
      helper: 'buddy',
      prompt:
        'Research my competitors and provide a detailed analysis of their strengths, weaknesses, and market positioning.',
      avatar: '/Avatar/Business-Development.mp4',
    },
    {
      id: 2,
      title: 'Create a post for my social media',
      description: 'Generate engaging content for your social platforms',
      category: 'Content',
      color: 'purple',
      helper: 'soshie',
      prompt:
        'Create engaging social media posts for my brand that will increase engagement and reach.',
      avatar: '/Avatar/Social Media.mp4',
    },
    {
      id: 3,
      title: 'Build a high-converting website',
      description: 'Create websites that convert visitors into customers',
      category: 'Marketing',
      color: 'orange',
      helper: 'growth-bot',
      prompt:
        'Help me build a high-converting website that drives sales and generates leads for my business.',
      avatar: '/Avatar/Growth Bot.mp4',
    },
    {
      id: 4,
      title: "Summarize today's emails",
      description: 'Get quick summaries of important messages',
      category: 'Productivity',
      color: 'blue',
      helper: 'vizzy',
      prompt:
        "Summarize today's important emails and highlight the key action items I need to address.",
      avatar: '/Avatar/Virtual Assistant.mp4',
    },
    // Additional rows (hidden initially)
    {
      id: 5,
      title: 'Write compelling sales copy',
      description: 'Create persuasive copy that drives conversions',
      category: 'Copy',
      color: 'green',
      helper: 'penn',
      prompt:
        'Write compelling sales copy for my product that converts visitors into customers.',
      avatar: '/Avatar/Copy Writer.mp4',
    },
    {
      id: 6,
      title: 'Improve my SEO rankings',
      description: 'Boost search visibility and organic traffic',
      category: 'SEO',
      color: 'indigo',
      helper: 'seomi',
      prompt:
        "Create an SEO strategy to improve my website's search rankings and organic traffic.",
      avatar: '/Avatar/SEO.mp4',
    },
    {
      id: 7,
      title: 'Create email campaigns',
      description: 'Design engaging email marketing sequences',
      category: 'Email',
      color: 'red',
      helper: 'emmie',
      prompt:
        'Create an effective email marketing campaign to engage my subscribers and drive sales.',
      avatar: '/Avatar/Email writer.mp4',
    },
    {
      id: 8,
      title: 'Improve customer support',
      description: 'Enhance customer satisfaction and retention',
      category: 'Support',
      color: 'teal',
      helper: 'cassie',
      prompt:
        'Help me create a customer support strategy to improve satisfaction and reduce complaints.',
      avatar: '/Avatar/Customer Support.mp4',
    },
    {
      id: 9,
      title: 'Analyze business data',
      description: 'Get insights from your data and metrics',
      category: 'Analytics',
      color: 'cyan',
      helper: 'dexter',
      prompt:
        'Analyze my business data to identify trends and opportunities for growth.',
      avatar: '/Avatar/Data.mp4',
    },
    {
      id: 10,
      title: 'Build my dream team',
      description: 'Find and hire top talent for your company',
      category: 'Talent',
      color: 'pink',
      helper: 'scouty',
      prompt:
        'Help me create a talent acquisition strategy to hire the best candidates for my team.',
      avatar: '/Avatar/Creative.mp4',
    },
    {
      id: 11,
      title: 'Develop myself professionally',
      description: 'Create a path for personal and career growth',
      category: 'Growth',
      color: 'amber',
      helper: 'gigi',
      prompt:
        'Create a personal development plan to help me achieve my career and life goals.',
      avatar: '/Avatar/Personal Development.mp4',
    },
    {
      id: 12,
      title: 'Boost my productivity',
      description: 'Optimize your workflow and time management',
      category: 'Efficiency',
      color: 'violet',
      helper: 'productivity-coach',
      prompt:
        'Help me optimize my daily routine and boost my productivity to achieve more in less time.',
      avatar: '/Avatar/Productivity Coach.mp4',
    },
  ]

  const router = useRouter()

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
      green: 'bg-green-100 text-green-600',
      indigo: 'bg-indigo-100 text-indigo-600',
      red: 'bg-red-100 text-red-600',
      teal: 'bg-teal-100 text-teal-600',
      cyan: 'bg-cyan-100 text-cyan-600',
      pink: 'bg-pink-100 text-pink-600',
      amber: 'bg-amber-100 text-amber-600',
      violet: 'bg-violet-100 text-violet-600',
    }
    return (
      colorMap[color as keyof typeof colorMap] || 'bg-gray-100 text-gray-600'
    )
  }

  const getIconColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-600',
      purple: 'bg-purple-600',
      orange: 'bg-orange-600',
      green: 'bg-green-600',
      indigo: 'bg-indigo-600',
      red: 'bg-red-600',
      teal: 'bg-teal-600',
      cyan: 'bg-cyan-600',
      pink: 'bg-pink-600',
      amber: 'bg-amber-600',
      violet: 'bg-violet-600',
    }
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-600'
  }

  const visibleUseCases = showAll ? allUseCases : allUseCases.slice(0, 4)

  const handleUseCase = async (prompt: string, helper: string) => {
    try {
      // `/dashboard/${userId}/chat/${useCase.helper}?prompt=${encodeURIComponent(useCase.prompt)}`

      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          helperId: helper,
          clerkId: userId,
        }),
      })

      const { conversationId } = await res.json()
      router.push(
        `/dashboard/${userId}/chat/${helper}/${conversationId}?prompt=${encodeURIComponent(prompt)}`
      )
    } catch (error) {
      console.log(error)
      toast.error('Failed to load use case. Please try again.')
    }
  }

  return (
    <div className="mx-auto mb-12 w-full max-w-4xl px-3 sm:mb-14 sm:px-4 md:mb-16 md:px-6">
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        <h2 className="text-lg font-bold text-white sm:text-xl md:text-2xl">
          Use cases
        </h2>
        <button
          onClick={() => setShowAll(!showAll)}
          className="font-medium text-white hover:text-gray-300"
        >
          {showAll ? 'See less' : 'See all'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
        {visibleUseCases.map((useCase, index) => (
          <button
            key={useCase.id}
            title="use case button"
            onClick={() => handleUseCase(useCase.prompt, useCase.helper)}
            className={`group flex h-full cursor-pointer flex-col rounded-xl bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:rounded-2xl sm:p-4 md:rounded-3xl md:p-6 ${
              index < 4
                ? 'border-2 border-yellow-500/70 hover:border-yellow-400'
                : 'border border-gray-100'
            }`}
            style={
              index < 4 ? { boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)' } : {}
            }
            onMouseEnter={(e) => {
              const video = e.currentTarget.querySelector(
                'video'
              ) as HTMLVideoElement
              if (video) video.play()
            }}
            onMouseLeave={(e) => {
              const video = e.currentTarget.querySelector(
                'video'
              ) as HTMLVideoElement
              if (video) {
                video.pause()
                video.currentTime = 0
              }
            }}
          >
            <div className="flex-1">
              <h3 className="mb-2 line-clamp-3 text-xs font-semibold text-gray-900 sm:text-sm md:text-base">
                {useCase.title}
              </h3>
              {/* <p className="text-sm text-gray-600 mb-4">{useCase.description}</p> */}
            </div>

            <div className="mt-auto flex items-center gap-2 sm:gap-3">
              <div className="relative h-7 w-7 flex-shrink-0 overflow-hidden rounded-full sm:h-9 sm:w-9 md:h-10 md:w-10">
                <video
                  className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-110"
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  controls={false}
                  disablePictureInPicture
                  style={{ pointerEvents: 'none' }}
                >
                  <source src={useCase.avatar} type="video/mp4" />
                </video>
              </div>
              <span className={`truncate text-xs font-medium text-gray-600`}>
                {useCase.category}
              </span>
              <div className="ml-auto flex-shrink-0">
                <svg
                  className="h-3 w-3 text-gray-400 transition-colors group-hover:text-gray-600 sm:h-4 sm:w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
