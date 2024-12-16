import { FaTwitter, FaFacebook, FaReddit, FaTelegram, FaLinkedin, FaDiscord } from 'react-icons/fa';

interface ShareButtonsProps {
  stakingData: {
    totalStaked: string;
    totalStakers: number;
    avgStakeAmount: string;
  }
}

export function ShareButtons({ stakingData }: ShareButtonsProps) {
  const shareText = `Check out StarSwap's staking stats:\n
Total Staked: ${stakingData.totalStaked} SUI\n
Total Stakers: ${stakingData.totalStakers}\n
Average Stake: ${stakingData.avgStakeAmount} SUI\n
#StarSwap #SUI #Blockchain`;
  
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent('StarSwap Staking Stats')}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent('StarSwap Staking Stats')}&summary=${encodeURIComponent(shareText)}`,
    discord: `https://discord.com/channels/@me`
  };

  return (
    <div className="flex flex-wrap gap-3 mt-4 justify-center">
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 transition-all"
      >
        <FaTwitter className="w-5 h-5 text-[#1DA1F2]" />
      </a>
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-[#4267B2]/20 hover:bg-[#4267B2]/30 transition-all"
      >
        <FaFacebook className="w-5 h-5 text-[#4267B2]" />
      </a>
      <a
        href={shareLinks.reddit}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-[#FF4500]/20 hover:bg-[#FF4500]/30 transition-all"
      >
        <FaReddit className="w-5 h-5 text-[#FF4500]" />
      </a>
      <a
        href={shareLinks.telegram}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-[#0088cc]/20 hover:bg-[#0088cc]/30 transition-all"
      >
        <FaTelegram className="w-5 h-5 text-[#0088cc]" />
      </a>
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-[#0A66C2]/20 hover:bg-[#0A66C2]/30 transition-all"
      >
        <FaLinkedin className="w-5 h-5 text-[#0A66C2]" />
      </a>
      <a
        href={shareLinks.discord}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-[#5865F2]/20 hover:bg-[#5865F2]/30 transition-all"
      >
        <FaDiscord className="w-5 h-5 text-[#5865F2]" />
      </a>
    </div>
  );
} 