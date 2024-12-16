# Let's Move OJ

## 简述

专注于 Move 语言的 OJ 平台，核心功能与传统 OJ 一致 —— 用户根据题面编写代码，提交后根据出题者设置的一组/多组输入输出数据进行自动化判题。

通过某一题之后可以针对这一题发布心得分享（此功能略显粗糙，但可用）。

题面、分享内容支持基础的 Markdown 语法和数学公式，用户/管理员上传后，此部分内容及测试数据将发布到 [Walrus](https://www.walrus.xyz/) 上存储，其对应的 BlobID 和其它基础信息（题号、过题数...）将由 Move 合约进行维护。

## 体验

[在线](https://letsmove-oj.vercel.app/)或者自行本地部署（详见后文）。

答题编码规则[点击](https://letsmove-oj.vercel.app/problem/rules)查看。

出题规范[点击](https://letsmove-oj.vercel.app/question/rules)查看（此功能需要权限，可以本地部署进行体验）。

奖励机制：

- 一题一积分
- 三积分发 NFT
- 八积分发 Sui，限量，先到先得，如果积分够了没有触发就是发完了

除了出题需要手动与钱包交互 ~~（懒得改了，毕竟好不容易写的）~~ 以外，其余操作均自动化完成，包括发放奖励。

## 本地部署

发布合约`/src/contracts/letsmoveoj`

根据合约信息配置`/src/config/key.ts`

配置`.env`，环境变量包括管理员账户`PRIVATE_KEY`以及发币奖励账户`COIN_AWARD`两者的钱包私钥

根据使用习惯`npm, pnpm...`运行体验
