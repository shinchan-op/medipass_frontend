@echo off
echo Starting Medipass Development Environment...

REM Create data directory if it doesn't exist
if not exist "C:\data\db" mkdir "C:\data\db"

REM Start MongoDB (adjust the path according to your MongoDB installation)
start "MongoDB" "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"

REM Wait for MongoDB to start
timeout /t 5

REM Initialize the database
echo Initializing database...
"C:\Program Files\MongoDB\Server\7.0\bin\mongosh.exe" < scripts/init-db.js

REM Start the development server
echo Starting development server...
npx nodemon 