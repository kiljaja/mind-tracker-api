import { pool } from '../db/db';
const TABLE = 'meditation';
const DEFAULT_LIMIT = 100;

export const add = async (username: string, posting_date: moment.Moment) => {
  const SQL: string = `
    INSERT INTO ${TABLE} as m (posting_date, username)
	    VALUES ($1, $2) 
	  ON CONFLICT ON CONSTRAINT unique_entry 
		  DO UPDATE SET awareness_points = m.awareness_points + 1 
      where m.posting_date = EXCLUDED.posting_date AND m.username = EXCLUDED.username
    RETURNING *;
  `;

  const PARAMS: [moment.Moment, string] = [posting_date, username];
  return (await pool.query(SQL, PARAMS)).rows[0];
};

export const getByUsername = async (username: string) => {
  const SQL: string = `
  SELECT id, posting_date, username, awareness_points FROM ${TABLE} 
    WHERE username = $1
    LIMIT ${DEFAULT_LIMIT};
  `;

  const PARAMS: [string] = [username];
  return (await pool.query(SQL, PARAMS)).rows[0];
};

export const meditationRepository = {
  add,
  getByUsername,
};
