export function createQuery(params) {
  const url =
    `https://maps.googleapis.com/maps/api/place/textsearch/json?` +
    `key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&`;
  const searchParams = new URLSearchParams(params);
  return url + searchParams.toString();
}

export async function callAPI(query: RequestInfo | URL) {
  const res = await fetch(query);
  const resJson = await res.json();
  return resJson;
}

export async function mapsAPI(params) {
  const query = createQuery(params);

  console.log(query);
  var resultData = await callAPI(query);

  console.log(resultData);

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

export default async function handler(req, res) {
  const requestMethod = req.method;
  const params = {
    query: req.query.search_query,
    location: req.query.location,
  };

  const result = await mapsAPI(params);

  if (requestMethod == "GET") {
    res.status(200).json({ results: result });
  }
}
