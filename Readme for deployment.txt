set FRONTEND_URL=http://localhost:5173

set MONGODB_URL=

set JWT_SECRET_KEY=
set GOOGLE_CLIENT_ID=
set GOOGLE_CLIENT_SECRET_KEY=
set GOOGLE_REDIRECT_URI=http://localhost:8083/login/oauth2/code/google

set GITHUB_CLIENT_ID=
set GITHUB_CLIENT_SECRET_KEY=
set GITHUB_REDIRECT_URI=http://localhost:8083/login/oauth2/code/github

set MAIL_ACCOUNT=9otesapp@gmail.com
set MAIL_ACCOUNT_APP_PASSWORD=

set PISTON_C_VERSION=10.2.0
set PISTON_CPP_VERSION=10.2.0
set PISTON_JAVA_VERSION=15.0.2
set PISTON_API_URI=https://emkc.org/api/v2/piston/execute

use the command prompt for packageing 

command : mvnw package

docker dommands

1. docker build -t notesforge-deployment .

2. docker tag notesforge-deployment02  deepghosh/notesforge-deployment02:latest

3. docker push deepghosh/notesforge-deployment02:latest
