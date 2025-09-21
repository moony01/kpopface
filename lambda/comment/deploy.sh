#!/bin/bash

# ==== 설정 ====
FUNC_NAME="kpop-comment-function"
ZIP_NAME="function.zip"
ROLE_NAME="lambda-comment-role"
ROLE_ARN="arn:aws:iam::835377819955:role/$ROLE_NAME"  # TODO: 계정 ID 교체 필요
REGION="ap-northeast-2"

# ==== ZIP 생성 ====
cd "$(dirname "$0")"
rm -f $ZIP_NAME
zip -r $ZIP_NAME index.js package.json node_modules > /dev/null

# ==== 함수 존재 여부 확인 ====
aws lambda get-function --function-name $FUNC_NAME --region $REGION > /dev/null 2>&1

if [ $? -eq 0 ]; then
  echo "🛠 기존 함수 업데이트 중..."
  aws lambda update-function-code \
    --function-name $FUNC_NAME \
    --zip-file fileb://$ZIP_NAME \
    --region $REGION
else
  echo "🚀 새 Lambda 함수 생성 중..."
  aws lambda create-function \
    --function-name $FUNC_NAME \
    --runtime nodejs20.x \
    --handler index.handler \
    --role $ROLE_ARN \
    --zip-file fileb://$ZIP_NAME \
    --region $REGION
fi

# ==== Lambda URL 설정 ====
if aws lambda get-function-url-config --function-name $FUNC_NAME --region $REGION > /dev/null 2>&1; then
  echo "🔄 기존 Function URL 업데이트 중..."
  aws lambda update-function-url-config \
    --function-name $FUNC_NAME \
    --auth-type NONE \
    --cors 'AllowOrigins=["*"]' \
    --region $REGION
else
  echo "🌐 새 Function URL 생성 중..."
  aws lambda create-function-url-config \
    --function-name $FUNC_NAME \
    --auth-type NONE \
    --cors 'AllowOrigins=["*"]' \
    --region $REGION
fi

echo "✅ 배포 완료. 함수 URL은 아래 명령어로 확인하세요:"
echo "aws lambda get-function-url-config --function-name $FUNC_NAME --region $REGION"
