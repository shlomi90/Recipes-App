import createController from "./Base_Controller";
import Member from '../Models/member_model';
import { IMember } from "../Models/member_model";

const memberController = createController<IMember>(Member);



export = memberController



