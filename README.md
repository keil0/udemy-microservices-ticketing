# Udemy microservices app
https://www.udemy.com/course/microservices-with-node-js-and-react

## Issues
- use minikube : `minikube start`
- install ingress-nginx : `minikube addons enable ingress`
- start skaffold : `skaffold dev`
- allow selfsigned certificate : `thisisunsafe`

## Secrets
`k create secret generic jwt-secret --from-literal=JWT_KEY=asdf`
