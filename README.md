# Udemy microservices app
https://www.udemy.com/course/microservices-with-node-js-and-react

## Useful commands
- use minikube : `minikube start`
- install ingress-nginx : `minikube addons enable ingress`
- start skaffold : `skaffold dev`
- allow selfsigned certificate : `thisisunsafe`
- Publish npm package : `npm version patch && npm run build && npm publish`

## Secrets
`k create secret generic jwt-secret --from-literal=JWT_KEY=asdf`
`k create secret generic stripe-secret --from-literal=STRIPE_key=sk_test_51JUVXJA6sZRDf3WnmYpbIJO5NNeSPFzGnNseB3y1l6f3ynxr3QpmpekHi1Mgnw7cyn5kw6L66kMobQ8Xb9e7zCcd001ddafVZQ`
