"use client"

import { Checkbox } from "@/components/ui/Checkbox"
import { Eye } from "lucide-react"
import { useState } from "react"

interface Submission {
  id: string
  email: string
  rating: number
  ratingValue: string
  customerFeedback: string
  emoji: string
}

interface PrivateSubmissionsTableProps {
  submissions: Submission[]
  onSelectionChange: (selectedEmails: string[]) => void
  planType: string
}

export default function PrivateSubmissionsTable({ 
  submissions, 
  onSelectionChange, 
  planType 
}: PrivateSubmissionsTableProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const handleSelectAll = (checked: boolean) => {
    // Don't allow selection for Starter plan
    if (planType === "Starter") return
    
    let newSelected: string[] = []
    if (checked) {
      newSelected = submissions.map((s) => s.email)
    }
    setSelectedItems(newSelected)
    onSelectionChange(newSelected)
  }

  const handleSelectItem = (email: string, checked: boolean) => {
    // Don't allow selection for Starter plan
    if (planType === "Starter") return
    
    let newSelected: string[]
    if (checked) {
      newSelected = [...selectedItems, email]
    } else {
      newSelected = selectedItems.filter((item) => item !== email)
    }
    setSelectedItems(newSelected)
    onSelectionChange(newSelected)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? "text-yellow-400" : "text-gray-300"}`}>
        ★
      </span>
    ))
  }

  // Check if selection is allowed based on plan type
  const isSelectionAllowed = planType !== "Starter"

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-[#E9E9F3] border-b border-gray-200">
          <tr>
            <th className="text-left py-4 px-4 font-medium text-gray-700 w-12">
              {isSelectionAllowed && (
                <Checkbox
                  checked={selectedItems.length === submissions.length && submissions.length > 0}
                  onCheckedChange={handleSelectAll}
                  className="border-gray-400 data-[state=checked]:bg-blue-600"
                />
              )}
            </th>
            <th className="text-left py-4 px-4 font-medium text-gray-700">Email address</th>
            <th className="text-left py-4 px-4 font-medium text-gray-700">Rating</th>
            <th className="text-left py-4 px-4 font-medium text-gray-700">Customer feedback</th>
            <th className="text-left py-4 px-4 font-medium text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {submissions.length > 0 ? (
            submissions.map((submission) => (
              <tr key={submission.id} className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  {isSelectionAllowed && (
                    <Checkbox
                      checked={selectedItems.includes(submission.email)}
                      onCheckedChange={(checked) => handleSelectItem(submission.email, checked as boolean)}
                      className="border-gray-400 data-[state=checked]:bg-blue-600"
                    />
                  )}
                </td>
                <td className="py-4 px-4 text-gray-600">{submission.email}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{submission.emoji}</span>
                    <div className="flex items-center gap-1">{renderStars(submission.rating)}</div>
                    <span className="text-blue-600 font-medium">({submission.ratingValue})</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-600 max-w-xs truncate">{submission.customerFeedback}</td>
                <td className="py-4 px-4">
                  <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                    <Eye className="h-4 w-4 text-gray-600" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-8 px-4 text-center text-gray-500">
                No submissions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}