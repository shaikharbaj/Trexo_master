export const STATE_MASTER_MS_PATTERN = {
  TCP: {
    fetchAllState: { role: 'fetchAllState', cmd: 'fetch-all-state' },
    fetchAllDeletedState: {
      role: 'fetchAllDeletedState',
      cmd: 'fetch-all-deleted-state',
    },
    fetchAllStateForDropdown: {
      role: 'fetchAllStateForDropdown',
      cmd: 'fetch-all-state-for-dropdown',
    },
    findStateById: { role: 'findStateById', cmd: 'find-state-by-id' },
    createState: { role: 'createState', cmd: 'create-state' },
    updateState: { role: 'updateState', cmd: 'update-state' },
    restoreDeletedState: {
      role: 'restoreDeletedState',
      cmd: 'restore-deleted-state',
    },
    deleteState: { role: 'deleteState', cmd: 'delete-state' },
    toggleStateVisibility: {
      role: 'toggleStateVisibility',
      cmd: 'toggle-state-visibility',
    },
    
  },
  KAFKA: {
    fetchAllState: 'fetchAllState',
    fetchAllDeletedState: 'fetchAllDeletedState',
    fetchAllStateForDropdown: 'fetchAllStateForDropdown',
    findStateById: 'findStateById',
    createState: 'createState',
    updateState: 'updateState',
    restoreDeletedState: 'restoreDeletedState',
    deleteState: 'deleteState',
    toggleStateVisibility: 'toggleStateVisibility',
  },
  REDIS: {},
  RABBITMQ: {},
};
