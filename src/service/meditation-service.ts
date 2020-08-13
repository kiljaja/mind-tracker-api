import { meditationRepository } from '../repository/meditation-repository';
import moment from 'moment';

export const add = async (username: string, postingDate: string = '') => {
  const date = postingDate === '' ? moment() : moment(postingDate);
  if (!date.isValid())
    throw new Error(`Error: ${postingDate} is not a valid date`);
  return await meditationRepository.add(username, date);
};

export const getAllMeditations = async (username: string = '') => {
  if (username === '') throw new Error(`Error: no user provided`);
  return await meditationRepository.getByUsername(username);
};

export const deleteById = async (id: number) => {
  if (id <= 0) throw new Error(`Error: ID:${id} is not a valid number`);
  return await meditationRepository.deleteById(id);
};

export const updateById = async (
  id: number,
  postingDate: string = '',
  awarenessPoints: number
) => {
  if (id <= 0) throw new Error(`Error: ID:${id} is not a valid number`);
  if (awarenessPoints <= 0)
    throw new Error(
      `Error: awarenessPoints:${awarenessPoints} is not a valid number`
    );
  const date = postingDate === '' ? moment() : moment(postingDate);
  if (!date.isValid())
    throw new Error(`Error: ${postingDate} is not a valid date`);

  return await meditationRepository.updateById(id, date, awarenessPoints);
};

export const meditationService = {
  add,
  getAllMeditations,
  deleteById,
  updateById,
};
