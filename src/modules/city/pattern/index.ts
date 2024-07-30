export const CITY_MASTER_MS_PATTERN = {
  TCP: {
    fetchAllCity: { role: 'fetchAllCity', cmd: 'fetch-all-city' },
    fetchAllDeletedCity: {
      role: 'fetchAllDeletedCity',
      cmd: 'fetch-all-deleted-city',
    },
    fetchAllCityForDropdown: {
      role: 'fetchAllCityForDropdown',
      cmd: 'fetch-all-city-for-dropdown',
    },
    findCityById: { role: 'findCityById', cmd: 'find-city-by-id' },
    createCity: { role: 'createCity', cmd: 'create-city' },
    updateCity: { role: 'updateCity', cmd: 'update-city' },
    restoreDeletedCity: {
      role: 'restoreDeletedCity',
      cmd: 'restore-deleted-city',
    },
    deleteCity: { role: 'deleteCity', cmd: 'delete-city' },
    toggleCityVisibility: {
      role: 'toggleCityVisibility',
      cmd: 'toggle-city-visibility',
    },
  },
  KAFKA: {
    fetchAllCity: 'fetchAllCity',
    fetchAllDeletedCity: 'fetchAllDeletedCity',
    fetchAllCityForDropdown: 'fetchAllCityForDropdown',
    findCityById: 'findCityById',
    createCity: 'createCity',
    updateCity: 'updateCity',
    restoreDeletedCity: 'restoreDeletedCity',
    deleteCity: 'deleteCity',
    toggleCityVisibility: 'toggleCityVisibility',
  },
  REDIS: {},
  RABBITMQ: {},
};
