#!/bin/bash

set -e

# ==== 설정 ====
ROLE_NAME="lambda-comment-role"
TRUST_POLICY_FILE="trust-policy.json"
PERMISSIONS_POLICY_FILE="permissions-policy.json"
POLICY_NAME="CommentTablePolicy"
REGION="ap-northeast-2"
FUNCTION_NAME="kpop-comment-function"
STATEMENT_ID="allow-public-url"

error_exit() {
  echo "❌ 오류 발생: $1"
  exit 1
}

# ==== 신뢰 정책(Trust Policy) 적용 ====
echo "🔑 신뢰 정책(Trust Policy) 적용 중..."
aws iam update-assume-role-policy \
  --role-name $ROLE_NAME \
  --policy-document file://$TRUST_POLICY_FILE \
  || error_exit "신뢰 정책 적용 실패"

# ==== 권한 정책(Permissions Policy) 적용 ====
echo "🔒 권한 정책(Permissions Policy) 적용 중..."
aws iam put-role-policy \
  --role-name $ROLE_NAME \
  --policy-name $POLICY_NAME \
  --policy-document file://$PERMISSIONS_POLICY_FILE \
  || error_exit "권한 정책 적용 실패"

# ==== Function URL 리소스 정책 적용 ====
echo "🌐 Function URL 리소스 정책 적용 중..."

# 기존 StatementId 삭제 시도 (없으면 무시)
echo "🗑 기존 StatementId($STATEMENT_ID) 삭제 시도..."
aws lambda remove-permission \
  --function-name $FUNCTION_NAME \
  --statement-id $STATEMENT_ID \
  --region $REGION \
  || echo "⚠️ 기존 StatementId($STATEMENT_ID) 없음, 건너뜀"

# 새 Statement 추가
aws lambda add-permission \
  --function-name $FUNCTION_NAME \
  --statement-id "$STATEMENT_ID" \
  --action lambda:InvokeFunctionUrl \
  --principal "*" \
  --function-url-auth-type NONE \
  --region $REGION \
  || error_exit "Function URL 리소스 정책 적용 실패"

echo "✅ 모든 권한 정책 적용 완료"