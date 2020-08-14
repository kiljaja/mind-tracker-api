import express, { Response, Request, Router, NextFunction } from 'express';
import passport from 'passport';
import { meditationService } from '../service/meditation-service';

export const meditationController: Router = express.Router();

interface CustomUser {
  username: string;
}

meditationController.use(
  passport.authenticate('jwt', { session: false, failWithError: true })
);

meditationController.get('/', async (req: Request, res: Response) => {
  try {
    const { username } = req.user as CustomUser;
    const allMeditations = await meditationService.getAllMeditations(username);
    res.status(200).json({
      message: 'Successful list of meditation',
      data: allMeditations,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

meditationController.post('/', async (req: Request, res: Response) => {
  try {
    const { username } = req.user as CustomUser;
    const { postingDate } = req.body;
    const newMeditation = await meditationService.add(username, postingDate);
    res.status(201).json({
      message: 'Successful at creating/updating a meditation',
      data: newMeditation,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

meditationController.put('/', async (req: Request, res: Response) => {
  try {
    const { id, postingDate, awarenessPoints } = req.body;
    const updatedMeditation = await meditationService.updateById(
      id,
      postingDate,
      awarenessPoints
    );
    res.status(200).json({
      message: 'Successful updating a meditation',
      data: updatedMeditation,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

meditationController.delete('/', async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const updatedMeditation = await meditationService.deleteById(id);
    res.status(200).json({
      message: 'Successful at deleting a meditation',
      data: updatedMeditation,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Handle JWT Errors
meditationController.use(
  async (err: any, req: Request, res: Response, next: NextFunction) => {
    return res.status(401).send({ message: 'Invalid JWT Token' });
  }
);
