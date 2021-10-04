#How to start
1. export HOST_IP=$(ifconfig | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" | grep -v 127.0.0.1 | awk '{ print $2 }' | cut -f2 -d: | head -n1)
2. docker-compose up -d
3. npm run start:dev

#How to run test
npm run test:e2e

#Scalability
1. The solution also requires to make a materialized view containing fields: Day, Amount, user_id, merchant_id, to avoid calculations on the period intersections.
2. The solution also requires to make table Transactions partitioned by month(previous months) and close to now dates should be in daily partitions
3. The writing should be using through kafka
4. If the task is changed to "show the rank over all period from beginning to the <TO> date" the solution can have dramatically improved performance
