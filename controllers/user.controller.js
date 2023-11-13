const ManagerFactory = require('../dao/managers/manager.Mongo/factory.manager.js');
const express = require('express');
const multer = require('multer');
const UserModel = require('../dao/models/user.model.js');

const userManager = ManagerFactory.getManagerInstance('users');

const create = async (req, res) => {
  const { body } = req;
  const created = await userManager.create(body);
  res.send(created);
}

const changeUserRole = async (req, res) => {
  const userId = req.params.uid;
  const newRole = req.body.role;

  if (req.isAuthenticated()) {
    try {
      const userToChange = await userManager.getById(userId);

      if (!userToChange) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }

      if (req.user.role === 'admin') {
        userToChange.role = newRole;

        await userToChange.save();

        return res.status(200).json({ message: 'Rol de usuario actualizado con éxito' });
      } else {
        return res.status(403).json({ message: 'No tienes permiso para realizar esta acción.' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al actualizar el rol de usuario' });
    }
  } else {
    return res.status(403).json({ message: 'No estás autenticado.' });
  }
};

const documents = async (req, res) => {
  try {
    const { uid } = req.params;
    const uploadedFiles = req.files;

    if (!uploadedFiles) {
      return res.status(400).json({ error: 'No se han subido archivos.' });
    }

    const user = await UserModel.findById(uid);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const userDocuments = uploadedFiles.map(file => ({
      name: file.originalname,
      reference: file.path,
    }));

    user.documents = userDocuments;

    await user.save();

    res.status(200).json({ message: 'Documentos subidos exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = {
  create,
  changeUserRole,
  documents
};
