import axios, { AxiosResponse } from 'axios';

// 定义查询和变量的类型
interface GraphQLResponse {
    data: {
        object: {
            digest: string;
            asMoveObject: {
                contents: {
                    data: string;
                }[];
            };
        };
    };
}

interface GraphQLRequest {
    query: string;
    variables: {
        objectID: string;
    };
}

// GraphQL 查询字符串
const query: string = `
  query ($objectID: SuiAddress!) {
    object(address: $objectID) {
      digest
      asMoveObject {
        contents {
          data
        }
      }
    }
  }
`;

// 请求的变量
const variables = {
    objectID: "0xab3612fe6b4c42ce2cb4ee55aeb4a8d7ddc5c4d8ee4ab77d8f9d2ca2297a3be4"
};

// POST 请求的 payload
const postData: GraphQLRequest = {
    query,
    variables
};

// GraphQL 服务器 URL
const url: string = "https://sui-testnet.mystenlabs.com/graphql";

// 发送 POST 请求
axios.post<GraphQLResponse>(url, postData)
    .then((response: AxiosResponse<GraphQLResponse>) => {
        // 打印返回的数据
        console.log("Response Data:", response.data);
    })
    .catch((error: Error) => {
        // 处理错误
        console.error("Error:", error);
    });