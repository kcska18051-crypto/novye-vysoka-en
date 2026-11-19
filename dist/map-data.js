(function (root, factory) {
  const data = factory();
  if (typeof module === 'object' && module.exports) module.exports = data;
  root.NOVYE_VYSOKA_MAP_DATA = data;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const unknown = 'On request';
  const quarters = [
    { id: 'quarter-1', name: 'Neighbourhood 1', category: 'quarters', x: 33, y: 28, image: 'assets/quarters/quarter-1.webp', pricePerSotka: unknown, free: unknown, reserved: unknown, sold: unknown, distances: [], description: 'Northern part of the master plan. Open the plan to see the plot layout.' },
    { id: 'quarter-2', name: 'Neighbourhood 2', category: 'quarters', x: 30, y: 51, image: 'assets/quarters/quarter-2.webp', pricePerSotka: unknown, free: unknown, reserved: unknown, sold: unknown, distances: [], description: 'Western part of the master plan. Open the plan to see the plot layout.' },
    { id: 'quarter-3', name: 'Neighbourhood 3', category: 'quarters', x: 51, y: 66, image: 'assets/quarters/quarter-3.webp', pricePerSotka: unknown, free: unknown, reserved: unknown, sold: unknown, distances: [], description: 'Plots along the central road. Current availability can be requested from the project team.' },
    { id: 'quarter-4', name: 'Neighbourhood 4', category: 'quarters', x: 76, y: 72, image: 'assets/quarters/quarter-4.webp', pricePerSotka: unknown, free: unknown, reserved: unknown, sold: unknown, distances: [], description: 'Eastern part of the master plan. Open the plan to see the plot layout.' },
    { id: 'quarter-5', name: 'Neighbourhood 5', category: 'quarters', x: 83, y: 88, image: 'assets/quarters/quarter-5.webp', pricePerSotka: unknown, free: unknown, reserved: unknown, sold: unknown, distances: [], description: 'South-eastern part of the master plan. Current availability can be requested from the project team.' }
  ];

  const objects = [
    { id: 'forest', name: 'Vysokovsky Bor', category: 'nature', x: 43, y: 43, image: 'assets/forest-path.webp', description: 'Pine forest beside the project area — a space for walks, mushroom picking and quiet weekends.', facts: ['Pine forest', 'Walking trails'] },
    { id: 'beach', name: 'Beach', category: 'nature', x: 8, y: 31, image: 'assets/quiet-beach.webp', description: 'A sandy shore by open water for walks and summer relaxation.', facts: ['Volga shore', 'Exact location to be confirmed'] },
    { id: 'pier', name: 'Pier', category: 'infrastructure', x: 9, y: 46, image: 'assets/forest-v2/pier-client.webp', description: 'The project concept includes a waterside spot for boats and trips on the Volga.', facts: ['Project concept', 'Location to be confirmed'] },
    { id: 'restaurant', name: 'Restaurant', category: 'infrastructure', x: 62, y: 23, image: 'assets/map-objects/restaurant.webp', imageFallback: 'assets/terrace-family.webp', description: 'An image of a future place for family meals and gatherings close to nature.', facts: ['Visualisation of a future facility'] },
    { id: 'camp', name: 'Vysokovsky Bor children’s camp', category: 'infrastructure', x: 25, y: 37, image: 'assets/forest-water.webp', description: 'A children’s holiday camp in a pine forest on the Volga shore.', facts: ['101 Degtyaritsy village'] },
    { id: 'school', name: 'Nikolo-Korma Education Centre', category: 'infrastructure', x: 91, y: 76, imageFallback: 'assets/territory-panorama.jpg', description: 'An educational complex named after G. A. Troitsky.', facts: ['18 Mira Street, Nikolskoye village'] },
    { id: 'shop-five', name: 'Pyaterochka', category: 'infrastructure', x: 94, y: 67, imageFallback: 'assets/territory-panorama.jpg', description: 'A grocery shop near the project.', facts: ['22 Svetlaya Street, Nikolo-Korma village'] },
    { id: 'shop-ryzhik', name: 'Ryzhik', category: 'infrastructure', x: 92, y: 83, imageFallback: 'assets/territory-panorama.jpg', description: 'A grocery shop in Nikolskoye.', facts: ['42 Tsentralnaya Street, Nikolskoye village'] },
    { id: 'church-nicholas', name: 'Church of St Nicholas the Wonderworker', category: 'infrastructure', x: 88, y: 79, imageFallback: 'assets/territory-panorama.jpg', description: 'Church of St Nicholas the Wonderworker in Nikolo-Korma.', facts: ['Nikolo-Korma'] },
    { id: 'church-presentation', name: 'Church of the Presentation', category: 'infrastructure', x: 86, y: 74, imageFallback: 'assets/territory-panorama.jpg', description: 'Church of the Presentation of the Blessed Virgin Mary near the project.', facts: ['Exact location shown on the map'] },
    { id: 'bus-stop', name: 'Degtyaritsy bus stop', category: 'transport', x: 56, y: 17, imageFallback: 'assets/route-map.png', description: 'Public transport stop on road 78N-0704.', facts: ['Bus 190', 'Route to Rybinsk'], mapUrl: 'https://yandex.ru/maps/?ll=38.516917%2C57.911129&z=16.61' }
  ];

  return Object.freeze({
    categories: Object.freeze([
      { id: 'all', label: 'All' },
      { id: 'quarters', label: 'Neighbourhoods' },
      { id: 'nature', label: 'Nature' },
      { id: 'infrastructure', label: 'Infrastructure' },
      { id: 'transport', label: 'Transport' }
    ]),
    quarters: Object.freeze(quarters),
    objects: Object.freeze(objects)
  });
});
