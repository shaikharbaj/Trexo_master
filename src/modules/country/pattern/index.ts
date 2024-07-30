export const COUNTRY_MASTER_MS_PATTERN = {
  TCP: {
    fetchAllCountry: { role: 'fetchAllCountry', cmd: 'fetch-all-country' },
    fetchAllDeletedCountry: {
      role: 'fetchAllDeletedCountry',
      cmd: 'fetch-all-deleted-country',
    },
    fetchAllCountryForDropdown: {
      role: 'fetchAllCountryForDropdown',
      cmd: 'fetch-all-country-for-dropdown',
    },
    findCountryById: { role: 'findCountryById', cmd: 'find-country-by-id' },
    createCountry: { role: 'createCountry', cmd: 'create-country' },
    updateCountry: { role: 'updateCountry', cmd: 'update-country' },
    restoreCountry: { role: 'restoreCountry', cmd: 'restore-country' },
    deleteCountry: { role: 'deleteCountry', cmd: 'delete-country' },
    toggleCountryVisibility: {
      role: 'toggleCountryVisibility',
      cmd: 'toggle-country-visibility',
    },
  },
  KAFKA: {
    fetchAllCountry: 'fetchAllCountry',
    findCountryById: 'findCountryById',
    createCountry: 'createCountry',
    updateCountry: 'updateCountry',
    deleteCountry: 'deleteCountry',
    toggleCountryVisibility: 'toggleCountryVisibility',
    fetchAllDeletedCountry: 'fetchAllDeletedCountry',
    restoreCountry: 'restoreCountry',
    fetchAllCountryForDropdown: 'fetchAllCountryForDropdown',
  },
  REDIS: {},
  RABBITMQ: {},
};
