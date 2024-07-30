export const DIVISION_MASTER_MS_PATTERN: any = {
    TCP: {
        fetchAllDivision: {
            role: 'fetchAllDivision',
            cmd: 'fetch-all-division'
        },
        fetchAllDeletedDivision: {
            role: 'fetchAllDeletedDivision',
            cmd: 'fetch-all-deleted-division'
        },
        fetchAllDivisionForDropdown: {
            role: 'fetchAllDivisionForDropdown',
            cmd: 'fetch-all-division-for-dropdown'
        },
        findDivisionById: {
            role: 'findDivisionById',
            cmd: 'find-division-by-id'
        },
        createDivision: {
            role: 'createDivision',
            cmd: 'create-division'
        },
        updateDivision: {
            role: 'updateDivision',
            cmd: 'update-division'
        },
        restoreDivision: {
            role: 'restoreDivision',
            cmd: "restore-division"
        },
        toggleDivisionVisibility: {
            role: 'toggleDivisionVisibility',
            cmd: 'toggle-division-visibility'
        },
        deleteDivision: {
            role: 'deleteDivision',
            cmd: 'delete-division'
        },

    },
    KAFKA: {
        fetchAllDivision: 'fetchAllDivision',
        fetchAllDeletedDivision: 'fetchAllDeletedDivision',
        fetchAllDivisionForDropdown: 'fetchAllDivisionForDropdown',
        findDivisionById: 'findDivisionById',
        createDivision: 'createDivision',
        updateDivision: 'updateDivision',
        restoreDivision: 'restoreDivision',
        toggleDivisionVisibility: 'toggleDivisionVisibility',
        deleteDivision: 'deleteDivision',
    },
    REDIS: [],
    RABBITMQ: [],
};
