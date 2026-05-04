

const pool = require('../db');

const getAllTasks = async (req, res, next) => {
    try {
        const result = await pool.query("SELECT * FROM tasks");
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
    
};

const getTaskById = async (req, res, next) => {
    try {
        const { id } = req.params;
       
        const resultid = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
        if (resultid.rows.length === 0) {
            return res.status(404).json({ message: "Tarea no encontrada" });
        }
        res.json(resultid.rows[0]);
    } catch (error) {
        next(error);
    }
    
};

const createTask = async (req, res, next) => {
 const {title, description}  =  req.body; // Aquí se puede acceder a los datos enviados en el cuerpo de la solicitud
 try {
     const result = await pool.query(
         "INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *",
         [title, description]
     );
     res.json(result.rows[0]); // Devuelve la tarea recién creada como respuesta
 } catch (error) {
  next(error);
 }  
};

const deleteTask = async (req, res, next) => {

        const { id } = req.params;
        try {

       
        const result = await pool.query("DELETE FROM tasks WHERE id = $1", [id]);

       if (result.rowCount === 0) {
            return res.status(404).json({ message: "Tarea no encontrada" });
        }

       return res.sendStatus(204); // No Content, indicando que la tarea fue eliminada exitosamente   
} catch (error) {
    next(error);
}
};

const updateTask = async (req, res, next) => {

    const { id } = req.params;
    try {
    const { title, description } = req.body;

    const result = await pool.query(
        "UPDATE tasks SET title = $1, description = $2 WHERE id = $3 RETURNING *",
        [title, description, id]
    );



 if (result.rowCount === 0) {
    return res.status(404).json({ message: "Tarea no encontrada" });
 }   

 return res.json(result.rows[0]); // Devuelve la tarea actualizada como respuesta

} catch (error) {
    next(error);
}
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    deleteTask,
    updateTask
}