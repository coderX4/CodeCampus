set FRONTEND_URL=http://localhost:5173

set MONGODB_URL=mongodb+srv://deepghosh622:lmJp3C0bdeE4sIIx@cluster0.wsasb.mongodb.net/coding_platform?retryWrites=true&w=majority

set JWT_SECRET_KEY=sLk3XuvZY1PbjaGvDzj1fZN3UXB6dlPhtzGdV+J+Z2U=

set GOOGLE_CLIENT_ID=499389628604-4n8c6ippq5jg6feackn5grnnvvqnnkd9.apps.googleusercontent.com
set GOOGLE_CLIENT_SECRET_KEY=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
set GOOGLE_REDIRECT_URI=http://localhost:8083/login/oauth2/code/google

set GITHUB_CLIENT_ID=Ov23lilySpkvnWZv2h2q
set GITHUB_CLIENT_SECRET_KEY=5b125a01ee14ced5d52ce4528d7d525b76582bf4
set GITHUB_REDIRECT_URI=http://localhost:8083/login/oauth2/code/github

set MAIL_ACCOUNT=9otesapp@gmail.com
set MAIL_ACCOUNT_APP_PASSWORD=akdenetodaustvph

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