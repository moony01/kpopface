# Lambda 함수 배포 및 권한 설정 가이드

이 문서는 `lambda/` 디렉토리 내 AWS Lambda 함수의 배포 및 권한 설정 방법을 안내합니다.

---

## 1. 배포 방법

1. **코드 작성 및 준비**
   - 각 함수별 디렉토리(예: `comment/`)에 Lambda 코드를 작성합니다.

2. **ZIP 파일로 패키징**
   ```sh
   cd lambda/comment
   zip -r function.zip .
   ```

3. **Lambda 콘솔 또는 AWS CLI로 업로드**
   - 콘솔: Lambda 함수 > 코드 업로드 > ZIP 파일 선택
   - CLI:
     ```sh
     aws lambda update-function-code --function-name YOUR_FUNCTION_NAME --zip-file fileb://function.zip
     ```

---

## 2. Lambda 실행 역할(IAM Role) 설정

### 2-1. 신뢰 정책(trust-policy.json)

- Lambda가 사용할 수 있도록 신뢰 정책을 설정해야 합니다.
- 예시: `lambda/comment/trust-policy.json`

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {
      "Service": "lambda.amazonaws.com"
    },
    "Action": "sts:AssumeRole"
  }]
}
```

- 적용 방법:
  ```sh
  aws iam create-role --role-name YOUR_LAMBDA_ROLE --assume-role-policy-document file://lambda/comment/trust-policy.json
  ```

### 2-2. 권한 정책(permissions-policy.json)

- Lambda가 DynamoDB 등 AWS 리소스에 접근할 수 있도록 권한 정책을 추가해야 합니다.
- 예시: `lambda/comment/permissions-policy.json`

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:Query",
        "dynamodb:PutItem"
      ],
      "Resource": "arn:aws:dynamodb:ap-northeast-2:YOUR_ACCOUNT_ID:table/CommentTable"
    }
  ]
}
```

- 적용 방법:
  ```sh
  aws iam put-role-policy --role-name YOUR_LAMBDA_ROLE --policy-name CommentTablePolicy --policy-document file://lambda/comment/permissions-policy.json
  ```

---
