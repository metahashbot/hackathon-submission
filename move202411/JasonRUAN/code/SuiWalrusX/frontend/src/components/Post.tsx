import { BsFillPatchCheckFill } from 'react-icons/bs'
import { FaRegComment, FaRetweet } from 'react-icons/fa'
import { AiOutlineHeart } from 'react-icons/ai'
import { FiShare } from 'react-icons/fi'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { CONSTANTS } from '@/constants/constants'

dayjs.extend(relativeTime)

const style = {
  wrapper: `flex p-3 border-b border-[#38444d] min-w-0`,
  profileImage: `rounded-full h-[40px] w-[40px] object-cover shrink-0`,
  postMain: `flex-1 px-4 min-w-0`,
  headerDetails: `flex items-center`,
  name: `font-bold mr-1`,
  verified: `text-[0.8rem]`,
  handleAndTimeAgo: `text-[#8899a6] ml-1`,
  tweet: `my-2 break-words overflow-hidden overflow-wrap-break-word`,
  image: `rounded-3xl`,
  footer: `flex justify-between mr-28 mt-4 text-[#8899a6]`,
  footerIcon: `rounded-full text-lg p-2`,
}

interface PostProps {
  displayName: string;
  userName: string;
  text: string;
  avatar: string;
  timestamp: string | number;
  isProfileImageNft: boolean;
  media_blob_id?: string;
}

const Post: React.FC<PostProps> = ({
  displayName,
  userName,
  text,
  avatar,
  timestamp,
  isProfileImageNft,
  media_blob_id,
}) => {
  return (
    <div className={style.wrapper}>
      <div>
        <img
          src={avatar}
          alt={userName}
          className={
            isProfileImageNft
              ? `${style.profileImage} smallHex`
              : style.profileImage
          }
        />
      </div>
      <div className={style.postMain}>
        <div className="max-w-full">
          <span className={style.headerDetails}>
            <span className={style.name}>{displayName}</span>
            {isProfileImageNft && (
              <span className={style.verified}>
                <BsFillPatchCheckFill />
              </span>
            )}
            <span className={style.handleAndTimeAgo}>
              @{userName} • {dayjs(timestamp).fromNow()}
            </span>
          </span>
          <div className={style.tweet}>{text}</div>
          {media_blob_id && (
            <div className="relative overflow-hidden rounded-3xl">
              <img
                src={`${CONSTANTS.WALRUS.AGGREGATOR_URL}/v1/${media_blob_id}`}
                alt="Tweet media"
                className={style.image}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
        <div className={style.footer}>
          <div
            className={`${style.footerIcon} hover:bg-[#e8f5fe] hover:text-[#1da1f2]`}
          >
            <FaRegComment />
          </div>
          <div
            className={`${style.footerIcon} hover:bg-[#e5f8ef] hover:text-[#17bf63]`}
          >
            <FaRetweet />
          </div>
          <div
            className={`${style.footerIcon} hover:bg-[#fee7ef] hover:text-[#e0245e]`}
          >
            <AiOutlineHeart />
          </div>
          <div
            className={`${style.footerIcon} hover:bg-[#e8f5fe] hover:text-[#1da1f2]`}
          >
            <FiShare />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post
