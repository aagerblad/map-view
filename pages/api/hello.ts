// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(req, res) {
  const requestMethod = req.method;
  const body = JSON.parse(req.body);
  console.log("here's the api")
  console.log(body)
  switch (requestMethod) {
    case 'POST':
      res.status(200).json({ message: `You submitted the following data: ${body.post}` })
      
    // handle other HTTP methods
    // default:
    //   res.status(200).json({ message: 'Welcome to API Routes!'})
  }
}