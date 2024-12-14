import XBox from "./XBox";
import { DynamicFieldPage } from "@mysten/sui/client";
import { XFeedItem } from "./XFeedItem";
import { useSuiClientQuery } from "@mysten/dapp-kit";

export interface TweetListProps {
  dynamic_field_page: DynamicFieldPage;
  tweetsTableId: string;
}

const XFeed = ({ dynamic_field_page, tweetsTableId }: TweetListProps) => {
  const { refetch } = useSuiClientQuery(
    "getDynamicFields",
    {
      parentId: tweetsTableId,
    },
    {
      refetchInterval: 5000,
    },
  );

  const handleRefresh = () => {
    refetch();
  };

  if (!dynamic_field_page?.data?.length) {
    return (
      <div>
        <XBox onPostSuccess={handleRefresh} />
        <div className="text-center text-gray-500 mt-4">
          No tweets yet
        </div>
      </div>
    );
  }

   const sortedTweets = [...dynamic_field_page.data].sort((a, b) => {
    const valueA = parseInt(a.name.value as string);
    const valueB = parseInt(b.name.value as string);
    return valueB - valueA;
  });

  return (
    <div>
      <XBox onPostSuccess={handleRefresh} />
      {sortedTweets.map((tweet) => (
        <XFeedItem
          key={tweet.objectId}
          dynamic_field_name={tweet.name}
          tweetsTableId={tweetsTableId}
        />
      ))}
    </div>
  );
};

export default XFeed;
