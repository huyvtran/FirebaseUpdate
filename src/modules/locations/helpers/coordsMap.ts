import Polyline from '@mapbox/polyline';

const encodedPath = (encode) => {
  const points = Polyline.decode(encode);
  const coords = points.map((point, index) => ({
    latitude: point[0],
    longitude: point[1],
  }));
  return coords;
};

const allCoords = [];
const coordsMap = (task) => {
  task.map((e) => {
    const coords = e.encodedPath && encodedPath(e.encodedPath);
    allCoords.push(coords);
  });
  return allCoords;
};

export { coordsMap };

