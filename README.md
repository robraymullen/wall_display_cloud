# Wall Display 
Projects for the kitchen wall display

## Frontend
A react based frontend

## Backend 
A small Rust server

### Building and deploying
Build frontend:
docker build . -t 192.168.0.10:32000/display_frontend
docker push 192.168.0.10:32000/display_frontend
Then on the server:
k rollout restart deployment/display-frontend-deployment

Build backend:
docker build . -t 192.168.0.10:32000/display_backend
docker push 192.168.0.10:32000/display_backend
Then on the server:
k rollout restart deployment/display-backend-deployment