const { Router } = require('express');
const isAuthenticated = require("../../middlewares/isAuthenticated.js");
const multer = require('multer');
const express = require('express');

const {
  create,
  changeUserRole,
  documents
} = require("../../controllers/user.controller.js");

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', create);
router.put('/:uid', isAuthenticated, changeUserRole);
router.post('/:uid/documents', upload.array('documents'), documents);

module.exports = router;
