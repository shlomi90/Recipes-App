import express from 'express';
const router = express.Router()
import CommentsController from '../Controllers/comments_controller';
import authenticate from '../Common/auth_middleware'

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comments management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - content       
 *       properties:
 *         content:
 *           type: string
 *           description: The content of the comment.
 *         author:
 *           type: string
 *           description: The author of the comment.
 *         post_id:
 *           type: string
 *           description: The ID of the associated post.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the comment was created.
 *       example:
 *         content: 'This is a comment.'
 *         author: 'JohnDoe'
 *         post_id: '5f70a5d259b2b9a2b6c244ae'
 *         createdAt: '2022-01-15T12:34:56Z'
 */

/**
 * @swagger
 * paths:
 *   /post/{postId}/comments:
 *     post:
 *       summary: Create a new comment for a post
 *       tags: [Comments]
 *       security:
 *        - bearerAuth: []
 *       parameters:
 *         - name: postId
 *           in: path
 *           required: true
 *           description: The ID of the post
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       responses:
 *         '201':
 *           description: The created comment
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Comment'
 *         '400':
 *           description: Bad Request
 *           content:
 *             application/json:
 *               example:
 *                 error: "Failed to create a new comment."
 *                 details: "Bad Request. Please check your input."
 */



router.post('/post/:postId/comments', authenticate, CommentsController.post.bind(CommentsController));

/**
 * @swagger
 * paths:
 *   /post/{postId}/comments:
 *     get:
 *       summary: Get all comments for a post
 *       tags: [Comments]
 *       security:
 *        - bearerAuth: []
 *       parameters:
 *         - name: postId
 *           in: path
 *           required: true
 *           description: The ID of the post
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: An array of comments
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Comment'
 *         '400':
 *           description: Bad Request
 *           content:
 *             application/json:
 *               example:
 *                 error: "Failed to retrieve comments."
 *                 details: "Bad Request. Please check your input."
 */

router.get('/post/:postId/comments',authenticate, CommentsController.get.bind(CommentsController));

/**
 * @swagger
 * paths:
 *   /post/{postId}/comments/{commentId}:
 *     delete:
 *       summary: Delete a comment
 *       tags: [Comments]
 *       security:
 *        - bearerAuth: []
 *       parameters:
 *         - name: postId
 *           in: path
 *           required: true
 *           description: The ID of the post
 *           schema:
 *             type: string
 *         - name: commentId
 *           in: path
 *           required: true
 *           description: The ID of the comment
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: The comment was deleted
 *         '400':
 *           description: Bad Request
 *           content:
 *             application/json:
 *               example:
 *                 error: "Failed to delete comment."
 *                 details: "Bad Request. Please check your input."
 */
router.delete('/post/:postId/comments/:commentId', authenticate, CommentsController.delete.bind(CommentsController)); 

export default router;
