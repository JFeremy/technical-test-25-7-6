import { ACTIONS } from '../enums';

export type Instruction = (typeof ACTIONS)[number];
