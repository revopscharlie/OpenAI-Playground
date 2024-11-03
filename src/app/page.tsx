// app/page.tsx
'use client'

import { useState } from 'react'

export default function Chat() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    try {
      setIsLoading(true)
      // Add user message to chat
      const newMessages = [...messages, { role: 'user' as const, content: input }]
      setMessages(newMessages)
      setInput('')

      // Send to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      // Add AI response to chat
      setMessages(messages => [...messages, data.response])

    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat Test</h1>
      
      <div className="flex flex-col space-y-4 mb-4">
        {messages.map((m, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg ${
              m.role === 'user' 
                ? 'bg-blue-100 ml-auto' 
                : 'bg-gray-100'
            }`}
          >
            <p className="text-sm font-semibold mb-1">
              {m.role === 'user' ? 'You' : 'AI'}
            </p>
            <p>{m.content}</p>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="flex space-x-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Say something..."
          className="flex-1 p-2 border rounded"
          disabled={isLoading}
        />
        <button 
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  )
}