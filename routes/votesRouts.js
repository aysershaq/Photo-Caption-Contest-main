const votesRouter = require('express').Router();
const { ensureAuth } = require('../middlewares/auth');
const votesController = require('../controllers/votesControllers');
// Vote (add)
votesRouter.post('/add-vote/:captionId', ensureAuth, votesController.createVote);

// Unvote (remove)
votesRouter.delete('/delete-vote/:captionId', ensureAuth, votesController.deleteVote);

// Vote stats for a caption
votesRouter.get('/captions/:captionId', ensureAuth, votesController.getCaptionVoteStats);

module.exports = votesRouter;
