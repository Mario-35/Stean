import { dbTest } from "../dbTest";

export const executeQuery = async (sql: string): Promise<object> => {    
    return new Promise(async function (resolve, reject) {
        await dbTest.unsafe(sql).then((res: Record<string, any>) => {           
                resolve(res[0]);
            }).catch((err: Error) => {                
                reject(err);
            });
    });
};


export const last = (table: string, all?: boolean) => `SELECT ${all ? '*' : 'id'} FROM "${table}" ORDER BY id desc LIMIT 1`;
export const count = (table: string) => `SELECT count(*)::int FROM "${table}"`;