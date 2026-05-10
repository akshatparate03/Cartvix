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
