const { retrieveRouter } = require('../../../routes/apiRouter')
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { Book, Course, Semester, User, Subject, sequelize } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const { Op } = require('sequelize');


const readBooks = async (req, res) => {
    const { limit, page, search, status, courseId, semesterId } = req.query

    let where = {}
    if (search) {
        where = {
            [Op.and]: [
                {
                    [Op.or]: [
                        { bookName: { [Op.like]: "%" + search + "%" } },
                        { writerName: { [Op.like]: "%" + search + "%" } },
                    ]
                },
            ],
        }
    }else{
        if (courseId) {
            where = { ...where, courseId: courseId }
        }
        if (semesterId) {
            where = { ...where, semesterId: semesterId }
        }
        if (status) {
            where = { ...where, status: status }
        }
    }


    let books = await Book.findAll({
        where: where,
        include: [
            { model: Course, as: "course", attributes: [] },
            { model: Semester, as: "semester", attributes: [] },
            { model: Subject, as: "subject", attributes: [] },
            { model: User, as: 'user', attributes: [] }
        ],
        attributes: [
            'id',
            [sequelize.col('course.courseName'), 'courseName'],
            [sequelize.col('semester.semester'), 'semesterName'],
            [sequelize.col('subject.subjectName'), 'subjectName'],
            [sequelize.col('subject.id'), 'subjectId'],
            [sequelize.col('semester.id'), 'semesterId'],
            [sequelize.col('course.id'), 'courseId'],
            'bookName',
            'writerName',
            'fileName',
            'fileType',
            [sequelize.col('user.name'), 'createdBy'],
            'status',
            'createdAt',
            'updatedAt'
        ],
        limit: +limit,
        offset: page * limit,
        order: [['id', 'DESC']]
    })
    if (books.length) {
        let rows = await Book.count()
        res.json(success('Successfully retrieve', { rows: books, totalRecords: rows }))
    } else {
        res.json(success('Successfully retrieve', { rows: [], totalRecords: 0 }))
    }
}

retrieveRouter.get('/admin/books', authMiddleware(), wrapRequestHandler(readBooks))