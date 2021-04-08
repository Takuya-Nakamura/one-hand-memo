const MemoSchema = {

    name: 'Memo',
    primaryKey: 'id',
    properties: {
        id: 'string',
        text: 'string',
        order: 'int',
        created: 'date',
        updated: 'date',
    }
};
const SettingSchema = {
    name: 'Setting',
    primaryKey: 'id',
    properties: {
        id: 'string',
        hand: 'string',
    }
}
export const realmOptions = {
    schemaVersion: 1,
    schema: [MemoSchema, SettingSchema],
    migration: (oldRealm, newRealm) => {
        // only apply this change if upgrading to schemaVersion 1
    }
}
