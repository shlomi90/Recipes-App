import express from 'express';
const router = express.Router()
import Member from '../Controllers/member_controller';
import authenticate from '../Common/auth_middleware'

router.get('/',authenticate,  Member.getAll.bind(Member));

router.get('/:id',authenticate, Member.get.bind(Member));

router.post('/',authenticate, Member.post.bind(Member));

router.put('/:id',authenticate, Member.put.bind(Member));

router.delete('/:id',authenticate, Member.delete.bind(Member));

export default router;
