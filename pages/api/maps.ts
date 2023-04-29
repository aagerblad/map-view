// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export async function maps_api(query, lat, lng) {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&`
  // const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&query=${query}&location=${latlng}`;

  const searchParams = new URLSearchParams([['query', query], ['location', lat + "," + lng]])
  // const searchParams = new URLSearchParams([['query', query]])
  console.log(url + searchParams.toString())
  const res = await fetch(url + searchParams.toString());
  const resJson = await res.json();
  const data = {
    status: resJson.status,
    query: query,
    candidates: resJson.results.map((item) => {
      return {
        location: item.geometry.location,
        formatted_address: item.formatted_address,
        icon: item.icon,
        name: item.name,
        place_id: item.place_id,
        types: item.types,
      };
    }),
  };
  return { props: { data } };
}

export default async function handler(req, res) {
  const requestMethod = req.method;
  const search_query = req.query.search;
  const lat = req.query.lat;
  const lng = req.query.lng;

  const result = await maps_api(search_query, lat, lng)

  if(requestMethod == 'GET') {
    res.status(200).json({results: result })
  }
}