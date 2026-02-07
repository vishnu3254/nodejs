const prisma = require('../prisma/prismaClient');
let users = [];

const listUsers = async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
}

const createUser = async (req, res, next) => {
    const user = req.body;
    if ( !user.id || !user.name ) {
        const err = new Error('id and name are required');
        err.statusCode = 400;
        return next(err);
    }
   const createdUser = await prisma.user.create({
    data: {name: user.name}
   })
    res.json({user: createdUser});
}

const updateUser = async (req, res) => {
    const id = req.params.id;
    console.log('id', id);
    const user = await prisma.user.findUnique({
        where: {
            id: Number(id)
        }
    });
    if ( !user ) {
        res.status(404).json({ error: 'user not found' });
    }
    const updatedUser = await prisma.user.update({
        where: {
            id: Number(id)
        },
        data: {
            name: req.body.name
        }
    });
    res.json({
        message: 'user updated successfully',
        user: updatedUser
    });
}

module.exports = {
    listUsers,
    createUser,
    updateUser
}