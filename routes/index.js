const express=require('express');
const router=express.Router();
const IndexController=require('../controllers/indexController');

router.get('/',IndexController.homeController);


router.post('/create-list',IndexController.createList);//Create Interview
router.get('/delete',IndexController.DeleteList);//Delete INterview
router.post('/add',IndexController.addParticipant);// API for creating participants
router.get('/info',IndexController.getInfo);
router.post('/edit-list',IndexController.edit);

module.exports=router;