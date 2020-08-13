import { pool } from '../db/db';
const TABLE = 'meditation';

export const add = async (username: string, posting_date: moment.Moment) => {
  const SQL: string = `
  INSERT INTO ${TABLE} as m (posting_date, username)
	VALUES ($1, $2) 
	ON CONFLICT ON CONSTRAINT unique_entry 
		DO UPDATE SET entries = m.entries + 1 
      where m.posting_date = EXCLUDED.posting_date AND m.username = EXCLUDED.username
  RETURNING *;
`;
  const PARAMS: [moment.Moment, String] = [posting_date, username];
  return (await pool.query(SQL, PARAMS)).rows[0];
};

export const meditationRepository = {
  add,
};
