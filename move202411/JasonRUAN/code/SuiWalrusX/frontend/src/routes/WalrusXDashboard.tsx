import XFeed from '@/components/XFeed';
import { CONSTANTS } from '@/constants/constants';
import { useGetObject } from '@/hooks/useGetObject';
import { useGetTweetObjects } from '@/hooks/useGetTweets';

export default function WalrusXDashboard() {

  const { data: sharedObject, isPending, error } = useGetObject({
    objectId: CONSTANTS.SUI_WALRUSX_CONTRACT.WALRUSX_SHARED_OBJECT_ID
  })

  const tweetsTableId = sharedObject?.data?.content?.dataType === "moveObject"
    ? (sharedObject.data.content.fields as { tweets?: { fields: { id: { id: string } } } })?.tweets?.fields?.id?.id
    : undefined;

  const tweetObjects = useGetTweetObjects(tweetsTableId)

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-white shadow-md rounded-lg">
        <div className="w-full h-32 overflow-hidden rounded-t-lg">
          <img
            src="/images/banner.jpeg"
            alt="WalrusX Banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mt-4">
          <XFeed dynamic_field_page={tweetObjects!} tweetsTableId={tweetsTableId!}/>
        </div>
      </div>
    </div>
  )
}
