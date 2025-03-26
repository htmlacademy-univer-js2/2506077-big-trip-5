const offersByType = {
  Flight: [
    { id: 1, type: 'Flight', name: 'Priority Boarding', price: 10 },
    { id: 2, type: 'Flight', name: 'Extra Luggage', price: 25 },
    { id: 3, type: 'Flight', name: 'Meal Service', price: 15 }
  ],
  Train: [
    { id: 4, type: 'Train', name: 'Window Seat', price: 15 },
    { id: 5, type: 'Train', name: 'Extra Legroom', price: 20 },
    { id: 6, type: 'Train', name: 'Quiet Zone', price: 10 }
  ],
  Bus: [
    { id: 7, type: 'Bus', name: 'Food Package', price: 30 },
    { id: 8, type: 'Bus', name: 'Wi-Fi', price: 5 },
    { id: 9, type: 'Bus', name: 'Power Outlet', price: 3 }
  ],
  Sightseeing: [
    { id: 10, type: 'Sightseeing', name: 'Guide', price: 20 },
    { id: 11, type: 'Sightseeing', name: 'Skip the Line', price: 40 },
    { id: 12, type: 'Sightseeing', name: 'VIP Access', price: 50 }
  ],
  Taxi: [
    { id: 13, type: 'Taxi', name: 'VIP Transfer', price: 50 },
    { id: 14, type: 'Taxi', name: 'Pet-Friendly', price: 15 },
    { id: 15, type: 'Taxi', name: 'Airport Shuttle', price: 20 }
  ],
  Ship: [
    { id: 16, type: 'Ship', name: 'Ocean View', price: 30 },
    { id: 17, type: 'Ship', name: 'Premium Cabin', price: 100 },
    { id: 18, type: 'Ship', name: 'All-Inclusive', price: 150 }
  ],
  Drive: [
    { id: 19, type: 'Drive', name: 'Luxury Car', price: 75 },
    { id: 20, type: 'Drive', name: 'GPS Rental', price: 10 },
    { id: 21, type: 'Drive', name: 'Child Seat', price: 5 }
  ],
  'Check-in': [
    { id: 22, type: 'Check-in', name: 'Express Check-in', price: 5 },
    { id: 23, type: 'Check-in', name: 'Priority Check-in', price: 15 },
    { id: 24, type: 'Check-in', name: 'Seat Selection', price: 10 }
  ],
  Restaurant: [
    { id: 25, type: 'Restaurant', name: 'Wine Pairing', price: 30 },
    { id: 26, type: 'Restaurant', name: 'Tasting Menu', price: 50 },
    { id: 27, type: 'Restaurant', name: 'Chef’s Special', price: 40 }
  ]
};

const destinations = [
  {
    id: 1,
    name: 'Barcelona',
    description: `
      Cras aliquet varius magna, non porta ligula feugiat eget.
      Fusce tristique felis at fermentum pharetra.
      Aliquam id orci ut lectus varius viverra.
      Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.
    `,
    photos: ['https://loremflickr.com/248/152?random=1', 'https://loremflickr.com/248/152?random=2', 'https://loremflickr.com/248/152?random=3']
  },
  {
    id: 2,
    name: 'Tokyo',
    description: `
      Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.
      Sed sed nisi sed augue convallis suscipit in sed felis.
      Aliquam erat volutpat.
    `,
    photos: ['https://loremflickr.com/248/152?random=4']
  },
  {
    id: 3,
    name: 'New York',
    description: `
      Nunc fermentum tortor ac porta dapibus.
      In rutrum ac purus sit amet tempus.
    `,
    photos: ['https://loremflickr.com/248/152?random=5', 'https://loremflickr.com/248/152?random=6']
  },
  {
    id: 4,
    name: 'Sydney',
    description: `
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Cras aliquet varius magna, non porta ligula feugiat eget.
    `,
    photos: []
  },
  {
    id: 5,
    name: 'Paris',
    description: `
      Fusce tristique felis at fermentum pharetra.
    `,
    photos: ['https://loremflickr.com/248/152?random=7', 'https://loremflickr.com/248/152?random=8', 'https://loremflickr.com/248/152?random=9']
  },
  {
    id: 6,
    name: 'Rome',
    description: `
      Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.
      Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.
    `,
    photos: ['https://loremflickr.com/248/152?random=10']
  },
  {
    id: 7,
    name: 'London',
    description: `
      Aliquam erat volutpat.
      Nunc fermentum tortor ac porta dapibus.
    `,
    photos: ['https://loremflickr.com/248/152?random=11', 'https://loremflickr.com/248/152?random=12']
  },
  {
    id: 8,
    name: 'Berlin',
    description: `
      Aliquam id orci ut lectus varius viverra.

      Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.
      Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.
      Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.
      Sed sed nisi sed augue convallis suscipit in sed felis.
    `,
    photos: ['https://loremflickr.com/248/152?random=13']
  },
  {
    id: 9,
    name: 'Amsterdam',
    description: `
      Aliquam erat volutpat.
    `,
    photos: ['https://loremflickr.com/248/152?random=14', 'https://loremflickr.com/248/152?random=15', 'https://loremflickr.com/248/152?random=16', 'https://loremflickr.com/248/152?random=17']
  }
];

const mockRoutePoints = [
  {
    id: 1,
    dateFrom: new Date('2025-02-20T10:30:00'),
    dateTo: new Date('2025-02-20T11:30:00'),
    type: 'Flight',
    city: 'Barcelona',
    price: 1500,
    availableOfferIds: [1, 2, 3],
    selectedOfferIds: [1],
    destinationId: 1,
    isFavorite: true
  },
  {
    id: 2,
    dateFrom: new Date('2025-02-21T08:00:00'),
    dateTo: new Date('2025-02-21T10:00:00'),
    type: 'Train',
    city: 'Tokyo',
    price: 350,
    availableOfferIds: [4, 5, 6],
    selectedOfferIds: [5, 6],
    destinationId: 2,
    isFavorite: false
  },
  {
    id: 3,
    dateFrom: new Date('2025-03-08T07:00:00'),
    dateTo: new Date('2025-03-08T09:00:00'),
    type: 'Bus',
    city: 'New York',
    price: 80,
    availableOfferIds: [7, 8, 9],
    selectedOfferIds: [7],
    destinationId: 3,
    isFavorite: false
  },
  {
    id: 4,
    dateFrom: new Date('2025-03-08T09:00:00'),
    dateTo: new Date('2025-03-08T15:00:00'),
    type: 'Sightseeing',
    city: 'Sydney',
    price: 750,
    availableOfferIds: [10, 11, 12],
    selectedOfferIds: [10, 12],
    destinationId: 4,
    isFavorite: true
  },
  {
    id: 5,
    dateFrom: new Date('2025-03-24T11:00:00'),
    dateTo: new Date('2025-03-24T12:30:00'),
    type: 'Taxi',
    city: 'Paris',
    price: 40,
    availableOfferIds: [13, 14, 15],
    selectedOfferIds: [13, 14, 15],
    destinationId: 5,
    isFavorite: false
  },
  {
    id: 6,
    dateFrom: new Date('2025-03-26T15:00:00'),
    dateTo: new Date('2025-03-26T16:30:00'),
    type: 'Ship',
    city: 'Rome',
    price: 600,
    availableOfferIds: [16, 17, 18],
    selectedOfferIds: [18],
    destinationId: 6,
    isFavorite: true
  },
  {
    id: 7,
    dateFrom: new Date('2025-03-28T12:00:00'),
    dateTo: new Date('2025-03-28T13:30:00'),
    type: 'Drive',
    city: 'London',
    price: 350,
    availableOfferIds: [19, 20, 21],
    selectedOfferIds: [21],
    destinationId: 7,
    isFavorite: false
  },
  {
    id: 8,
    dateFrom: new Date('2025-04-01T09:00:00'),
    dateTo: new Date('2025-04-01T10:30:00'),
    type: 'Check-in',
    city: 'Berlin',
    price: 200,
    availableOfferIds: [22, 23, 24],
    selectedOfferIds: [22, 23],
    destinationId: 8,
    isFavorite: true
  },
  {
    id: 9,
    dateFrom: new Date('2025-04-02T18:00:00'),
    dateTo: new Date('2025-04-02T18:30:00'),
    type: 'Restaurant',
    city: 'Amsterdam',
    price: 500,
    availableOfferIds: [25, 26, 27],
    selectedOfferIds: [26, 27],
    destinationId: 9,
    isFavorite: true
  },
  {
    id: 10,
    dateFrom: null,
    dateTo: null,
    type: '',
    city: '',
    price: 0,
    availableOfferIds: [],
    selectedOfferIds: [],
    destinationId: null,
    isFavorite: false
  }
];

export { mockRoutePoints, offersByType, destinations };
