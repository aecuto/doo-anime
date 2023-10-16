# Doo anime

site: [https://doo-anime.vercel.app/](https://doo-anime.vercel.app/)

`doo-anime = doo(watch)-anime in my lang :)`

## stack tech
- react-nextjs
- api-serverless-nextjs
- mongo with mongoose

## Getting Started

First, run the development server:


### add .env.local

```sh
MONGO_URL=mongodb://root:example@localhost:27017/doo-anime?authSource=admin
# MONGO_URL=mongodb+srv://[username]:[password]@[mongo_domain]/doo-anime
# Don't forget remove `[]`
```

### Run following commands

```sh
npm ci

docker compose up -d

npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

