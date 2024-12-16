import { useState } from 'react'
import { useWallet } from '@/hooks/useWallet'
import { createProposal, vote } from '@/utils/contract'

export default function DAOProposal() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const { address, votingPower } = useWallet()

  const handleCreateProposal = async () => {
    await createProposal({
      title,
      description,
      creator: address
    })
  }

  const handleVote = async (proposalId: string, support: boolean) => {
    await vote({
      proposalId,
      support,
      voter: address
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h3 className="mb-4 text-xl font-bold">创建提案</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="提案标题"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="提案描述"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleCreateProposal}
            className="px-4 py-2 text-white bg-blue-600 rounded"
          >
            提交提案
          </button>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-xl font-bold">我的投票权重</h3>
        <p>{votingPower} 票</p>
      </div>
    </div>
  )
} 