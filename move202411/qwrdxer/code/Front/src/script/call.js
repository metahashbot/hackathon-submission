"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
// GraphQL 查询字符串
var query = "\n  query ($objectID: SuiAddress!) {\n    object(address: $objectID) {\n      digest\n      asMoveObject {\n        contents {\n          data\n        }\n      }\n    }\n  }\n";
// 请求的变量
var variables = {
    objectID: "0xab3612fe6b4c42ce2cb4ee55aeb4a8d7ddc5c4d8ee4ab77d8f9d2ca2297a3be4"
};
// POST 请求的 payload
var postData = {
    query: query,
    variables: variables
};
// GraphQL 服务器 URL
var url = "https://sui-testnet.mystenlabs.com/graphql";
// 发送 POST 请求
axios_1.default.post(url, postData)
    .then(function (response) {
    // 打印返回的数据
    console.log("Response Data:", response.data);
})
    .catch(function (error) {
    // 处理错误
    console.error("Error:", error);
});
