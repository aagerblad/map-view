import { NextResponse } from "next/server";

function createQuery(params) {
  const url =
    `https://maps.googleapis.com/maps/api/place/textsearch/json?` +
    `key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&`;
  const searchParams = new URLSearchParams(params);
  return url + searchParams.toString();
}

async function callAPI(query: RequestInfo | URL) {
  const res = await fetch(query);
  const resJson = await res.json();
  return resJson;
}

async function mapsAPI(params) {
  const query = createQuery(params);

  console.log("query:", query);
  var resultData = await callAPI(query);

  // console.log("resultData:", resultData);

  const data = {
    status: resultData.status,
    candidates: resultData.results.map((item) => {
      return {
        location: item.geometry.location,
        formattedAddress: item.formatted_address,
        icon: item.icon,
        name: item.name,
        placeId: item.place_id,
        types: item.types,
      };
    }),
    nextPageToken: resultData.next_page_token,
  };

  return data;
}

export async function GET(req: Request) {
  const params = {
    query: req.headers.get("searchQuery"),
    location: req.headers.get("location"),
  };

  const result = await mapsAPI(params);

  console.log("result:", result);

  return NextResponse.json({ results: result });
}
