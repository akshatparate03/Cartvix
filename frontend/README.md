# Database Commands

cd backend
docker start cartvix-postgres
docker start cartvix-redis

# Backend Commands

cd backend
mvn spring-boot:run "-Dspring-boot.run.jvmArguments=-Duser.timezone=Asia/Kolkata"
mvn clean install -DskipTests

# Frontend Commands

cd frontend
npm run dev
npm install

# Github Commands

git status
git init
git add .
git commit -m "SEO Optimized"
git pull origin main
git push origin main
