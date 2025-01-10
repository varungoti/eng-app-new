# API Documentation

## Authentication API
- POST /auth/login
- POST /auth/logout
- POST /auth/refresh
- GET /auth/user

## Schools API
- GET /schools
- POST /schools
- PUT /schools/:id
- DELETE /schools/:id

## Content API
- GET /content/grades
- GET /content/topics
- GET /content/lessons
- POST /content/:type
- PUT /content/:type/:id

## Sales API
- GET /sales/leads
- GET /sales/opportunities
- POST /sales/leads
- PUT /sales/leads/:id

## Events API
- GET /events
- POST /events
- PUT /events/:id
- DELETE /events/:id

## Students API
- GET /students
- POST /students
- PUT /students/:id
- DELETE /students/:id

## Reports API
- GET /reports
- POST /reports/generate
- GET /reports/download/:id

Detailed API documentation with request/response examples available in Swagger UI at /api-docs