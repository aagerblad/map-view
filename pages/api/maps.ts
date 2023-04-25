// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export async function maps_api(query) {
  const q = query;
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&query=${q}`;
  const res = await fetch(url);
  const resJson = await res.json();
  const data = {
    status: resJson.status,
    query: query,
    candidates: resJson.results.map((item) => {
      console.log(item)
      // let image = "";

      // if ("photos" in item) {
      //   image = `https://maps.googleapis.com/maps/api/place/photo?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&maxwidth=400&photoreference=${item.photos[0].photo_reference}`;
      // }

      return {
        location: item.geometry.location,
        formatted_address: item.formatted_address,
        icon: item.icon,
        name: item.name,
        place_id: item.place_id,
        types: item.types,
        // image: image,
      };
    }),
  };
  return { props: { data } };
}

export default async function handler(req, res) {
  const requestMethod = req.method;
  const search_query = req.query.search;

  const result = await maps_api(search_query)

  if(requestMethod == 'GET') {
    res.status(200).json({results: result })
  }
}