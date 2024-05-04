import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { escape } from 'mysql2';

import { poolConn } from '../conn';

export async function loadApiKeys () {
  const pool = await poolConn();
  if (!pool) {
    return [];
  }
  const [rows] = await pool.query<RowDataPacket[]>("SELECT name, apiKey FROM projects WHERE enabled = 1");
  const allKeys = rows.map((row: any) => {
    return { appName: row.name, apiKey: row.apiKey };
  });

  return allKeys;
}

export async function logError (appName: string, type: 'Critical'| 'General'| 'Warning'| 'Other' , code: string, location: string, message: string ): Promise<boolean> {
  const pool = await poolConn();
  if (!pool) {
    return false;
  }
  try {

    let EappName = escape(appName);
    let Etype = escape(type);
    let Ecode = escape(code);
    let Elocation = escape(location);
    let Emessage = escape(message);

    const query = `
      SET @project_id = (SELECT id FROM projects WHERE name = ${EappName});
      INSERT INTO errors (project_id, type, code, location, message) VALUES (@project_id, ${Etype}, ${Ecode}, ${Elocation}, ${Emessage});
    `;

    const [rows] = await pool.query<ResultSetHeader>(query);

    return rows.affectedRows > 0;
  } 
  catch (e) {
    console.error(e);
    return false;
  }
}

export async function logStats (appName: string, identifier: string): Promise<boolean> {
  const pool = await poolConn();
  if (!pool) {
    return false;
  }
  try {
    const query = `
      SET @project_id = (SELECT id FROM projects WHERE name = ?);
      INSERT INTO stats (project_id, identifier) VALUES (@project_id, ?);
    `

    const [rows] = await pool.query<ResultSetHeader>(query, [appName, identifier]);

    return rows.affectedRows > 0;
  } 
  catch (e) {
    console.error(e);
    return false;
  }
}