import sql from 'mssql';
import { env } from './env.js';

let pool;

export async function getDb() {
  if (pool) return pool;
  pool = await sql.connect(env.sql);
  return pool;
}

export async function queryDb(strings, ...values) {
  const db = await getDb();
  const request = db.request();
  values.forEach((value, index) => {
    request.input(`p${index}`, value);
  });

  const text = strings.reduce((acc, chunk, index) => {
    if (index === strings.length - 1) return acc + chunk;
    return `${acc}${chunk}@p${index}`;
  }, '');

  return request.query(text);
}
