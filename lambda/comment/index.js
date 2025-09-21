const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient();

const allowedOrigins = [
  "https://kpopface.com",           // 실제 배포 도메인
  "http://127.0.0.1:4000",          // 로컬 개발 환경
  "http://localhost:4000"           // 로컬 개발 환경 (localhost)
];

exports.handler = async (event) => {
  console.log("📥 Event:", event);

  // === [추가] corsOrigin 선언 ===
  const origin = event.headers?.origin || event.headers?.Origin;
  const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  // === [추가 끝] ===

  const path = event.rawPath || event.path;   // Lambda URL vs API GW 호환
  const method = event.requestContext?.http?.method || event.httpMethod;

  if (path === "/comments" && method === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": corsOrigin,
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: ""
    };
  }

  if (path === "/comments" && method === "GET") {
    // 댓글 조회
    const postId = event.queryStringParameters?.postId;
    const params = {
      TableName: "CommentTable",
      KeyConditionExpression: "postId = :p",
      ExpressionAttributeValues: {
        ":p": postId
      }
    };

    const result = await ddb.query(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": corsOrigin,
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify(result.Items)
    };
  }

  if (path === "/comments" && method === "POST") {
    // 댓글 저장
    const body = JSON.parse(event.body);
    const params = {
      TableName: "CommentTable",
      Item: {
        id: Date.now().toString(),
        postId: body.postId,
        nickname: body.nickname,
        content: body.content,
        createdAt: new Date().toISOString()
      }
    };

    await ddb.put(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": corsOrigin,
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({ message: "Saved" })
    };
  }

  return {
    statusCode: 404,
    headers: {
      "Access-Control-Allow-Origin": corsOrigin,
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    },
    body: JSON.stringify({ error: "Not Found" })
  };
};
