const pool = require('../config/database');

exports.getCourse = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(
      `
      SELECT c.id, c.title, uc.progress, uc.status, c.link
      FROM courses c
      JOIN user_courses uc ON c.id = uc.course_id
      WHERE uc.user_id = $1
    `,
      [userId],
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Error fetching courses' });
  }
};

exports.putCourse = async (req, res) => {
  const userId = req.user.id;
  const courseId = req.params.id;
  const { progress, status } = req.body;
  try {
    await pool.query(
      `
      UPDATE user_courses
      SET progress = $1, status = $2, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $3 AND course_id = $4
    `,
      [progress, status, userId, courseId],
    );
    res.status(204).send();
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Error updating course' });
  }
};
