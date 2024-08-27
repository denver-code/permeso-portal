'use client'
import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Navbar } from '@/components/common/navbar'
import { PublicNavbar } from '@/components/common/publicNabar'



export default function CouncilsPage() {
  const [councils, setCouncils] = useState<Council[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchCouncils = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/councils/`)
        const data = await response.json()
        setCouncils(data)
      } catch (error) {
        console.error('Error fetching councils:', error)
      }
    }

    fetchCouncils()
  }, [])

  const filteredCouncils = councils.filter(council =>
    council.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
    <PublicNavbar />
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Councils ({councils.length ? councils.length : 0})</h1>
      <Input
        type="text"
        placeholder="Search councils..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <ScrollArea className="h-[600px] rounded-md border p-4">
        {filteredCouncils.map((council) => (
          <div key={council.id} className="mb-4 p-4 bg-zinc-800 rounded-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{council.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h2>
              <Badge variant={council.status === 'active' ? 'default' : 'secondary'}>
                {council.status}
              </Badge>
            </div>
            <p className="text-gray-400">{council.base_url}</p>
          </div>
        ))}
      </ScrollArea>
    </div>
    </>
  )
}