# Let's Move OJ Demo

## 在线

[在线](https://letsmove-oj.vercel.app/)或者自行本地部署（详见后文）。

答题编码规则[点击](https://letsmove-oj.vercel.app/problem/rules)查看。

出题规范[点击](https://letsmove-oj.vercel.app/question/rules)查看（此功能需要权限，可以本地部署进行体验）。

奖励机制：

- 一题一积分
- 三积分发 NFT
- 八积分发 Sui，限量，先到先得，如果积分够了没有触发就是发完了

除了出题需要手动与钱包交互以外，其余操作均自动化完成，包括发放奖励。

## 本地

发布合约`/src/contracts/letsmoveoj`

根据合约信息配置`/src/config/key.ts`

配置`.env`，环境变量包括管理员账户`PRIVATE_KEY`以及发币奖励账户`COIN_AWARD`两者的钱包私钥

根据使用习惯`npm, pnpm...`运行体验