const express=require('express');
const router=express.Router();
const protect=require("../middlewares/authMiddleware");
const { accessChats, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require('../controllers/chatController');

router.route("/").post(protect,accessChats);
router.route("/").get(protect,fetchChats);
router.route("/group").post(protect,createGroupChat);
router.route("/rename").post(protect,renameGroup);
router.route("/add").post(protect,addToGroup);
router.route("/remove").post(protect,removeFromGroup);


module.exports =router;