import XBox from './XBox'
import { DynamicFieldPage } from '@mysten/sui/client'
import { XFeedItem } from './XFeedItem';
import { useSuiClientQuery } from '@mysten/dapp-kit';

export interface TweetListProps {
  dynamic_field_page: DynamicFieldPage;
  tweetsTableId: string;
}

const XFeed = ({ dynamic_field_page, tweetsTableId }: TweetListProps ) => {
  const { refetch } = useSuiClientQuery(
    "getDynamicFields",
    {
      parentId: tweetsTableId,
    },
    {
      refetchInterval: 5000,
    }
  );

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div>
      <XBox onPostSuccess={handleRefresh} />
      {dynamic_field_page?.data.map((tweet) => (
        <XFeedItem key={tweet.objectId} dynamic_field_name={tweet.name} tweetsTableId={tweetsTableId}/>
      ))}
    </div>
  )
}

export default XFeed
