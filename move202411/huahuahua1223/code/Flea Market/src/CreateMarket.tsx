import { Transaction } from "@mysten/sui/transactions";
import { Button, Container } from "@radix-ui/themes";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import ClipLoader from "react-spinners/ClipLoader";
import { useMarket } from './MarketContext'; // 引入 useMarket
import { useNavigate, Link } from 'react-router-dom'; // 引入 Link 和 useNavigate

export function CreateMarket() {
  const counterPackageId = useNetworkVariable("counterPackageId");
  const suiClient = useSuiClient();
  const {
    mutate: signAndExecute,
    isSuccess,
    isPending,
  } = useSignAndExecuteTransaction();
  const { setObjectId, marketIds, addMarketId } = useMarket(); // 使用 useMarket 获取 setObjectId 和 marketIds
  const navigate = useNavigate(); // 创建 navigate 函数实例

  function create() {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [],
      target: `${counterPackageId}::marketplace::initialize_market`,
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: async ({ digest }) => {
          const { effects } = await suiClient.waitForTransaction({
            digest: digest,
            options: {
              showEffects: true,
            },
          });

          const newObjectId = effects?.created?.[0]?.reference?.objectId!;
          setObjectId(newObjectId); // 设置 objectId 到 Context
          addMarketId(newObjectId);
          navigate(`/market/${newObjectId}`); // 使用 navigate 跳转到市场页面，并传递 objectId
        },
      },
    );
  }

  return (
    <Container>
      <Button
        size="3"
        onClick={() => {
          create();
        }}
        disabled={isSuccess || isPending}
      >
        {isSuccess || isPending ? <ClipLoader size={20} /> : "开启市场"}
      </Button>
      <div>
        <h3>已创建的市场:</h3>
        <ul>
          {marketIds.map(id => (
            <li key={id}>
              <Link to={`/market/${id}`}>{id}</Link>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
